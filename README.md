# AI-Docs

AI-Docs is an advanced AI-powered chatbot that uses **Retrieval-Augmented Generation (RAG)** to answer user queries based on stored PDF documents. The chatbot integrates **FastAPI** for the backend, **React (Vite)** for the frontend, and is powered by **Anthropic Claude**.

## Features

- **ChatGPT-style conversation** with past chat recall.
- **PDF Processing**: Extracts and indexes data from uploaded PDF files.
- **Real-time message storage**: Saves chat history using SQLite.
- **RAG-based answering**: Uses ChromaDB and embedding models for accurate, document-grounded responses.
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
│   │   ├── preprocessing.py  # PDF text extraction
│   │   ├── retrieval.py      # LangChain RAG chain
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
2. **Ask questions** in the message box.
3. **Upload PDFs** via the PDF manager to provide document-based answers.
4. **Process PDFs** to index them into ChromaDB for RAG retrieval.
5. **Review past conversations** in the sidebar.
6. **Rename or delete chats** as needed.
7. **Adjust settings** (model, temperature, etc.) from the settings panel.

---

## Contribution

Contributions are welcome! If you'd like to improve the project, feel free to open an issue or submit a pull request.

---

## License

This project is licensed under the [MIT License](./LICENSE).
