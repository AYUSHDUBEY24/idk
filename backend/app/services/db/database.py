import sqlite3
from app.core.config import settings

def get_connection():
    conn = sqlite3.connect(settings.DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

DEFENSE_KEYWORDS = ["military", "army", "navy", "air force", "missile", "defence", "defense",
                     "troops", "war", "attack", "strike", "soldier", "border", "drdo",
                     "warship", "fighter jet", "drone", "terror", "militant", "security forces"]

def get_latest_articles(limit: int = 20, domain: str = None):
    conn = get_connection()
    cursor = conn.cursor()

    if domain == "DEFENSE":
        # No dedicated defense source — use keyword match on title within GEO/SOCIETY articles
        cursor.execute("""
            SELECT id, title, source, domain, published_at, url
            FROM articles
            ORDER BY ingested_at DESC
            LIMIT 300
        """)
        rows = [dict(row) for row in cursor.fetchall()]
        conn.close()
        filtered = [
            r for r in rows
            if any(kw in r["title"].lower() for kw in DEFENSE_KEYWORDS)
        ]
        return filtered[:limit]

    elif domain and domain != "ALL":
        cursor.execute("""
            SELECT id, title, source, domain, published_at, url
            FROM articles
            WHERE domain = ?
            ORDER BY ingested_at DESC
            LIMIT ?
        """, (domain, limit))
    else:
        cursor.execute("""
            SELECT id, title, source, domain, published_at, url
            FROM articles
            ORDER BY ingested_at DESC
            LIMIT ?
        """, (limit,))

    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_article_stats():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) as total FROM articles")
    total = cursor.fetchone()["total"]
    cursor.execute("""
        SELECT source, COUNT(*) as count
        FROM articles
        GROUP BY source
        ORDER BY count DESC
    """)
    by_source = [dict(row) for row in cursor.fetchall()]
    cursor.execute("""
        SELECT domain, COUNT(*) as count
        FROM articles
        GROUP BY domain
        ORDER BY count DESC
    """)
    by_domain = [dict(row) for row in cursor.fetchall()]
    cursor.execute("SELECT COUNT(*) as total FROM entities")
    entities = cursor.fetchone()["total"]
    conn.close()
    return {
        "total_articles": total,
        "total_entities": entities,
        "by_source": by_source,
        "by_domain": by_domain
    }