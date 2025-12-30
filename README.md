# Hiring Assignment – AI Live Chat Agent

This project is a small but realistic AI-powered customer support chat system built as part of a hiring assignment.

The goal was to simulate how an AI support agent could work inside a live chat widget, with real conversation persistence, contextual replies, and a clean user experience.

---

## 🚀 Features

- Live chat interface (user ↔ AI)
- Session-based conversations (no login required)
- Conversation & message persistence
- Context-aware AI responses
- Graceful handling of errors and edge cases
- Clean, production-style architecture

---

## 🧱 Tech Stack

### Backend
- Node.js + TypeScript
- Express
- PostgreSQL
- Prisma ORM
- Groq LLM (LLaMA 3.3 – free tier)
- REST APIs

### Frontend
- SvelteKit
- TypeScript
- Fetch API
- Minimal, professional UI

---

## 🧠 How It Works

1. User opens the chat UI and sends a message
2. Frontend sends the message to the backend
3. Backend:
   - Creates or reuses a conversation session
   - Stores user & AI messages in the database
   - Sends conversation context to the LLM
4. AI response is returned and shown in the UI

Sessions are stored locally so conversations continue after refresh.

---

## 🗂️ Project Structure

spur-ai-chat/

├── backend/

│ ├── src/

│ │ ├── routes/

│ │ ├── services/

│ │ └── db/

│ └── prisma/

├── frontend/

│ └── src/routes/+page.svelte

└── README.md


---

## 🛠️ Running Locally

### Backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

Create .env:
```
DATABASE_URL=your_postgres_url

GROQ_API_KEY=your_groq_api_key
```

Backend runs at:

```
http://localhost:4000
```
---

Frontend:

```
cd frontend
npm install
npm run dev

```

Frontend runs at:

```
http://localhost:5173
```
---

🤖 LLM Integration

- Provider: Groq

- Model: llama-3.3-70b-versatile

- LLM calls are abstracted behind a service layer

- Failures are handled gracefully with fallback messages

---

🧩 Design Decisions

- Focused on reliability over flashy UI

- Clear separation between routes, services, and data layer

- Easy to swap LLM providers in the future

- Defensive error handling for real-world conditions

---

🔮 If I Had More Time

- Add streaming responses (token-by-token)

- Cache frequent FAQ answers

- Admin dashboard to view conversations

- Multi-channel support (WhatsApp, Instagram, etc.)

---

✅ Assignment Coverage

- End-to-end chat flow

- Real LLM integration

- Persistent conversations

- Clean UI & UX

- Production-style backend architecture

---
