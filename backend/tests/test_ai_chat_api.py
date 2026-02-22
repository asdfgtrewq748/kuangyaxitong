import asyncio

from fastapi.testclient import TestClient

from app.main import app
from app.routes import ai_chat as ai_chat_route


client = TestClient(app)


class _FakeService:
    def __init__(self):
        self.sessions = {"s1": object()}
        self.api_key = "key"
        self.chat_calls = []

    async def chat(self, **kwargs):
        self.chat_calls.append(kwargs)
        return {
            "success": True,
            "content": "answer",
            "model": kwargs.get("model"),
            "tokens": 12,
            "error": None,
        }

    async def chat_stream(self, **kwargs):
        yield 'line "1"\n'
        yield "line2"

    def get_session_info(self, session_id):
        if session_id == "missing":
            return None
        return {
            "session_id": session_id,
            "user_id": "u1",
            "message_count": 1,
            "created_at": "2026-01-01T00:00:00",
            "updated_at": "2026-01-01T00:00:00",
            "messages": [{"role": "user", "content": "hello"}],
        }

    def delete_session(self, session_id):
        return session_id != "missing"

    def clear_session(self, session_id):
        return session_id != "missing"

    def list_sessions(self, user_id=None):
        items = [
            {
                "session_id": "s1",
                "user_id": "u1",
                "message_count": 2,
                "created_at": "2026-01-01T00:00:00",
                "updated_at": "2026-01-01T00:00:00",
            },
            {
                "session_id": "s2",
                "user_id": "u2",
                "message_count": 1,
                "created_at": "2026-01-01T00:00:00",
                "updated_at": "2026-01-01T00:00:00",
                "messages": [{"role": "assistant", "content": "ok"}],
            },
        ]
        if user_id:
            return [x for x in items if x["user_id"] == user_id]
        return items


def test_chat_endpoint_auto_session(monkeypatch):
    fake = _FakeService()
    monkeypatch.setattr(ai_chat_route, "get_ai_chat_service", lambda: fake)
    monkeypatch.setattr("uuid.uuid4", lambda: "fixed-session-id")

    resp = client.post(
        "/api/ai-chat/chat",
        json={"message": "hello", "model": "glm-5-flash", "temperature": 0.1, "max_tokens": 100},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert data["content"] == "answer"
    assert data["session_id"] == "fixed-session-id"
    assert fake.chat_calls[-1]["session_id"] == "fixed-session-id"


def test_chat_endpoint_rejects_stream(monkeypatch):
    monkeypatch.setattr(ai_chat_route, "get_ai_chat_service", lambda: _FakeService())
    resp = client.post("/api/ai-chat/chat", json={"message": "hello", "stream": True, "session_id": "s1"})
    assert resp.status_code == 400


def test_stream_generator_and_endpoint(monkeypatch):
    fake = _FakeService()
    monkeypatch.setattr(ai_chat_route, "get_ai_chat_service", lambda: fake)

    # endpoint
    resp = client.post("/api/ai-chat/chat/stream", json={"message": "hello", "session_id": "s1"})
    assert resp.status_code == 200
    assert "text/event-stream" in resp.headers.get("content-type", "")
    body = resp.text
    assert '"type": "start"' in body
    assert '"type": "chunk"' in body
    assert '\\"1\\"\\n' in body  # escaped quote + newline
    assert '"type": "end"' in body

    # helper exception branch
    class _BadService:
        async def chat_stream(self, **kwargs):
            raise RuntimeError("boom")
            yield "never"  # pragma: no cover

    async def _collect():
        out = []
        async for piece in ai_chat_route._stream_generator(_BadService(), "s1", "hello"):
            out.append(piece)
        return out

    out = asyncio.run(_collect())
    joined = "".join(out)
    assert "event: error" in joined
    assert "boom" in joined


def test_session_management_endpoints(monkeypatch):
    monkeypatch.setattr(ai_chat_route, "get_ai_chat_service", lambda: _FakeService())

    assert client.get("/api/ai-chat/sessions/s1").status_code == 200
    assert client.get("/api/ai-chat/sessions/missing").status_code == 404

    assert client.delete("/api/ai-chat/sessions/s1").status_code == 200
    assert client.delete("/api/ai-chat/sessions/missing").status_code == 404

    assert client.post("/api/ai-chat/sessions/s1/clear").status_code == 200
    assert client.post("/api/ai-chat/sessions/missing/clear").status_code == 404


def test_list_sessions_health_and_suggest(monkeypatch):
    fake = _FakeService()
    monkeypatch.setattr(ai_chat_route, "get_ai_chat_service", lambda: fake)

    resp = client.get("/api/ai-chat/sessions")
    assert resp.status_code == 200
    sessions = resp.json()
    assert len(sessions) == 2
    # route now tolerates missing messages by defaulting to [].
    assert sessions[0]["messages"] == []

    resp = client.get("/api/ai-chat/sessions?user_id=u1")
    assert resp.status_code == 200
    assert len(resp.json()) == 1

    health = client.get("/api/ai-chat/health")
    assert health.status_code == 200
    assert health.json()["active_sessions"] == 1
    assert health.json()["api_configured"] is True

    fake.api_key = "YOUR_API_KEY"
    assert client.get("/api/ai-chat/health").json()["api_configured"] is False

    assert client.post("/api/ai-chat/suggest", json={"message": "csv", "stream": False}).json()["context"] == "data"
    assert client.post("/api/ai-chat/suggest", json={"message": "mpi", "stream": False}).json()["context"] == "analysis"
    assert client.post("/api/ai-chat/suggest", json={"message": "3d", "stream": False}).json()["context"] == "visualization"
    assert client.post("/api/ai-chat/suggest", json={"message": "hello", "stream": False}).json()["context"] == "general"
