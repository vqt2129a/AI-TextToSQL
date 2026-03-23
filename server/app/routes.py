import time
from fastapi import APIRouter
from sqlalchemy import text

import config
from config import logger
from database import engine, get_table_schema
from ai import chat_with_ai, summarize_results
from utils import clean_sql
from schemas import QueryRequest

router = APIRouter()

@router.post("/api/query")
async def query_sql(req: QueryRequest):
    """
    Chatbot endpoint: xử lý câu hỏi ngôn ngữ tự nhiên.
    Tự phân biệt chat thường vs truy vấn dữ liệu.
    """
    start_ts = time.time()

    if not config.VALID_MODEL_ID:
        return {
            "success": False,
            "error": "AI Model chưa sẵn sàng. Kiểm tra startup logs."
        }

    try:
        schema = get_table_schema()
        
        # Convert history to dict format
        history = []
        if req.history:
            for msg in req.history:
                history.append({"role": msg.role, "content": msg.content})
        
        # Ask AI
        ai_result = chat_with_ai(req.question, schema, history)
        
        # Chat response
        if ai_result["type"] == "chat":
            return {
                "question": req.question,
                "sql_query": None,
                "result": None,
                "message": ai_result.get("message", ""),
                "execution_time": round(time.time() - start_ts, 3),
                "success": True,
                "response_type": "chat"
            }
        
        # Error
        if ai_result["type"] == "error":
            return {
                "success": False,
                "error": ai_result.get("message", "Lỗi không xác định")
            }
        
        # SQL response
        raw_sql = ai_result.get("sql", "")
        sql = clean_sql(raw_sql)
        ai_message = ai_result.get("message", "")

        if not sql.upper().startswith("SELECT"):
            return {
                "success": False,
                "error": f"SQL không hợp lệ: {sql}"
            }

        with engine.connect() as conn:
            db_result = conn.execute(text(sql))
            data = [dict(row) for row in db_result.mappings()]

        # Tóm tắt kết quả bằng NLP
        summary = summarize_results(req.question, sql, data)

        return {
            "question": req.question,
            "sql_query": sql,
            "result": data,
            "message": summary or ai_message,
            "execution_time": round(time.time() - start_ts, 3),
            "success": True,
            "response_type": "sql"
        }

    except Exception as e:
        logger.error(f"Query Error: {e}")
        return {"success": False, "error": str(e)}

@router.get("/api/status")
@router.get("/api/health")  # backward compat
async def check_status():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_connected = True
    except Exception:
        db_connected = False

    return {
        "status": "online",
        "database": {
            "connected": db_connected,
            "schema_available": bool(get_table_schema())
        },
        "ai_model": config.VALID_MODEL_ID or "unavailable",
        "timestamp": time.time()
    }

@router.get("/api/db-info")
@router.get("/api/schema")  # backward compat
async def get_db_info():
    schema = get_table_schema()
    return {
        "schema": schema,
        "tables": schema.count("Table") if schema else 0
    }
