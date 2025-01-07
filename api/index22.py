from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import Column, Integer, String, TIMESTAMP, create_engine, func, Enum, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from enum import Enum as PyEnum
import random
import uuid
from typing import List, Dict
import math
import random


# Database Configuration
DATABASE_URL = ""

# Create engine with psycopg2 (synchronous driver)
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# postgresql://postgres:e5TnTVgXkZy6VRr7@db.mtbvtlwhdyfbjbufxluh.supabase.co:5432/postgres

def apply_force_directed_layout(nodes: List[Dict], links: List[Dict],
                                width: int = 800, height: int = 600,
                                iterations: int = 100) -> List[Dict]:
    """
    Applies force-directed layout to position nodes aesthetically.

    Args:
        nodes: List of node dictionaries with 'id' and 'name'
        links: List of link dictionaries with 'source' and 'target'
        width: Canvas width
        height: Canvas height
        iterations: Number of iterations to run the simulation

    Returns:
        List of nodes with updated x, y positions
    """
    # Initialize random positions if not set
    for node in nodes:
        if 'x' not in node:
            node['x'] = random.uniform(0, width)
        if 'y' not in node:
            node['y'] = random.uniform(0, height)

    # Constants for force calculations
    k = math.sqrt((width * height) / len(nodes))  # Optimal distance between nodes
    temperature = 0.1 * math.sqrt(width * width + height * height)  # Initial temperature

    # Create node lookup dictionary
    node_dict = {node['id']: node for node in nodes}

    for iteration in range(iterations):
        # Calculate repulsive forces between all nodes
        forces = {node['id']: {'dx': 0, 'dy': 0} for node in nodes}

        # Repulsive forces between nodes
        for i, node1 in enumerate(nodes):
            for node2 in nodes[i + 1:]:
                dx = node1['x'] - node2['x']
                dy = node1['y'] - node2['y']
                distance = math.sqrt(dx * dx + dy * dy) + 0.01

                # Repulsive force is proportional to 1/distance
                force = k * k / distance

                # Add repulsive forces to both nodes
                forces[node1['id']]['dx'] += (dx / distance) * force
                forces[node1['id']]['dy'] += (dy / distance) * force
                forces[node2['id']]['dx'] -= (dx / distance) * force
                forces[node2['id']]['dy'] -= (dy / distance) * force

        # Attractive forces along links
        for link in links:
            source = node_dict[link['source']]
            target = node_dict[link['target']]

            dx = source['x'] - target['x']
            dy = source['y'] - target['y']
            distance = math.sqrt(dx * dx + dy * dy) + 0.01

            # Attractive force is proportional to distance
            force = distance * distance / k

            # Add attractive forces
            forces[source['id']]['dx'] -= (dx / distance) * force
            forces[source['id']]['dy'] -= (dy / distance) * force
            forces[target['id']]['dx'] += (dx / distance) * force
            forces[target['id']]['dy'] += (dy / distance) * force

        # Apply forces with cooling
        cooling_factor = 1 - iteration / iterations
        for node in nodes:
            force = forces[node['id']]
            force_magnitude = math.sqrt(force['dx'] * force['dx'] + force['dy'] * force['dy'])

            if force_magnitude > 0:
                # Limit maximum movement by temperature
                factor = min(force_magnitude, temperature * cooling_factor) / force_magnitude

                # Update position
                node['x'] += force['dx'] * factor
                node['y'] += force['dy'] * factor

                # Keep nodes within bounds
                node['x'] = max(0, min(width, node['x']))
                node['y'] = max(0, min(height, node['y']))

    return nodes


def update_fastapi_get_users(db: Session):
    """
    Updated FastAPI endpoint function to include node positioning
    """
    users = db.query(User).all()
    nodes = [{"id": user.id, "name": user.name} for user in users]
    links = [
        {"source": user.recommended_by, "target": user.id}
        for user in users
        if user.recommended_by
    ]

    # Apply force-directed layout
    nodes_with_positions = apply_force_directed_layout(nodes, links)

    return {"nodes": nodes_with_positions, "links": links}


def generate_emojis(n):
    # Unicode range for emojis (common range: 0x1F600 - 0x1F64F for smileys, faces, etc.)
    emoji_range = list(range(0x1F600, 0x1F64F + 1))

    # Randomly pick 3 unique emojis
    emojis = random.sample(emoji_range, n)

    # Convert Unicode code points to actual emoji characters
    return [chr(emoji) for emoji in emojis]


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
    verification_code = Column(String, nullable=True)
    code_expiry = Column(TIMESTAMP, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    last_login = Column(TIMESTAMP, nullable=True)
    # Relationship with Theme
    theme = Column(Integer, nullable=True)


class Theme(Base):
    __tablename__ = "themes"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    votes = Column(Integer, default=0)
    fill = Column(String, nullable=True)  # Color
    icon = Column(String, nullable=True)
    prize = Column(Integer, nullable=True)


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
    theme: int | None

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
        db: Session = Depends(get_db),
):
    user = db.query(User).filter(User.phone == recommendation.phone).first()
    if user:
        raise HTTPException(status_code=404, detail=f"{user.name} is already coming")

    user = db.query(RecommendedUser).filter(RecommendedUser.phone == recommendation.phone).first()
    if user:
        raise HTTPException(status_code=404, detail=f"{user.name} is already invited")

    db_user = RecommendedUser(
        name=recommendation.name,
        phone=recommendation.phone,
        recommended_by=recommendation.recommended_by,
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


@app.get("/api/py/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
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


class VoteRequest(BaseModel):
    theme_id: int
    user_id: int


@app.post("/api/py/vote-theme")
def vote_theme(request: VoteRequest, db: Session = Depends(get_db)):
    theme_id = request.theme_id
    user_id = request.user_id
    print(theme_id, user_id)
    theme = db.query(Theme).filter(Theme.id == theme_id).first()
    if not theme:
        raise HTTPException(status_code=404, detail="Theme not found")

    # Find the user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update the user's vote
    if user.theme:
        # Undo the previous vote
        old_theme = db.query(Theme).filter(Theme.id == user.theme).first()
        if old_theme:
            old_theme.votes -= 1

    user.theme = theme.id
    theme.votes += 1

    # Recalculate prizes based on updated votes
    recalculate_prizes(db)

    db.commit()
    return {"message": "Vote submitted successfully"}


def recalculate_prizes(db: Session):
    themes = db.query(Theme).all()
    total_votes = sum(theme.votes for theme in themes)
    total_prize_pool = 4 * len(themes)  # 4 "gold" prizes per theme

    if total_votes == 0:
        for theme in themes:
            theme.prize = 0
        db.commit()
        return

    # Calculate rarity-based prize distribution
    for theme in themes:
        # Themes with no votes should get the max possible prize
        if theme.votes == 0:
            theme.prize = total_prize_pool
        else:
            rarity_score = 1 / theme.votes  # Less votes -> higher rarity score
            theme.prize = int(total_prize_pool * (rarity_score / sum(1 / max(1, t.votes) for t in themes)))

    db.commit()


@app.get("/api/py/themes")
def get_themes(db: Session = Depends(get_db)):
    themes = db.query(Theme).all()
    return themes


@app.get("/api/py/get-users")
def get_users(db: Session = Depends(get_db)):
    return update_fastapi_get_users(db)


@app.get("/api/py/helloFastApi")
def hello_fast_api():
    return {"message": "Hello from FastAPI"}
