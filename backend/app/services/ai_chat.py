"""
AI Chat Service supporting GLM-5 and Kimi APIs

Provides intelligent chat assistance for the mining pressure assessment system.
"""

import os
import asyncio
from typing import AsyncGenerator, Dict, Any, List, Optional
from datetime import datetime
import json
import logging

logger = logging.getLogger(__name__)

# GLM-5 API configuration
GLM5_API_KEY = os.getenv("ZHIPUAI_API_KEY", "b7b15661df2e4926ab77733fe926f41c.8hrmaBnFlQMHXwWt")
GLM5_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions"

# Kimi API configuration
KIMI_API_KEY = os.getenv("KIMI_API_KEY", "sk-kimi-3IuF39x3lH87PaAdZzmwOu0gKiqJTeaKgaHh4gtNGWyEeR8ltChQnQ40xfTmJlnU")
KIMI_API_URL = "https://api.moonshot.cn/v1/chat/completions"

# Supported models
SUPPORTED_MODELS = {
    # GLM-5 models
    "glm-5": {"provider": "glm5", "name": "GLM-5"},
    "glm-5-flash": {"provider": "glm5", "name": "GLM-5 Flash"},
    # Kimi models
    "kimi-moonshot-v1-8k": {"provider": "kimi", "name": "Kimi Moonshot v1 8K"},
    "kimi-moonshot-v1-32k": {"provider": "kimi", "name": "Kimi Moonshot v1 32K"},
    "kimi-moonshot-v1-128k": {"provider": "kimi", "name": "Kimi Moonshot v1 128K"},
}


class MessageRole:
    """Chat message roles"""
    SYSTEM = "system"
    USER = "user"
    ASSISTANT = "assistant"


class ChatMessage:
    """Chat message data structure"""

    def __init__(
        self,
        role: str,
        content: str,
        timestamp: Optional[datetime] = None
    ):
        self.role = role
        self.content = content
        self.timestamp = timestamp or datetime.now()

    def to_dict(self) -> Dict[str, str]:
        return {"role": self.role, "content": self.content}

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "ChatMessage":
        return cls(
            role=data["role"],
            content=data["content"],
            timestamp=datetime.fromisoformat(data.get("timestamp")) if data.get("timestamp") else datetime.now()
        )


class ChatSession:
    """Chat session with conversation history"""

    def __init__(self, session_id: str, user_id: Optional[str] = None):
        self.session_id = session_id
        self.user_id = user_id
        self.messages: List[ChatMessage] = []
        self.created_at = datetime.now()
        self.updated_at = datetime.now()
        self.metadata: Dict[str, Any] = {}

    def add_message(self, role: str, content: str) -> ChatMessage:
        """Add a message to the session"""
        message = ChatMessage(role=role, content=content)
        self.messages.append(message)
        self.updated_at = datetime.now()
        return message

    def get_context(self, max_history: int = 10) -> List[Dict[str, str]]:
        """Get conversation context for API call"""
        recent_messages = self.messages[-max_history:] if self.messages else []
        return [msg.to_dict() for msg in recent_messages]

    def clear(self) -> None:
        """Clear all messages"""
        self.messages = []
        self.updated_at = datetime.now()


