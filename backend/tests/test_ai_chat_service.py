import asyncio
import sys
from datetime import datetime
from types import SimpleNamespace

from app.services import ai_chat


def test_chat_message_and_session_basics():
    msg = ai_chat.ChatMessage(role=ai_chat.MessageRole.USER, content="hello")
    payload = msg.to_dict()
    assert payload == {"role": ai_chat.MessageRole.USER, "content": "hello"}

    parsed = ai_chat.ChatMessage.from_dict(
        {"role": ai_chat.MessageRole.ASSISTANT, "content": "ok", "timestamp": datetime.now().isoformat()}
    )
    assert parsed.role == ai_chat.MessageRole.ASSISTANT
    assert parsed.content == "ok"

    session = ai_chat.ChatSession("s1", user_id="u1")
    session.add_message(ai_chat.MessageRole.USER, "q1")
    session.add_message(ai_chat.MessageRole.ASSISTANT, "a1")
    context = session.get_context(max_history=1)
    assert context == [{"role": ai_chat.MessageRole.ASSISTANT, "content": "a1"}]
    session.clear()
    assert session.messages == []


def test_service_session_management_and_listing():
    service = ai_chat.AIChatService()
    s1 = service.get_or_create_session("s1", user_id="u1")
    s1.add_message(ai_chat.MessageRole.USER, "hello")
    s1.add_message(ai_chat.MessageRole.ASSISTANT, "world")

    info = service.get_session_info("s1")
    assert info["session_id"] == "s1"
    # System prompt is excluded in session_info messages.
    assert len(info["messages"]) == 2

    s2 = service.get_or_create_session("s2", user_id="u2")
    s2.add_message(ai_chat.MessageRole.USER, "x")
    all_sessions = service.list_sessions()
    assert len(all_sessions) == 2
    assert all_sessions[0]["updated_at"] >= all_sessions[1]["updated_at"]
    assert len(service.list_sessions(user_id="u1")) == 1

    assert service.clear_session("s1") is True
    assert service.clear_session("missing") is False
    assert service.delete_session("s2") is True
    assert service.delete_session("missing") is False
    assert service.get_session_info("missing") is None


def test_get_ai_chat_service_singleton():
    ai_chat._ai_chat_service = None
    one = ai_chat.get_ai_chat_service()
    two = ai_chat.get_ai_chat_service()
    assert one is two


def test_chat_stream_success(monkeypatch):
    chunks = []
    lines = [
        "event: ignored",
        'data: {"choices":[{"delta":{"content":"Hi"}}]}',
        "data: not-json",
        'data: {"choices":[{"delta":{"content":" there"}}]}',
        "data: [DONE]",
    ]

    class _Response:
        status_code = 200

        async def __aenter__(self):
            return self

        async def __aexit__(self, exc_type, exc, tb):
            return False

        async def aread(self):
            return b""

        async def aiter_lines(self):
            for item in lines:
                yield item

    class _Client:
        def __init__(self, timeout):
            self.timeout = timeout

        async def __aenter__(self):
            return self

        async def __aexit__(self, exc_type, exc, tb):
            return False

        def stream(self, method, url, headers, json):
            assert method == "POST"
            assert json["stream"] is True
            return _Response()

    monkeypatch.setitem(sys.modules, "httpx", SimpleNamespace(AsyncClient=_Client))

    async def _run():
        service = ai_chat.AIChatService()
        async for piece in service.chat_stream("s1", "hello"):
            chunks.append(piece)
        info = service.get_session_info("s1")
        return info

    info = asyncio.run(_run())
    assert "".join(chunks) == "Hi there"
    assert info["messages"][-1]["content"] == "Hi there"


def test_chat_stream_status_error(monkeypatch):
    class _Response:
        status_code = 500

        async def __aenter__(self):
            return self

        async def __aexit__(self, exc_type, exc, tb):
            return False

        async def aread(self):
            return b"bad"

        async def aiter_lines(self):
            if False:
                yield ""

    class _Client:
        def __init__(self, timeout):
            self.timeout = timeout

        async def __aenter__(self):
            return self

        async def __aexit__(self, exc_type, exc, tb):
            return False

        def stream(self, method, url, headers, json):
            return _Response()

    monkeypatch.setitem(sys.modules, "httpx", SimpleNamespace(AsyncClient=_Client))

    async def _run():
        service = ai_chat.AIChatService()
        out = []
        async for piece in service.chat_stream("s1", "hello"):
            out.append(piece)
        return out

    out = asyncio.run(_run())
    assert len(out) == 1
    assert "500" in out[0]


def test_chat_stream_exception(monkeypatch):
    class _Client:
        def __init__(self, timeout):
            self.timeout = timeout

        async def __aenter__(self):
            raise RuntimeError("stream boom")

        async def __aexit__(self, exc_type, exc, tb):
            return False

    monkeypatch.setitem(sys.modules, "httpx", SimpleNamespace(AsyncClient=_Client))

    async def _run():
        service = ai_chat.AIChatService()
        out = []
        async for piece in service.chat_stream("s1", "hello"):
            out.append(piece)
        return out

    out = asyncio.run(_run())
    assert len(out) == 1
    assert "stream boom" in out[0]


def test_chat_non_stream_branches(monkeypatch):
    class _RespErr:
        status_code = 503

        def json(self):
            return {}

    class _RespOk:
        status_code = 200

        def __init__(self, payload):
            self._payload = payload

        def json(self):
            return self._payload

    class _Client:
        _responses = [
            _RespErr(),
            _RespOk({"choices": [{"message": {"content": "answer"}}], "usage": {"total_tokens": 42}}),
            _RespOk({}),
        ]

        def __init__(self, timeout):
            self.timeout = timeout

        async def __aenter__(self):
            return self

        async def __aexit__(self, exc_type, exc, tb):
            return False

        async def post(self, url, headers, json):
            return self.__class__._responses.pop(0)

    monkeypatch.setitem(sys.modules, "httpx", SimpleNamespace(AsyncClient=_Client))

    async def _run():
        service = ai_chat.AIChatService()
        first = await service.chat("s1", "m1")
        second = await service.chat("s1", "m2")
        third = await service.chat("s1", "m3")
        return first, second, third, service

    first, second, third, service = asyncio.run(_run())
    assert first["success"] is False
    assert second["success"] is True
    assert second["content"] == "answer"
    assert second["tokens"] == 42
    # Current implementation returns None when status=200 but no choices.
    assert third is None
    info = service.get_session_info("s1")
    assert any(m["content"] == "answer" for m in info["messages"])


def test_chat_non_stream_exception(monkeypatch):
    class _Client:
        def __init__(self, timeout):
            self.timeout = timeout

        async def __aenter__(self):
            raise RuntimeError("chat boom")

        async def __aexit__(self, exc_type, exc, tb):
            return False

    monkeypatch.setitem(sys.modules, "httpx", SimpleNamespace(AsyncClient=_Client))

    async def _run():
        service = ai_chat.AIChatService()
        return await service.chat("s1", "hello")

    result = asyncio.run(_run())
    assert result["success"] is False
    assert "chat boom" in result["error"]
