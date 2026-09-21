"""
NutriHer FastAPI Backend Application
====================================
Main entry point for the NutriHer women's nutrition & iron bioavailability API.
Connects EfficientNet-B0 food prediction, IFCT 2017 nutrition calculations,
menstrual cycle phase tracking, dynamic context-aware iron target calculation,
and personalized nutritional insights.
"""

from typing import Optional, List, Dict, Any
from fastapi import FastAPI, File, UploadFile, Query, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .model import predict_food_image, get_model
from .nutrition import get_nutrition_data, NUTRITION_DATABASE
from .absorption import calculate_absorption
from .cycle import calculate_cycle_phase, calculate_dynamic_iron_target
from .insights import generate_personalized_insights

app = FastAPI(
    title="NutriHer Nutrition & Dynamic Iron Bioavailability API",
    description=(
        "Academic prototype combining EfficientNet-B0 food recognition, "
        "IFCT 2017 nutrition data, menstrual cycle context, and dynamic personalized iron target calculations."
    ),
    version="1.1.0",
)

# CORS middleware for local development and cloud deployments (Vercel, Netlify, Render, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origin_regex=r"https?://.*",
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage for demo session profile and user accounts
_DEMO_PROFILE: Dict[str, Any] = {}

_ACCOUNTS_DB: Dict[str, Dict[str, Any]] = {
    "ananya@nutriher.ai": {
        "name": "Ananya",
        "email": "ananya@nutriher.ai",
        "password": "password123",
        "age": 23,
        "height": 160,
        "weight": 55,
        "diet": "Vegetarian",
        "lifecycle_status": "Regular Cycle",
        "lifecycleStatus": "Regular Cycle",
        "cycleLength": 28,
        "duration": 5,
        "intensity": "Moderate",
        "symptoms": ["Fatigue", "Headache"],
    },
    "ananya@example.com": {
        "name": "Ananya",
        "email": "ananya@example.com",
        "password": "password123",
        "age": 23,
        "height": 160,
        "weight": 55,
        "diet": "Vegetarian",
        "lifecycle_status": "Regular Cycle",
        "lifecycleStatus": "Regular Cycle",
        "cycleLength": 28,
        "duration": 5,
        "intensity": "Moderate",
        "symptoms": ["Fatigue", "Headache"],
    },
}


# ============================================================================
# Pydantic Schemas
# ============================================================================

class AuthRequest(BaseModel):
    email: str
    password: Optional[str] = "password123"
    name: Optional[str] = None
    age: Optional[int] = 23
    diet: Optional[str] = "Vegetarian"
    lifecycle_status: Optional[str] = "Regular Cycle"
    lifecycleStatus: Optional[str] = None
    weight: Optional[float] = 55.0
    height: Optional[float] = 160.0
    cycleLength: Optional[int] = 28
    lastPeriod: Optional[str] = None
    duration: Optional[int] = 5
    intensity: Optional[str] = "Moderate"

class AbsorptionRequest(BaseModel):
    food_name: Optional[str] = Field(default="pongal", description="Food class name")
    portion_grams: Optional[float] = Field(default=150.0, description="Portion size in grams")
    portion_g: Optional[float] = None
    iron_mg: Optional[float] = None
    iron: Optional[float] = None
    vitamin_c_mg: Optional[float] = None
    vitaminC: Optional[float] = None
    calcium_mg: Optional[float] = None
    calcium: Optional[float] = None
    iron_type: Optional[str] = None
    age: Optional[int] = 23
    height: Optional[float] = 160.0
    weight: Optional[float] = 55.0
    diet: Optional[str] = "Vegetarian"
    menstrual_cycle_phase: Optional[str] = "Follicular"
    intensity: Optional[str] = "Moderate"
    lifecycle_status: Optional[str] = "Regular Cycle"
    lifecycleStatus: Optional[str] = None
    symptoms: Optional[List[str]] = None
    daily_target_mg: Optional[float] = None


class CycleRequest(BaseModel):
    last_period_date: Optional[str] = Field(default=None, description="ISO date YYYY-MM-DD")
    lastPeriod: Optional[str] = None
    cycle_length: Optional[int] = Field(default=28, description="Cycle length in days")
    cycleLength: Optional[int] = None
    period_length: Optional[int] = Field(default=5, description="Period duration in days")
    periodLength: Optional[int] = None
    age: Optional[int] = 23
    diet: Optional[str] = "Vegetarian"
    intensity: Optional[str] = "Moderate"
    lifecycle_status: Optional[str] = "Regular Cycle"
    lifecycleStatus: Optional[str] = None
    weight: Optional[float] = 55.0
    height: Optional[float] = 160.0


