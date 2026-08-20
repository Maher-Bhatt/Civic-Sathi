"""Citizen authentication schemas"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class CitizenRegisterRequest(BaseModel):
    """Citizen registration request"""
    name: str = Field(..., min_length=2, max_length=100, description="Full name")
    email: EmailStr = Field(..., description="Email address")
    phone: str = Field(..., min_length=10, max_length=15, description="Phone number")
    password: str = Field(..., min_length=8, max_length=100, description="Password")
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "name": "Rajesh Kumar",
                    "email": "rajesh@example.com",
                    "phone": "+91-9876543210",
                    "password": "securepass123"
                }
            ]
        }
    }


class CitizenLoginRequest(BaseModel):
    """Citizen login request"""
    email: EmailStr = Field(..., description="Email address")
    password: str = Field(..., min_length=8, max_length=100)
    city: Optional[str] = Field(None, max_length=100, description="Optional city context for role-scoped login")
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "email": "rajesh@example.com",
                    "password": "securepass123"
                }
            ]
        }
    }


class CitizenInfo(BaseModel):
    """Citizen information"""
    id: str
    name: str
    email: str
    phone: str
    ward: str
    city: str | None = None
    role: str = "citizen"
    notifyStatus: bool = True
    notifyNearby: bool = True
    
    model_config = {
        "from_attributes": True
    }


class CitizenAuthResponse(BaseModel):
    """Citizen authentication response"""
    access_token: str
    token_type: str = "bearer"
    citizen: CitizenInfo
