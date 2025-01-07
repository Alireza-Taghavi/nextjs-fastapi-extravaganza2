import math
import random
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, validator
from typing import List, Optional
from supabase import create_client, Client
from enum import Enum as PyEnum
from datetime import datetime, timedelta
import re
from typing import List, Dict
import requests

SUPABASE_URL = 'https://mtbvtlwhdyfbjbufxluh.supabase.co'
SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10YnZ0bHdoZHlmYmpidWZ4bHVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzc2MzYwNywiZXhwIjoyMDQ5MzM5NjA3fQ.v-vJOW7Dl5WexOIRFTpegR_NG8MnsrY5aROpKP1yDGY'

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class UserRole(PyEnum):
    ADMIN = "admin"
    HELPER = "helper"
    GUEST = "guest"


class UserCreate(BaseModel):
    name: str
    phone: str

    @validator("name")
    def validate_name(cls, value):
        if not re.match(r"^[A-Z][a-zA-Z]{1,}$", value):
            raise ValueError("Name must be at least 2 letters, start with an uppercase letter, and contain only "
                             "English alphabets.")
        return value

    @validator("phone")
    def validate_phone(cls, value):
        if not re.match(r"^\d{11}$", value):
            raise ValueError("Phone must be exactly 11 digits.")
        return value


class UserRecommend(BaseModel):
    phone: str
    name: str
    recommended_by: int

    @validator("name")
    def validate_recommend_name(cls, value):
        if not re.match(r"^[A-Z][a-zA-Z]{1,}$", value):
            raise ValueError("Name must be at least 2 letters, start with an uppercase letter, and contain only "
                             "English alphabets.")
        return value

    @validator("phone")
    def validate_recommend_phone(cls, value):
        if not re.match(r"^\d{11}$", value):
            raise ValueError("Phone must be exactly 11 digits.")
        return value


class AcceptUser(BaseModel):
    id: int
    accept: bool


@app.post("/api/py/users/")
def create_user(user: UserCreate):
    current_user_id = 1  # This should be dynamically retrieved in real cases.
    if current_user_id != 1:
        raise HTTPException(status_code=403, detail="Only admins can create users.")

    data = {
        "name": user.name,
        "phone": user.phone,
        "role": "guest"
    }
    existing_user_response = supabase.table("users").select("name").filter("phone", "eq", user.phone).execute()
    if existing_user_response.data:
        raise HTTPException(status_code=400, detail=f"{user.name} is already coming")

    try:
        response = supabase.table("users").insert(data).execute()
    except Exception:
        raise HTTPException(status_code=400, detail=f"Some error")

    return {"message": "User created successfully", "user": response.data[0]}


@app.post("/api/py/recommend/")
def recommend_user(recommendation: UserRecommend):
    existing_user_response = supabase.table("users").select("name").filter("phone", "eq",
                                                                           recommendation.phone).execute()
    if existing_user_response.data:
        raise HTTPException(status_code=400, detail=f"{existing_user_response.data[0]['name']} is already coming")

    recommended_user_response = supabase.table("recommended_users").select("name").filter("phone", "eq",
                                                                                          recommendation.phone).execute()
    if recommended_user_response.data:
        raise HTTPException(status_code=400, detail=f"{recommended_user_response.data[0]['name']} is already invited")

    data = {
        "name": recommendation.name,
        "phone": recommendation.phone,
        "recommended_by": recommendation.recommended_by
    }
    try:
        supabase.table("recommended_users").insert(data).execute()
    except Exception:
        raise HTTPException(status_code=400, detail=f"Some error")
    return {"message": "User added successfully"}


@app.post("/api/py/approve/")
def approve_user(data: AcceptUser):
    current_user_id = 1  # This should be dynamically retrieved in real cases.
    if current_user_id != 1:
        raise HTTPException(status_code=403, detail="Only admins can approve users.")

    recommended_user_response = supabase.table("recommended_users").select("*").filter("id", "eq", data.id).execute()
    if not recommended_user_response.data:
        raise HTTPException(status_code=404, detail="User not found.")

    recommended_user = recommended_user_response.data[0]
    user_data = {
        "name": recommended_user['name'],
        "phone": recommended_user['phone'],
        "role": "guest"
    }
    try:
        supabase.table("users").insert(user_data).execute()
        supabase.table("recommended_users").delete().filter("id", "eq", str(data.id)).execute()
    except Exception:
        raise HTTPException(status_code=400, detail=f"Some error")

    return {"message": "User approved and moved to users"}


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


def update_fastapi_get_users():
    """
    Updated FastAPI endpoint function to include node positioning
    """
    users = supabase.table('users').select('*').execute()
    users = users.data

    # Create nodes and links with key-based access
    nodes = [{"id": user["id"], "name": user["name"]} for user in users]
    links = [
        {"source": user["recommended_by"], "target": user["id"]}
        for user in users
        if user["recommended_by"]
    ]

    # Assume apply_force_directed_layout is a function that calculates node positions
    nodes_with_positions = apply_force_directed_layout(nodes, links)

    return {"nodes": nodes_with_positions, "links": links}


def generate_emojis(n):
    # Unicode range for emojis (common range: 0x1F600 - 0x1F64F for smileys, faces, etc.)
    emoji_range = list(range(0x1F600, 0x1F64F + 1))

    # Randomly pick 3 unique emojis
    emojis = random.sample(emoji_range, n)

    # Convert Unicode code points to actual emoji characters
    return [chr(emoji) for emoji in emojis]


