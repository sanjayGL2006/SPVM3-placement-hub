import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()

# PostgreSQL Database URL with fallback SQLite for instant zero-dependency execution
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://postgres:postgres@localhost:5432/placement_pro_db"
)

# If postgresql is not accessible locally, provide fallback sqlite engine for development
try:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
except Exception:
    DATABASE_URL = "sqlite:///./placement_pro.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
