import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# Expect DATABASE_URL from environment (Railway standard)
# Fallback to local SQLite if not provided, for easy local dev/testing
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./local_db.sqlite")

# SQLAlchemy requires 'postgresql://' instead of 'postgres://' which some older PaaS provide
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Handle args for SQLite vs Postgres
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency for FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
