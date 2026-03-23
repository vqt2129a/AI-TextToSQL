from pydantic import BaseModel
from typing import List, Optional

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class QueryRequest(BaseModel):
    """
    Request body for chatbot endpoint
    """
    question: str
    history: Optional[List[ChatMessage]] = []
