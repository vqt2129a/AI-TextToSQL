import google.generativeai as genai
import config
from config import logger


def chat_with_ai(question: str, schema: str, history: list = None) -> dict:
    """
    Full chatbot: phân tích câu hỏi, tạo SQL nếu cần, tóm tắt kết quả bằng ngôn ngữ tự nhiên.
    
    Returns: {
        "type": "sql" | "chat",
        "sql": "...",           # nếu type=sql
        "message": "...",       # câu trả lời tự nhiên
    }
    """
    if not config.VALID_MODEL_ID:
        return {"type": "error", "message": "AI Model chưa sẵn sàng."}

    try:
        model = genai.GenerativeModel(
            model_name=config.VALID_MODEL_ID,
            system_instruction=f"""Bạn là SQL Assistant - trợ lý thông minh chuyên truy vấn cơ sở dữ liệu đơn vị hành chính Việt Nam (sau sáp nhập 2025).

CSDL PostgreSQL gồm các bảng:
{schema}

QUY TẮC:
1. Nếu người dùng hỏi về DỮ LIỆU (tỉnh, thành phố, phường, xã, vùng, thống kê, đếm, so sánh...), hãy:
   - Tạo câu SQL hợp lệ
   - Trả về theo format: SQL:{{câu lệnh SQL}}
   
2. Nếu người dùng CHÀO HỎI, hỏi bạn là ai, hoặc nói chuyện phiếm → trả lời thân thiện bằng tiếng Việt, KHÔNG tạo SQL.

3. Luôn trả lời bằng tiếng Việt tự nhiên, thân thiện.
4. Nhớ ngữ cảnh hội thoại trước đó.
5. Khi trả SQL, chỉ dùng SELECT, không bao giờ dùng INSERT/UPDATE/DELETE.
"""
        )

        # Build conversation history
        chat_history = []
        if history:
            for msg in history[-10:]:  # Giữ 10 tin nhắn gần nhất
                role = "user" if msg.get("role") == "user" else "model"
                chat_history.append({
                    "role": role,
                    "parts": [msg.get("content", "")]
                })

        chat = model.start_chat(history=chat_history)
        response = chat.send_message(question)
        text = response.text.strip() if response.text else ""

        # Check if response contains SQL
        if "SQL:" in text:
            parts = text.split("SQL:", 1)
            message = parts[0].strip()
            sql = parts[1].strip()
            # Clean markdown
            sql = sql.replace("```sql", "").replace("```", "").strip()
            # Remove trailing text after SQL
            if ";" in sql:
                sql = sql[:sql.index(";") + 1]
            return {"type": "sql", "sql": sql, "message": message}
        else:
            return {"type": "chat", "message": text}

    except Exception as e:
        logger.error(f"AI Error: {e}")
        return {"type": "error", "message": f"Lỗi AI: {str(e)}"}


def summarize_results(question: str, sql: str, results: list) -> str:
    """
    Tóm tắt kết quả SQL bằng ngôn ngữ tự nhiên.
    """
    if not config.VALID_MODEL_ID or not results:
        return ""

    try:
        model = genai.GenerativeModel(model_name=config.VALID_MODEL_ID)

        # Limit results for context
        sample = results[:20]
        total = len(results)

        prompt = f"""Dựa trên kết quả truy vấn SQL, hãy tóm tắt ngắn gọn bằng tiếng Việt tự nhiên (2-3 câu).

Câu hỏi: {question}
SQL: {sql}
Tổng số kết quả: {total}
Dữ liệu mẫu (tối đa 20 dòng đầu): {sample}

Tóm tắt:"""

        response = model.generate_content(prompt)
        return response.text.strip() if response.text else ""

    except Exception as e:
        logger.error(f"Summary Error: {e}")
        return ""


# Legacy compatibility
def generate_sql(question: str, schema: str) -> str:
    result = chat_with_ai(question, schema)
    if result["type"] == "sql":
        return result.get("sql", "")
    return ""
