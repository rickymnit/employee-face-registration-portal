import os
import shutil
import uuid
from fastapi import FastAPI, UploadFile, Form, Depends, HTTPException, status, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from .database import engine, get_db, Base
from .models import Employee

# Create tables if not exists
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Employee Face Registration API")

# Setup CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"]
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB

@app.post("/register")
async def register_employee(
    name: str = Form(...),
    employee_id: str = Form(...),
    mobile: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # 1. Validate file type
    if image.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file format. Only JPG/JPEG and PNG are allowed."
        )

    # 2. Validate file size (Needs to read file first)
    file_content = await image.read()
    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size exceeds the 5MB limit."
        )
    
    # Check if employee_id already exists before saving the file
    existing_employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()
    if existing_employee:
         raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An employee with this ID already exists."
        )

    # 3. Save file securely
    file_extension = os.path.splitext(image.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    with open(file_path, "wb") as f:
        f.write(file_content)

    # 4. Save to Database
    db_employee = Employee(
        name=name,
        employee_id=employee_id,
        mobile=mobile,
        image_path=file_path
    )
    
    try:
        db.add(db_employee)
        db.commit()
        db.refresh(db_employee)
    except IntegrityError:
        db.rollback()
        # Clean up file if db insert fails
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employee ID already registered."
        )
    except Exception as e:
        db.rollback()
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while saving to the database."
        )

    # 5. Return success JSON
    return {
        "success": True, 
        "message": "Registration Successful",
        "employee_id": db_employee.employee_id
    }
