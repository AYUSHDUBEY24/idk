import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../ingestion")))

from store import get_connection
import chromadb
from chromadb.utils import embedding_functions
import ollama

CHROMA_PATH = os.path.join(os.path.dirname(__file__), "../../data/chroma_db")

chroma_client = chromadb.PersistentClient(path=CHROMA_PATH)

embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

collection = chroma_client.get_or_create_collection(
    name="goe_articles",
    embedding_function=embedding_fn
)

def index_articles():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, title, body, source, published_at FROM articles")
    articles = cursor.fetchall()
    conn.close()

    print(f"Indexing {len(articles)} articles into ChromaDB...")

    existing = set(collection.get()["ids"])

    docs, ids, metas = [], [], []
    for article in articles:
        doc_id = f"article_{article['id']}"
        if doc_id in existing:
            continue
        text = f"{article['title']}. {article['body']}"
        docs.append(text)
        ids.append(doc_id)
        metas.append({
            "source": article["source"],
            "published_at": article["published_at"]
        })

    if docs:
        collection.add(documents=docs, ids=ids, metadatas=metas)
        print(f"Added {len(docs)} new articles to ChromaDB.")
    else:
        print("No new articles to index.")

def query_rag(question: str, n_results: int = 3) -> str:
    results = collection.query(
        query_texts=[question],
        n_results=n_results
    )

    chunks = results["documents"][0] if results["documents"] else []
    sources = results["metadatas"][0] if results["metadatas"] else []

    if not chunks:
        return "No relevant articles found in the database."

    context = ""
    for i, (chunk, meta) in enumerate(zip(chunks, sources)):
        context += f"\n[Article {i+1} — {meta.get('source', 'unknown')} — {meta.get('published_at', '')}]\n{chunk}\n"

    prompt = f"""You are a strategic geopolitical intelligence analyst focused on India.
Answer the question below using ONLY the provided articles.
Always relate your answer to India's perspective and interests.
Keep the answer concise — 3 to 5 sentences.

Articles:
{context}

Question: {question}

Answer:"""

    response = ollama.chat(
        model="llama3.2",
        messages=[{"role": "user", "content": prompt}]
    )

    return response["message"]["content"]

if __name__ == "__main__":
    index_articles()

    print("\n--- Testing RAG ---")
    test_q = "What are the latest developments in India's foreign relations?"
    print(f"Q: {test_q}")
    print(f"A: {query_rag(test_q)}")