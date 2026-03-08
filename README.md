# AI-Docs

AI-Docs is an advanced AI-powered chatbot that uses **Retrieval-Augmented Generation (RAG)** to answer user queries based on stored PDF documents. The chatbot integrates **FastAPI** for the backend, **React (Vite)** for the frontend, and is powered by **Anthropic Claude**.

## Features

- **ChatGPT-style conversation** with past chat recall.
- **PDF Processing**: Extracts and indexes data from uploaded PDF files.
- **Real-time message storage**: Saves chat history using SQLite.
- **RAG-based answering**: Uses ChromaDB and embedding models for accurate, document-grounded responses.
- **Multi-document retrieval**: Queries across multiple PDFs simultaneously using MMR search.
- **Dynamic chat list**: Automatically updates the sidebar with active chats.
- **Chat title editing**: Rename conversations directly from the sidebar.
- **Delete chat support**: Deletes conversations dynamically.
- **Configurable settings**: Switch between Claude Haiku, Sonnet, and Opus models at runtime.
- **Dark UI theme** for a better user experience.
- **Responsive Web Design**: Mobile-friendly and accessible from all screen sizes.
- **Dockerized Deployment**: Easily run with Docker or Docker Compose.

## Tech Stack

- **Frontend**: React 19 (Vite), TypeScript, TailwindCSS
- **Backend**: FastAPI, SQLite, ChromaDB, LangChain
- **AI Model**: Anthropic Claude (Haiku / Sonnet / Opus, configurable via settings)
- **Embeddings**: ChromaDB `DefaultEmbeddingFunction` (local, sentence-transformers — no API key required)

---

## How It Works

```
User Question
     │
     ▼
LangChain RAG Chain
     │
     ├─► ChromaDB (MMR Retrieval)
     │        └─ Searches across all indexed PDF chunks
     │
     ├─► Retrieved Context (top-k relevant chunks)
     │
     └─► Anthropic Claude (claude-opus-4-6 / sonnet / haiku)
              └─ Generates grounded answer from context
                       │
                       ▼
               Answer + Chat History (SQLite)
```

1. PDFs are uploaded and chunked via `pdfplumber` + `RecursiveCharacterTextSplitter`
2. Chunks are embedded locally and stored in **ChromaDB** (persistent vector database)
3. On each query, **MMR (Maximal Marginal Relevance)** retrieval fetches the most relevant and diverse chunks
4. **LangChain** passes the retrieved context + conversation history to **Claude**
5. Claude generates a document-grounded answer — no hallucination from outside the provided PDFs

---

## Project Structure

```
ai-docs/
├── backend/
│   ├── src/
│   │   ├── api.py            # FastAPI routes
│   │   ├── chat_manager.py   # Chat history management
│   │   ├── embedding.py      # ChromaDB embedding storage
│   │   ├── file_manager.py   # PDF upload/delete operations
│   │   ├── preprocessing.py  # PDF text extraction & chunking
│   │   ├── retrieval.py      # LangChain RAG chain + Claude integration
│   │   └── settings.py       # Runtime settings management
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/       # React UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── styles/           # Global styles
│   │   └── App.tsx
│   ├── Dockerfile
│   └── package.json
├── docker-compose.build.yml
├── docker-compose.image.yml
└── deploy.sh
```

---

## Installation & Setup (Local)

### Clone the Repository

```sh
git clone https://github.com/erenisci/ai-docs
cd ai-docs
```

### Backend Setup

Navigate to the `backend` directory and install dependencies:

```sh
cd backend
python -m venv venv

source venv/bin/activate  # MacOS/Linux
venv\Scripts\activate    # Windows

pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory:

```sh
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### Frontend Setup

Navigate to the `frontend` directory and install dependencies:

```sh
cd frontend
npm install
```

---

## Run the Project

#### Start Backend Server

```sh
cd backend
uvicorn src.api:app --host 127.0.0.1 --port 8000 --reload
```

#### Start Frontend

```sh
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

## Docker Setup

### Option 1: Build Locally with Docker Compose

```sh
docker-compose -f docker-compose.build.yml up --build -d
```

#### Access the App

- Frontend: http://localhost:5173
- Backend: http://localhost:8000

---

### Option 2: Use Prebuilt Docker Images

#### a. Pull from Docker Hub

```sh
docker pull erenisci/ai-docs:backend
docker pull erenisci/ai-docs:frontend
```

#### b. Run Using Docker Compose (Recommended)

```sh
docker-compose -f docker-compose.image.yml up -d
```

#### Alternatively: Run Containers Manually

```sh
docker run -d -p 8000:8000 erenisci/ai-docs:backend
docker run -d -p 5173:3000 erenisci/ai-docs:frontend
```

---

## API Endpoints

| Method   | Endpoint                               | Description                            |
| -------- | -------------------------------------- | -------------------------------------- |
| `POST`   | `/ask/`                                | Sends a query to the chatbot.          |
| `GET`    | `/get-chats/`                          | Retrieves all stored chat sessions.    |
| `GET`    | `/get-chat-history/{chat_id}`          | Fetches messages from a specific chat. |
| `POST`   | `/update-chat-title/{chat_id}/{title}` | Updates the title of a specific chat.  |
| `DELETE` | `/delete-chat/{chat_id}`               | Deletes a specific chat.               |
| `GET`    | `/list-pdfs/`                          | Lists all stored PDFs.                 |
| `POST`   | `/upload-pdf/`                         | Uploads a PDF file for processing.     |
| `POST`   | `/process-pdfs/`                       | Processes all uploaded PDFs.           |
| `DELETE` | `/delete-pdf/`                         | Deletes a specific PDF file.           |
| `GET`    | `/get-settings/`                       | Returns the current AI settings.       |
| `POST`   | `/update-settings/`                    | Updates AI model and runtime settings. |

---

## Usage Guide

1. **Start a new chat** by clicking "New Chat".
2. **Upload PDFs** via the PDF manager to provide document-based answers.
3. **Process PDFs** to chunk and index them into ChromaDB.
4. **Ask questions** in the message box — Claude will answer using only the document content.
5. **Switch models** from the settings panel (Haiku for speed, Opus for depth).
6. **Review past conversations** in the sidebar.
7. **Rename or delete chats** as needed.

---

## Contribution

Contributions are welcome! If you'd like to improve the project, feel free to open an issue or submit a pull request.

---

## License

This project is licensed under the [MIT License](./LICENSE).
