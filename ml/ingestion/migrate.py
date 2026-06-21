import sqlite3
import sys
import os

sys.path.append(os.path.dirname(__file__))
from store import get_connection

def migrate():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("PRAGMA table_info(articles)")
    columns = [row["name"] for row in cursor.fetchall()]

    if "domain" not in columns:
        print("Adding 'domain' column...")
        cursor.execute("ALTER TABLE articles ADD COLUMN domain TEXT DEFAULT 'GEO'")
        conn.commit()
        print("Migration complete. All existing articles set to GEO.")
    else:
        print("'domain' column already exists. No migration needed.")

    conn.close()

if __name__ == "__main__":
    migrate()
    