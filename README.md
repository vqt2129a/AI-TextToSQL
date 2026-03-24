# AI Tra Cứu  – Trợ Lý Thông Tin Hành Chính Việt Nam

## Giới thiệu

**AI Tra Cứu** là ứng dụng chatbot thông minh cho phép người dùng **tra cứu thông tin đơn vị hành chính Việt Nam** bằng **ngôn ngữ tự nhiên tiếng Việt**.

- 💬 Hỏi bằng tiếng Việt tự nhiên → AI tự tìm kiếm & trả lời
- 🧠 Nhớ ngữ cảnh hội thoại (follow-up questions)
- 📊 Kết quả hiển thị bảng + tóm tắt bằng ngôn ngữ tự nhiên
- 🔒 Chỉ cho phép truy vấn SELECT (an toàn tuyệt đối)

---

## Kiến trúc hệ thống

```
Người dùng (Tiếng Việt)
   ↓
React Frontend (Vite + Tailwind CSS)
   ↓ nginx reverse proxy
FastAPI Backend (Python)
   ↓
Google Gemini AI (phân loại & sinh SQL)
   ↓
PostgreSQL Database (5 bảng hành chính VN)
   ↓
Kết quả + Tóm tắt NLP
```

---

## Công nghệ sử dụng

| Layer | Công nghệ |
|-------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Axios |
| **Backend** | Python, FastAPI, Uvicorn, SQLAlchemy |
| **AI Model** | Google Gemini (Chat API + NLP Summary) |
| **Database** | PostgreSQL 16 |
| **Deploy** | Docker, Docker Compose, Nginx |

---

## Tính năng chính

- ✅ Chat tự nhiên tiếng Việt (chào hỏi, hỏi đáp)
- ✅ Tự động sinh SQL từ câu hỏi
- ✅ Tóm tắt kết quả bằng ngôn ngữ tự nhiên (NLP)
- ✅ Nhớ ngữ cảnh hội thoại (10 tin nhắn gần nhất)
- ✅ Hiển thị SQL + bảng kết quả
- ✅ Lịch sử truy vấn (lưu localStorage)
- ✅ Xem schema database
- ✅ Dark theme + responsive design
- ✅ Component-based (React)

---

## Cơ sở dữ liệu hành chính

| Bảng | Mô tả | Số bản ghi |
|------|--------|-----------|
| `administrative_regions` | 8 vùng hành chính | 8 |
| `administrative_units` | Loại đơn vị (tỉnh, quận, phường...) | ~10 |
| `provinces` | Tỉnh / Thành phố (sau sáp nhập 2025) | 34 |
| `districts` | Quận / Huyện / Thị xã | 696 |
| `wards` | Phường / Xã / Thị trấn | 3,321 |

---

## Cấu trúc thư mục

```
AI-Text-To-SQL-main/
├── docker-compose.yml        # Docker orchestration
├── init.sql                  # SQL khởi tạo database
├── .env                      # Config Docker (ports, DB)
│
├── server/                   # FastAPI Server (Python)
│   ├── Dockerfile
│   ├── .env                  # GEMINI_API_KEY, DB_URI
│   ├── requirements.txt
│   └── app/
│       ├── main.py           # FastAPI app + model detection
│       ├── config.py         # Env, logging
│       ├── database.py       # DB engine + schema
│       ├── ai.py             # Gemini Chat API + NLP summary
│       ├── routes.py         # API endpoints
│       ├── schemas.py        # Pydantic models
│       └── utils.py          # SQL cleaner
│
└── client/                   # React Client
    ├── Dockerfile            # Multi-stage build
    ├── nginx.conf            # Reverse proxy → backend
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx          # Entry point
        ├── index.css         # Tailwind CSS
        ├── App.jsx           # Layout chính
        ├── components/
        │   ├── Header.jsx
        │   ├── WelcomeBanner.jsx
        │   ├── MessageBubble.jsx
        │   ├── InputArea.jsx
        │   └── SidePanel.jsx
        ├── hooks/
        │   └── useChat.js    # Chat state management
        └── utils/
            └── api.js        # Axios API calls
```

---

## Cách chạy dự án

### Yêu cầu
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Google Gemini API Key](https://aistudio.google.com/apikey)

### 1. Cấu hình API Key

```bash
# File: backend/.env
DB_URI=postgresql://admin:admin123@postgres:5432/sql_assistant
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Khởi động

```bash
docker compose up --build
```

### 3. Truy cập

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| PostgreSQL | localhost:5433 |

---

## API Endpoints

### Kiểm tra trạng thái
```
GET /api/status
```

### Thông tin database
```
GET /api/db-info
```

### Đặt câu hỏi
```
POST /api/query
```

Body:
```json
{
  "question": "Hà Nội có bao nhiêu quận huyện?",
  "history": [
    { "role": "user", "content": "xin chào" },
    { "role": "assistant", "content": "Chào bạn!" }
  ]
}
```

Response (SQL):
```json
{
  "question": "Hà Nội có bao nhiêu quận huyện?",
  "sql_query": "SELECT COUNT(*) FROM districts d JOIN provinces p ON ...",
  "result": [{"count": 30}],
  "message": "Hà Nội có tổng cộng 30 quận huyện.",
  "execution_time": 2.5,
  "success": true,
  "response_type": "sql"
}
```

Response (Chat):
```json
{
  "question": "xin chào",
  "message": "Chào bạn! Tôi là AI Tra Cứu...",
  "success": true,
  "response_type": "chat"
}
```

---

## Ý tưởng mở rộng

- 📈 Biểu đồ trực quan (Chart.js / Recharts)
- 🔐 Phân quyền user
- 📱 Responsive mobile
- 🌐 Deploy lên cloud (Vercel + Railway)
- 💾 Export kết quả CSV/Excel

---



