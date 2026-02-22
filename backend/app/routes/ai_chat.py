"""
AI Chat API Routes

Provides REST and SSE endpoints for AI chat functionality using GLM-5.
"""

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import logging
import json

from ..services.ai_chat import get_ai_chat_service, MessageRole

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/ai-chat", tags=["AI Chat"])


class ChatMessage(BaseModel):
    """Chat message model"""
    role: str
    content: str
    timestamp: Optional[str] = None


class ChatRequest(BaseModel):
    """Chat request model"""
    message: str
    session_id: Optional[str] = None
    user_id: Optional[str] = None
    model: str = "glm-5-flash"
    temperature: float = 0.7
    max_tokens: int = 2048
    stream: bool = False


class ChatResponse(BaseModel):
    """Chat response model"""
    success: bool
    content: str
    session_id: str
    model: Optional[str] = None
    tokens: Optional[int] = None
    error: Optional[str] = None


class SessionInfo(BaseModel):
    """Session information model"""
    session_id: str
    user_id: Optional[str] = None
    message_count: int
    created_at: str
    updated_at: str
    messages: List[ChatMessage]


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest) -> ChatResponse:
    """
    Send a chat message and get AI response

    - Supports both streaming and non-streaming modes
    - Uses GLM-5 Flash for fast responses
    - Maintains conversation history per session
    """
    service = get_ai_chat_service()

    # Generate session ID if not provided
    if not request.session_id:
        import uuid
        request.session_id = str(uuid.uuid4())

    if request.stream:
        # Streaming response handled separately
        raise HTTPException(status_code=400, detail="Use /chat/stream endpoint for streaming")

    result = await service.chat(
        session_id=request.session_id,
        message=request.message,
        user_id=request.user_id,
        model=request.model,
        temperature=request.temperature,
        max_tokens=request.max_tokens
    )

    return ChatResponse(
        success=result["success"],
        content=result.get("content", ""),
        session_id=request.session_id,
        model=result.get("model"),
        tokens=result.get("tokens"),
        error=result.get("error")
    )


async def _stream_generator(service, session_id: str, message: str, **kwargs):
    """Helper for SSE streaming"""
    yield "event: start\n"
    yield f"data: {{\"session_id\": \"{session_id}\", \"type\": \"start\"}}\n\n"

    try:
        async for chunk in service.chat_stream(
            session_id=session_id,
            message=message,
            **kwargs
        ):
            # Send chunk as SSE event
            escaped = chunk.replace("\n", "\\n").replace('"', '\\"')
            yield f"data: {{\"type\": \"chunk\", \"content\": \"{escaped}\"}}\n\n"

        yield "event: end\n"
        yield "data: {\"type\": \"end\"}\n\n"

    except Exception as e:
        logger.error(f"Streaming error: {e}")
        yield f"event: error\n"
        yield f"data: {{\"type\": \"error\", \"message\": \"{str(e)}\"}}\n\n"


@router.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """
    Send a chat message and stream AI response via Server-Sent Events

    - Returns streaming response for real-time chat experience
    - Supports GLM-5 Flash and GLM-5 models
    """
    service = get_ai_chat_service()

    # Generate session ID if not provided
    if not request.session_id:
        import uuid
        request.session_id = str(uuid.uuid4())

    return StreamingResponse(
        _stream_generator(
            service,
            request.session_id,
            request.message,
            user_id=request.user_id,
            model=request.model,
            temperature=request.temperature,
            max_tokens=request.max_tokens
        ),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no"
        }
    )


@router.get("/sessions/{session_id}", response_model=SessionInfo)
async def get_session(session_id: str) -> SessionInfo:
    """Get chat session information including message history"""
    service = get_ai_chat_service()
    info = service.get_session_info(session_id)

    if not info:
        raise HTTPException(status_code=404, detail="Session not found")

    return SessionInfo(**info)


@router.delete("/sessions/{session_id}")
async def delete_session(session_id: str) -> Dict[str, Any]:
    """Delete a chat session"""
    service = get_ai_chat_service()
    deleted = service.delete_session(session_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Session not found")

    return {"success": True, "session_id": session_id}


@router.post("/sessions/{session_id}/clear")
async def clear_session(session_id: str) -> Dict[str, Any]:
    """Clear all messages in a session (keeps the session)"""
    service = get_ai_chat_service()
    cleared = service.clear_session(session_id)

    if not cleared:
        raise HTTPException(status_code=404, detail="Session not found")

    return {"success": True, "session_id": session_id}


@router.get("/sessions")
async def list_sessions(user_id: Optional[str] = None) -> List[SessionInfo]:
    """List all chat sessions (optionally filtered by user)"""
    service = get_ai_chat_service()
    sessions = service.list_sessions(user_id)
    normalized = []
    for session in sessions:
        payload = dict(session)
        payload.setdefault("messages", [])
        normalized.append(SessionInfo(**payload))
    return normalized


@router.get("/health")
async def health_check() -> Dict[str, Any]:
    """Check AI chat service health"""
    service = get_ai_chat_service()
    return {
        "status": "healthy",
        "active_sessions": len(service.sessions),
        "api_configured": bool(service.api_key and service.api_key != "YOUR_API_KEY")
    }


@router.post("/suggest")
async def get_suggestions(message: ChatRequest) -> Dict[str, Any]:
    """
    Get quick AI-powered suggestions for common tasks

    Returns suggested actions or questions based on context.
    """
    # Predefined suggestions based on system features
    suggestions = {
        "general": [
            "如何导入钻孔数据？",
            "什么是MPI矿压指标？",
            "如何生成煤层等值线图？",
            "微震监测数据如何分析？"
        ],
        "data": [
            "查看钻孔数据统计",
            "导出插值结果",
            "修复编码问题"
        ],
        "analysis": [
            "计算MPI指标",
            "生成等值线图",
            "运行算法验证"
        ],
        "visualization": [
            "打开3D地质模型",
            "查看MPI热力图",
            "显示钻孔分布图"
        ]
    }

    # Simple keyword matching for context
    lower_msg = message.message.lower()
    context = "general"

    if any(kw in lower_msg for kw in ["数据", "导入", "钻孔", "csv"]):
        context = "data"
    elif any(kw in lower_msg for kw in ["计算", "分析", "mpi", "指标", "等值线"]):
        context = "analysis"
    elif any(kw in lower_msg for kw in ["图", "可视化", "3d", "模型", "热力图"]):
        context = "visualization"

    return {
        "suggestions": suggestions.get(context, suggestions["general"]),
        "context": context
    }
