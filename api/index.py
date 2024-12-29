from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Column, Integer, String, TIMESTAMP, create_engine, func, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from enum import Enum as PyEnum
import random
import uuid


def generate_emojis(n):
    # Unicode range for emojis (common range: 0x1F600 - 0x1F64F for smileys, faces, etc.)
    emoji_range = list(range(0x1F600, 0x1F64F + 1))

    # Randomly pick 3 unique emojis
    emojis = random.sample(emoji_range, n)

    # Convert Unicode code points to actual emoji characters
    return [chr(emoji) for emoji in emojis]


# Database Configuration
DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/extravaganza2"

# Create engine with psycopg2 (synchronous driver)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Enum for User Roles
class UserRole(PyEnum):
    ADMIN = "admin"
    HELPER = "helper"
    GUEST = "guest"


# User Model (SQLAlchemy)
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String(256), unique=True, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.GUEST, nullable=False)
    recommended_by = Column(Integer, nullable=True, default=1)  # ID of the recommending user
    quest = Column(String, nullable=True)
    theme = Column(String, nullable=True)
    verification_code = Column(String, nullable=True)
    code_expiry = Column(TIMESTAMP, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    last_login = Column(TIMESTAMP, nullable=True)


class RecommendedUser(Base):
    __tablename__ = "recommended_users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String(256), unique=True, nullable=False)
    recommended_by = Column(Integer, nullable=True, default=1)  # ID of the recommending user
    created_at = Column(TIMESTAMP, server_default=func.now())


# Pydantic Models for Request/Response
class UserCreate(BaseModel):
    name: str
    phone: str


class UserRecommend(BaseModel):
    phone: str
    name: str
    recommended_by: int


class LoginForm(BaseModel):
    phone: str


class VerifyLoginForm(BaseModel):
    phone: str
    code: str


class UserResponse(UserCreate):
    id: int
    role: str
    recommended_by: int | None
    quest: str | None
    theme: str | None

    class Config:
        orm_mode = True


class AcceptUser(BaseModel):
    id: int
    accept: bool


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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React development server
        "http://127.0.0.1:3000",
        "http://localhost:8000",  # If your backend is also running locally
        "http://127.0.0.1:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


# Helper Functions
def create_session_cookie():
    return str(uuid.uuid4())


def authenticate_user(user_id: int, db: Session):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid session")
    return user


@app.post("/api/py/users/", response_model=UserResponse)
def create_user(
        user: UserCreate,
        current_user: User = Depends(lambda: authenticate_user(user_id=1, db=next(get_db()))),  # Admin for now
        db: Session = Depends(get_db),
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can create users.")

    db_user = User(
        name=user.name,
        phone=user.phone,
        role=UserRole.GUEST,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.post("/api/py/recommend/")
def recommend_user(
        recommendation: UserRecommend,
        current_user: User = Depends(lambda: authenticate_user(user_id=1, db=next(get_db()))),
        db: Session = Depends(get_db),
):
    db_user = RecommendedUser(
        name=recommendation.name,
        phone=recommendation.phone,
        recommended_by=current_user.id,
    )
    db.add(db_user)
    db.commit()
    return {"message": "User Added Successfully"}


@app.post("/api/py/approve/")
def approve_user(
        data: AcceptUser,
        current_user: User = Depends(lambda: authenticate_user(user_id=1, db=next(get_db()))),
        db: Session = Depends(get_db),
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Only admins can approve users.")

    user = db.query(RecommendedUser).filter(RecommendedUser.id == data.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    db_user = User(
        name=user.name,
        phone=user.phone,
        role=UserRole.GUEST,
    )

    db.add(db_user)
    db.delete(user)
    db.commit()
    db.refresh(user)


@app.post("/api/py/login/")
def login(data: LoginForm, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == data.phone).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    random_emojis = generate_emojis(9)
    password = ''.join(random_emojis[:3])
    random.shuffle(random_emojis)

    user.last_login = datetime.now()
    user.verification_code = password
    user.code_expiry = datetime.now() + timedelta(minutes=5)
    db.commit()
    return {"message": "Correct phone number", "emojis": " - ".join(random_emojis)}


@app.post("/api/py/verify-login/")
def verify_login(data: VerifyLoginForm, db: Session = Depends(get_db)):
    # Query the user
    user = db.query(User).filter(User.phone == data.phone, User.verification_code == data.code).first()

    # Check if the user exists first
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Check if the code has expired
    if not user.code_expiry or user.code_expiry <= datetime.now():
        raise HTTPException(status_code=400, detail="Code expired")

    # Update the last login timestamp
    user.last_login = datetime.now()
    # user.verification_code = ""
    # user.code_expiry = datetime.now()
    db.commit()

    # Return success response
    return {"message": "Logged in successfully",
            "user": {
                "id": user.id,
                "phone": user.phone,
                "last_login": user.last_login,
                "role": user.role,
                "recommended_by": user.recommended_by,
                "quest": user.quest,
                "theme": user.theme,
            }}


@app.get("/api/py/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.get("/api/py/helloFastApi")
def hello_fast_api():
    return {"message": "Hello from FastAPI"}