class LoginForm(BaseModel):
    phone: str


class VerifyLoginForm(BaseModel):
    phone: str
    code: str


class VoteRequest(BaseModel):
    theme_id: int
    user_id: int


def send_sms(phone_number, message):
    api_key = "269556-sinatestapikey2212"
    text = message
    sender = "50004075013231"
    recipient = phone_number

    url = f"https://api.sms-webservice.com/api/V3/Send?ApiKey={api_key}&Text={text}&Sender={sender}&Recipients={recipient}"

    payload = {}
    headers = {}

    try:
        response = requests.get(url, headers=headers, data=payload)
        response.raise_for_status()
        print(f"{phone_number}:{response.text}")
    except requests.exceptions.HTTPError as err:
        print(err)


@app.post("/api/py/login/")
def login(data: LoginForm):
    response = supabase.table("users").select("*").filter("phone", "eq", data.phone).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    user = response.data[0]
    random_emojis = generate_emojis(9)
    password = ''.join(random_emojis[:3])
    random.shuffle(random_emojis)

    update_data = {
        "last_login": datetime.now().isoformat(),
        "verification_code": password,
        "code_expiry": (datetime.now() + timedelta(minutes=5)).isoformat()
    }
    supabase.table("users").update(update_data).filter("id", "eq", user["id"]).execute()

    response = send_sms(data.phone, password)
    if response:
        print(f"SMS sent successfully to: {data.phone} :", response)
    else:
        print(f"Failed to send SMS to {data.phone}")

    return {"message": "Correct phone number", "emojis": " - ".join(random_emojis)}


@app.post("/api/py/verify-login/")
def verify_login(data: VerifyLoginForm):
    response = supabase.table("users").select("*").filter("phone", "eq", data.phone).filter("verification_code", "eq",
                                                                                            data.code).execute()
    if not response.data:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    user = response.data[0]
    if not user.get("code_expiry") or datetime.fromisoformat(user["code_expiry"]) <= datetime.now():
        raise HTTPException(status_code=400, detail="Code expired")

    update_data = {
        "last_login": datetime.now().isoformat(),
        "verification_code": "",
        "code_expiry": None
    }
    supabase.table("users").update(update_data).filter("id", "eq", user["id"]).execute()

    return {
        "message": "Logged in successfully",
        "user": {
            "id": user["id"],
            "phone": user["phone"],
            "last_login": user["last_login"],
            "role": user["role"],
            "recommended_by": user.get("recommended_by"),
            "quest": user.get("quest"),
            "theme": user.get("theme"),
        }
    }


@app.get("/api/py/users/{user_id}")
def get_user(user_id: int):
    response = supabase.table("users").select("*").filter("id", "eq", str(user_id)).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")

    user = response.data[0]
    return {
        "message": "User retrieved successfully",
        "user": {
            "id": user["id"],
            "phone": user["phone"],
            "last_login": user["last_login"],
            "role": user["role"],
            "recommended_by": user.get("recommended_by"),
            "quest": user.get("quest"),
            "theme": user.get("theme"),
        }
    }


@app.post("/api/py/vote-theme")
def vote_theme(request: VoteRequest):
    theme_response = supabase.table("themes").select("*").filter("id", "eq", str(request.theme_id)).execute()
    if not theme_response.data:
        raise HTTPException(status_code=404, detail="Theme not found")

    user_response = supabase.table("users").select("*").filter("id", "eq", str(request.user_id)).execute()
    if not user_response.data:
        raise HTTPException(status_code=404, detail="User not found")

    user = user_response.data[0]
    theme = theme_response.data[0]

    if user.get("theme"):
        old_theme_response = supabase.table("themes").select("*").filter("id", "eq", user["theme"]).execute()
        if old_theme_response.data:
            old_theme = old_theme_response.data[0]
            old_theme["votes"] -= 1
            supabase.table("themes").update({"votes": old_theme["votes"]}).filter("id", "eq", old_theme["id"]).execute()

    user_update_data = {"theme": theme["id"]}
    theme_update_data = {"votes": theme["votes"] + 1}
    supabase.table("users").update(user_update_data).filter("id", "eq", user["id"]).execute()
    supabase.table("themes").update(theme_update_data).filter("id", "eq", theme["id"]).execute()

    recalculate_prizes()
    return {"message": "Vote submitted successfully"}


def recalculate_prizes():
    themes_response = supabase.table("themes").select("*").execute()
    themes = themes_response.data

    total_votes = sum(theme["votes"] for theme in themes)
    total_prize_pool = 4 * len(themes)

    if total_votes == 0:
        for theme in themes:
            theme["prize"] = 0
            supabase.table("themes").update({"prize": 0}).filter("id", "eq", theme["id"]).execute()
        return

    for theme in themes:
        if theme["votes"] == 0:
            theme["prize"] = total_prize_pool
        else:
            rarity_score = 1 / theme["votes"]
            theme["prize"] = int(total_prize_pool * (rarity_score / sum(1 / max(1, t["votes"]) for t in themes)))
        supabase.table("themes").update({"prize": theme["prize"]}).filter("id", "eq", theme["id"]).execute()


@app.get("/api/py/themes")
def get_themes():
    response = supabase.table("themes").select("*").execute()
    return response.data


@app.get("/api/py/get-users")
def get_users():
    return update_fastapi_get_users()