class AIChatService:
    """
    AI Chat Service using GLM-5 API

    Provides intelligent assistance for:
    - Project documentation and code questions
    - Mining pressure assessment guidance
    - Technical support and troubleshooting
    """

    # System prompt for the AI assistant
    SYSTEM_PROMPT = """你是矿压影响评价系统的智能助手，专门帮助用户了解和使用这个系统。

系统的核心功能包括：
1. 钻孔数据管理和可视化
2. 煤层参数插值和等值线生成
3. 矿压指标(MPI)计算和分析
4. 地质建模和3D可视化
5. 微震监测数据分析
6. 算法验证和研究工作台

你的职责：
- 回答关于系统功能和使用的问题
- 解释技术概念和算法原理
- 提供操作指导和故障排除建议
- 帮助用户理解分析结果

回答时请：
- 简洁明了，避免过度冗长
- 使用专业但易懂的语言
- 针对具体问题提供实用建议
- 如果问题超出范围，诚实告知用户
"""

    def __init__(self):
        self.sessions: Dict[str, ChatSession] = {}
        self.glm5_api_key = GLM5_API_KEY
        self.glm5_api_url = GLM5_API_URL
        self.kimi_api_key = KIMI_API_KEY
        self.kimi_api_url = KIMI_API_URL

    def _get_provider_config(self, model: str) -> tuple[str, str, str]:
        """
        Get API configuration for the specified model
        
        Returns:
            Tuple of (provider, api_key, api_url)
        """
        model_info = SUPPORTED_MODELS.get(model, {"provider": "glm5"})
        provider = model_info["provider"]
        
        if provider == "kimi":
            return ("kimi", self.kimi_api_key, self.kimi_api_url)
        else:
            return ("glm5", self.glm5_api_key, self.glm5_api_url)

    def get_or_create_session(self, session_id: str, user_id: Optional[str] = None) -> ChatSession:
        """Get existing session or create new one"""
        if session_id not in self.sessions:
            # Initialize with system prompt
            session = ChatSession(session_id, user_id)
            session.add_message(MessageRole.SYSTEM, self.SYSTEM_PROMPT)
            self.sessions[session_id] = session
            logger.info(f"Created new chat session: {session_id}")
        return self.sessions[session_id]

    def clear_session(self, session_id: str) -> bool:
        """Clear a chat session"""
        if session_id in self.sessions:
            self.sessions[session_id].clear()
            return True
        return False

    def delete_session(self, session_id: str) -> bool:
        """Delete a chat session"""
        if session_id in self.sessions:
            del self.sessions[session_id]
            return True
        return False

    async def chat_stream(
        self,
        session_id: str,
        message: str,
        user_id: Optional[str] = None,
        model: str = "glm-5-flash",
        temperature: float = 0.7,
        max_tokens: int = 2048
    ) -> AsyncGenerator[str, None]:
        """
        Send chat message and stream response

        Args:
            session_id: Chat session identifier
            message: User message
            user_id: Optional user identifier
            model: Model name (glm-5-flash for speed, glm-5 for quality)
            temperature: Response randomness (0-1)
            max_tokens: Maximum response tokens

        Yields:
            Response text chunks
        """
        session = self.get_or_create_session(session_id, user_id)

        # Add user message to session
        session.add_message(MessageRole.USER, message)

        # Prepare API request
        messages = session.get_context()

        try:
            import httpx

            # Get provider-specific configuration
            provider, api_key, api_url = self._get_provider_config(model)
            
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }

            payload = {
                "model": model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
                "stream": True
            }

            logger.info(f"Using {provider} API with model: {model}")

            async with httpx.AsyncClient(timeout=60.0) as client:
                async with client.stream("POST", api_url, headers=headers, json=payload) as response:
                    if response.status_code != 200:
                        error_text = await response.aread()
                        logger.error(f"{provider.upper()} API error: {response.status_code} - {error_text}")
                        yield f"[错误] API调用失败: {response.status_code}"
                        return

                    full_response = ""
                    async for line in response.aiter_lines():
                        if not line.startswith("data: "):
                            continue

                        data_str = line[6:]  # Remove "data: " prefix

                        if data_str.strip() == "[DONE]":
                            break

                        try:
                            data = json.loads(data_str)
                            if "choices" in data and len(data["choices"]) > 0:
                                delta = data["choices"][0].get("delta", {})
                                content = delta.get("content", "")
                                if content:
                                    full_response += content
                                    yield content
                        except json.JSONDecodeError:
                            continue

                    # Add assistant response to session
                    if full_response:
                        session.add_message(MessageRole.ASSISTANT, full_response)

        except Exception as e:
            logger.error(f"Chat streaming error: {e}")
            yield f"[错误] 聊天服务暂时不可用: {str(e)}"

    async def chat(
        self,
        session_id: str,
        message: str,
        user_id: Optional[str] = None,
        model: str = "glm-5-flash",
        temperature: float = 0.7,
        max_tokens: int = 2048
    ) -> Dict[str, Any]:
        """
        Send chat message and get complete response

        Returns:
            Response dict with content, metadata
        """
        session = self.get_or_create_session(session_id, user_id)
        session.add_message(MessageRole.USER, message)

        messages = session.get_context()

        try:
            import httpx

            # Get provider-specific configuration
            provider, api_key, api_url = self._get_provider_config(model)
            
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }

            payload = {
                "model": model,
                "messages": messages,
                "temperature": temperature,
                "max_tokens": max_tokens,
                "stream": False
            }

            logger.info(f"Using {provider} API with model: {model}")

            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(api_url, headers=headers, json=payload)

                if response.status_code != 200:
                    return {
                        "success": False,
                        "error": f"API调用失败: {response.status_code}",
                        "content": "抱歉，AI助手暂时无法响应。请稍后再试。"
                    }

                data = response.json()

                if "choices" in data and len(data["choices"]) > 0:
                    content = data["choices"][0]["message"]["content"]
                    session.add_message(MessageRole.ASSISTANT, content)

                    return {
                        "success": True,
                        "content": content,
                        "model": model,
                        "tokens": data.get("usage", {}).get("total_tokens", 0)
                    }

        except Exception as e:
            logger.error(f"Chat error: {e}")
            return {
                "success": False,
                "error": str(e),
                "content": "抱歉，AI助手暂时无法响应。请稍后再试。"
            }

    def get_session_info(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get session information"""
        if session_id not in self.sessions:
            return None

        session = self.sessions[session_id]
        return {
            "session_id": session.session_id,
            "user_id": session.user_id,
            "message_count": len(session.messages),
            "created_at": session.created_at.isoformat(),
            "updated_at": session.updated_at.isoformat(),
            "messages": [
                {
                    "role": msg.role,
                    "content": msg.content,
                    "timestamp": msg.timestamp.isoformat()
                }
                for msg in session.messages
                if msg.role != MessageRole.SYSTEM  # Exclude system prompt
            ]
        }

    def list_sessions(self, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """List all sessions (optionally filtered by user)"""
        sessions = []
        for session_id, session in self.sessions.items():
            if user_id is None or session.user_id == user_id:
                sessions.append({
                    "session_id": session_id,
                    "user_id": session.user_id,
                    "message_count": len(session.messages),
                    "created_at": session.created_at.isoformat(),
                    "updated_at": session.updated_at.isoformat()
                })
        return sorted(sessions, key=lambda x: x["updated_at"], reverse=True)


# Global service instance
_ai_chat_service: Optional[AIChatService] = None


def get_ai_chat_service() -> AIChatService:
    """Get global AI chat service instance"""
    global _ai_chat_service
    if _ai_chat_service is None:
        _ai_chat_service = AIChatService()
    return _ai_chat_service
