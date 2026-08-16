"""Category mapping utilities between frontend and backend"""

# Map frontend category names to backend enum values
FRONTEND_TO_BACKEND_CATEGORY = {
    "Water Supply": "water_supply",
    "Road Damage": "road_damage",
    "Garbage Collection": "garbage_collection",
    "Drainage": "drainage",
    "Sewage": "sewage",
    "Street Lighting": "street_lighting",
    "Electricity": "electricity",
    "Public Transport": "public_transport",
    "Sanitation": "sanitation",
}

# Map backend enum values to frontend display names
BACKEND_TO_FRONTEND_CATEGORY = {
    "water_supply": "Water Supply",
    "road_damage": "Road Damage",
    "garbage_collection": "Garbage Collection",
    "drainage": "Drainage",
    "sewage": "Sewage",
    "street_lighting": "Street Lighting",
    "electricity": "Electricity",
    "public_transport": "Public Transport",
    "sanitation": "Sanitation",
    "other": "Other",
}


def frontend_to_backend_category(frontend_category: str) -> str:
    """Convert frontend category display name to backend enum value"""
    return FRONTEND_TO_BACKEND_CATEGORY.get(frontend_category, "other")


def backend_to_frontend_category(backend_category: str) -> str:
    """Convert backend enum value to frontend display name"""
    return BACKEND_TO_FRONTEND_CATEGORY.get(backend_category, "Other")
