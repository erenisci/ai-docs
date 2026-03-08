import os

from chromadb.utils.embedding_functions import DefaultEmbeddingFunction
from dotenv import load_dotenv
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_anthropic import ChatAnthropic
from langchain_chroma import Chroma
from langchain_core.embeddings import Embeddings
from langchain_core.prompts import ChatPromptTemplate
from src.embedding import get_chroma_client
from src.settings import settings


class ChromaDefaultEmbeddings(Embeddings):
    """LangChain wrapper for ChromaDB's DefaultEmbeddingFunction."""

    def __init__(self):
        self._ef = DefaultEmbeddingFunction()

    def embed_documents(self, texts):
        return self._ef(texts)

    def embed_query(self, text):
        return self._ef([text])[0]


load_dotenv(override=True)

current_api_key = os.getenv("ANTHROPIC_API_KEY", "")
chain = None

STATIC_PROMPT = (
    "You are an AI assistant. You must answer user questions strictly based on the provided document context. "
    "Do NOT rely on your general knowledge, external sources, or assumptions. "
    "If the document does not contain enough information to answer a question, say: "
    "'I do not have enough information in the documents to answer that.' "
    "You may respond naturally and politely to casual conversations like greetings."
)


def initialize_chain():
    """Initializes the AI model and retriever only if an API key is set."""
    global chain, current_api_key

    api_key = os.getenv("ANTHROPIC_API_KEY", "")

    if not api_key:
        print("Warning: No Anthropic API Key set. Model initialization skipped.")
        chain = None
        return None

    if chain is not None and api_key == current_api_key:
        return chain

    current_api_key = api_key

    client, _ = get_chroma_client()

    vector_db = Chroma(
        client=client,
        collection_name=settings["COLLECTION_NAME"],
        embedding_function=ChromaDefaultEmbeddings(),
    )

    retriever = vector_db.as_retriever(
        search_type="mmr",
        search_kwargs={"k": 20, "fetch_k": 100}
    )

    llm = ChatAnthropic(
        model=settings["MODEL"],
        api_key=api_key,
        temperature=0.3
    )

    prompt = ChatPromptTemplate.from_messages([
        ("system",
         f"{settings['SYSTEM_PROMPT']}\n\n{STATIC_PROMPT}\n\nDocument Context:\n{{context}}"),
        ("user", "{input}")
    ])

    question_answer_chain = create_stuff_documents_chain(llm, prompt)
    chain = create_retrieval_chain(retriever, question_answer_chain)

    return chain