class InsightRequest(BaseModel):
    profile: Optional[Dict[str, Any]] = None
    cycle: Optional[Dict[str, Any]] = None
    food_name: Optional[str] = "Pongal"
    dietary_iron: Optional[float] = None
    dietaryIron: Optional[float] = None
    absorbed_iron: Optional[float] = None
    absorbedIron: Optional[float] = None
    target: Optional[float] = None
    symptoms: Optional[List[str]] = None


# ============================================================================
# API Endpoints
# ============================================================================

@app.on_event("startup")
def startup_event():
    """Warm up model weights at server startup."""
    try:
        get_model()
    except Exception as e:
        print(f"[NutriHer] Startup warmup notice: {e}")


@app.get("/")
def root():
    """Health check and API overview."""
    return {
        "app": "NutriHer API",
        "status": "online",
        "version": "1.1.0",
        "endpoints": [
            "POST /predict",
            "GET /nutrients/{food_name}",
            "POST /absorption",
            "POST /cycle",
            "POST /insights",
            "GET /profile",
            "POST /profile",
        ],
        "database_classes": len(NUTRITION_DATABASE),
    }


@app.post("/predict")
async def predict_food(image: Optional[UploadFile] = File(None)):
    """
    Food Recognition using EfficientNet-B0.
    Accepts an uploaded image file, returns top-1 predicted class and top-5 alternatives.
    """
    image_bytes = None
    if image is not None:
        image_bytes = await image.read()

    result = predict_food_image(image_bytes)
    return result


@app.get("/nutrients/{food_name}")
def get_nutrients_by_path(
    food_name: str,
    portion_g: float = Query(100.0, description="Portion in grams"),
):
    """Retrieve IFCT 2017 nutritional composition for a specific food."""
    return get_nutrition_data(food_name, portion_g)


@app.get("/nutrients")
def get_nutrients_by_query(
    food: Optional[str] = Query(None, description="Food class name"),
    food_name: Optional[str] = Query(None, description="Alternative food param"),
    portion: Optional[float] = Query(100.0, description="Portion size in grams"),
    portion_g: Optional[float] = Query(None, description="Portion size in grams"),
):
    """Query parameter version of /nutrients for frontend compatibility."""
    target_food = food or food_name or "pongal"
    target_portion = portion_g if portion_g is not None else (portion or 100.0)
    return get_nutrition_data(target_food, target_portion)


@app.post("/absorption")
def calculate_absorption_endpoint(req: AbsorptionRequest):
    """
    Calculate dietary iron intake and estimated absorbed iron based on meal composition,
    enhancers (Vitamin C), inhibitors (Calcium, tea/coffee), and cycle context.
    """
    portion = req.portion_g if req.portion_g is not None else (req.portion_grams or 150.0)
    iron = req.iron if req.iron is not None else req.iron_mg
    vit_c = req.vitaminC if req.vitaminC is not None else req.vitamin_c_mg
    ca = req.calcium if req.calcium is not None else req.calcium_mg
    l_status = req.lifecycle_status or req.lifecycleStatus or "Regular Cycle"

    return calculate_absorption(
        food_name=req.food_name or "pongal",
        portion_grams=portion,
        iron_mg=iron,
        vitamin_c_mg=vit_c,
        calcium_mg=ca,
        iron_type=req.iron_type,
        age=req.age,
        height=req.height,
        weight=req.weight,
        diet=req.diet or "Vegetarian",
        menstrual_cycle_phase=req.menstrual_cycle_phase,
        intensity=req.intensity or "Moderate",
        lifecycle_status=l_status,
        symptoms=req.symptoms,
        daily_target_mg=req.daily_target_mg,
    )


@app.post("/cycle")
def calculate_cycle_post(req: CycleRequest):
    """Calculate current cycle day, phase, and dynamic personalized iron target."""
    last_date = req.lastPeriod or req.last_period_date or "2026-08-13"
    cycle_len = req.cycleLength or req.cycle_length or 28
    period_len = req.periodLength or req.period_length or 5
    cycle_res = calculate_cycle_phase(last_date, cycle_len, period_len, req.age)
    l_status = req.lifecycle_status or req.lifecycleStatus or "Regular Cycle"

    dynamic_target = calculate_dynamic_iron_target(
        profile={
            "age": req.age,
            "diet": req.diet or "Vegetarian",
            "intensity": req.intensity or "Moderate",
            "lifecycle_status": l_status,
            "weight": req.weight or 55.0,
            "height": req.height or 160.0,
        },
        cycle=cycle_res
    )
    cycle_res["dynamic_target"] = dynamic_target
    return cycle_res


