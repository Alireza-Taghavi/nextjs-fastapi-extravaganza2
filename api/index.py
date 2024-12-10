from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import Column, Integer, String, TIMESTAMP, create_engine, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel, Field
from datetime import datetime

# Database Configuration
DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/extravaganza2"

# Create engine with psycopg2 (synchronous driver)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# User Model (SQLAlchemy)
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    theme = Column(String, nullable=False)
    phone = Column(String(256), unique=True, nullable=False)
    verification_code = Column(String, nullable=False)
    code_expiry = Column(TIMESTAMP, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    last_login = Column(TIMESTAMP, nullable=True)


# Pydantic Models for Request/Response
class UserCreate(BaseModel):
    name: str
    theme: str
    phone: str
    verification_code: str
    code_expiry: datetime = Field(..., description="Expiry time for verification code")


class UserResponse(UserCreate):
    id: int
    created_at: datetime
    last_login: datetime | None = None

    class Config:
        orm_mode = True


# Initialize database
Base.metadata.create_all(bind=engine)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# FastAPI App
app = FastAPI()


@app.post("/api/py/users/", response_model=UserResponse)
def create_user(
        user: UserCreate,
        db: Session = Depends(get_db)
):
    db_user = User(
        name=user.name,
        theme=user.theme,
        phone=user.phone,
        verification_code=user.verification_code,
        code_expiry=user.code_expiry,
    )
    db.add(db_user)
    try:
        db.commit()
        db.refresh(db_user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"User could not be created: {str(e)}")
    return db_user


@app.post("/api/py/login/")
def login(phone: str, code: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == phone, User.verification_code == code).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")
    user.last_login = func.now()
    db.commit()
    return {"message": "Logged in successfully", "user": user.id}


@app.get("/api/py/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/api/py/helloFastApi")
def hello_fast_api():
    return {"message": "Hello from FastAPI"}
