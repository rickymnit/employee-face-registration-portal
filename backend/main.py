import os
import uuid
from fastapi import FastAPI, UploadFile, Form, Depends, HTTPException, status, File, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from .database import engine, get_db, Base
from .models import Employee


Base.metadata.create_all(bind=engine)

app = FastAPI(title="Employee Face Registration API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


ALLOWED_TYPES = ["image/jpeg", "image/png", "image/jpg"]
MAX_FILE_SIZE = 5 * 1024 * 1024


@app.post("/register")
async def register_employee(
    request: Request,
    name: str = Form(...),
    employee_id: str = Form(...),
    mobile: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    if image.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, JPEG and PNG allowed"
        )

    file_content = await image.read()

    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File exceeds 5MB"
        )


    existing_employee = db.query(Employee).filter(Employee.employee_id == employee_id).first()

    if existing_employee:
        raise HTTPException(
            status_code=400,
            detail="Employee ID already exists"
        )


    file_extension = os.path.splitext(image.filename)[1]
    filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as f:
        f.write(file_content)


    image_url = f"{request.base_url}uploads/{filename}"


    employee = Employee(
        name=name,
        employee_id=employee_id,
        mobile=mobile,
        image_path=image_url
    )

    try:

        db.add(employee)
        db.commit()
        db.refresh(employee)

    except IntegrityError:

        db.rollback()

        if os.path.exists(file_path):
            os.remove(file_path)

        raise HTTPException(
            status_code=400,
            detail="Employee ID already registered"
        )

    return {
        "success": True,
        "employee_id": employee.employee_id,
        "image_url": image_url
    }