@app.get("/cycle")
def calculate_cycle_get(
    lastPeriod: Optional[str] = Query(None, description="Last period date ISO"),
    last_period_date: Optional[str] = Query(None),
    cycleLength: Optional[int] = Query(28),
    periodLength: Optional[int] = Query(5),
    age: Optional[int] = Query(23),
    diet: Optional[str] = Query("Vegetarian"),
    intensity: Optional[str] = Query("Moderate"),
    lifecycle_status: Optional[str] = Query("Regular Cycle"),
):
    """GET endpoint for cycle calculation and dynamic iron target."""
    last_date = lastPeriod or last_period_date or "2026-08-13"
    cycle_res = calculate_cycle_phase(last_date, cycleLength or 28, periodLength or 5, age)
    dynamic_target = calculate_dynamic_iron_target(
        profile={"age": age, "diet": diet, "intensity": intensity, "lifecycle_status": lifecycle_status},
        cycle=cycle_res
    )
    cycle_res["dynamic_target"] = dynamic_target
    return cycle_res


@app.post("/insights")
def generate_insights_endpoint(req: InsightRequest):
    """Generate personalized, non-diagnostic nutritional insights with dynamic target awareness."""
    dietary_iron = req.dietaryIron if req.dietaryIron is not None else (req.dietary_iron or 2.7)
    absorbed_iron = req.absorbedIron if req.absorbedIron is not None else (req.absorbed_iron or 0.27)

    return generate_personalized_insights(
        profile=req.profile,
        cycle=req.cycle,
        food_name=req.food_name,
        dietary_iron=dietary_iron,
        absorbed_iron=absorbed_iron,
        target=req.target,
        symptoms=req.symptoms,
    )


@app.get("/profile")
def get_profile():
    """Retrieve active demo user profile."""
    return _DEMO_PROFILE or {"status": "empty"}


@app.post("/profile")
def save_profile(profile: Dict[str, Any]):
    """Save user profile in demo session memory."""
    global _DEMO_PROFILE
    _DEMO_PROFILE = profile
    return {"status": "saved", "profile": _DEMO_PROFILE}


@app.post("/auth/login")
def auth_login(req: AuthRequest):
    """Log in user or return active profile."""
    email = req.email.strip().lower()
    if email in _ACCOUNTS_DB:
        acc = _ACCOUNTS_DB[email]
        if req.password and acc.get("password") and req.password != acc["password"]:
            return {"status": "error", "message": "Incorrect password. Please try again."}
        return {"status": "ok", "user": acc, "token": f"nutriher-token-{email}"}

    return {
        "status": "error",
        "message": "Account not found with this email. Please create an account first or try Quick Demo.",
    }


@app.post("/auth/register")
def auth_register(req: AuthRequest):
    """Register a new user account."""
    email = req.email.strip().lower()
    if email in _ACCOUNTS_DB and email not in ["ananya@nutriher.ai", "ananya@example.com"]:
        return {
            "status": "error",
            "message": "An account with this email already exists. Please log in.",
        }

    user_record = {
        "name": req.name or email.split("@")[0].title(),
        "email": email,
        "password": req.password or "password123",
        "age": req.age or 24,
        "diet": req.diet or "Vegetarian",
        "lifecycle_status": req.lifecycle_status or req.lifecycleStatus or "Regular Cycle",
        "lifecycleStatus": req.lifecycle_status or req.lifecycleStatus or "Regular Cycle",
        "weight": req.weight or 55.0,
        "height": req.height or 160.0,
        "cycleLength": req.cycleLength or 28,
        "duration": req.duration or 5,
        "intensity": req.intensity or "Moderate",
        "symptoms": [],
    }
    _ACCOUNTS_DB[email] = user_record
    return {"status": "ok", "user": user_record, "token": f"nutriher-token-{email}"}


@app.get("/auth/accounts")
def list_accounts():
    """Retrieve list of registered accounts."""
    return [
        {k: v for k, v in acc.items() if k != "password"}
        for acc in _ACCOUNTS_DB.values()
    ]


if __name__ == "__main__":
    import uvicorn
    import os

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.main:app", host="0.0.0.0", port=port, reload=False)


