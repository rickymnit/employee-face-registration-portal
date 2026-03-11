import uuid
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from .database import Base

class Employee(Base):
    __tablename__ = "employees"

    # For cross-compatibility with SQLite during local dev, UUID is stored as String if not on Postgres
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    employee_id = Column(String, unique=True, nullable=False)
    mobile = Column(String, nullable=False)
    image_path = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
