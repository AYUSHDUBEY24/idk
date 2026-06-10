from neo4j import GraphDatabase
from app.core.config import settings

driver = GraphDatabase.driver(
    settings.NEO4J_URI,
    auth=(settings.NEO4J_USER, settings.NEO4J_PASSWORD)
)

def get_top_entities(limit: int = 50):
    with driver.session() as session:
        result = session.run("""
            MATCH (e:Entity)
            RETURN e.name as name, e.label as label,
                   size([(e)-[]-() | 1]) as connections
            ORDER BY connections DESC
            LIMIT $limit
        """, limit=limit)
        return [dict(r) for r in result]

def get_entity_connections(entity_name: str):
    with driver.session() as session:
        result = session.run("""
            MATCH (a:Entity {name: $name})-[r]-(b:Entity)
            RETURN b.name as connected_to,
                   b.label as label,
                   count(r) as strength
            ORDER BY strength DESC
            LIMIT 20
        """, name=entity_name)
        return [dict(r) for r in result]