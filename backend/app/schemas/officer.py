"""Officer-specific schemas"""

from pydantic import BaseModel, EmailStr


class OfficerLoginRequest(BaseModel):
    """Officer login request"""
    email: EmailStr
    password: str


class OfficerLoginResponse(BaseModel):
    """Officer login response"""
    access_token: str
    token_type: str = "bearer"
    officer: "OfficerInfo"


class OfficerInfo(BaseModel):
    """Officer information"""
    id: str
    name: str
    email: str
    department: str
    designation: str | None = None
    role: str
    city: str = ""


class SeedResponse(BaseModel):
    """Seed data operation response"""
    success: bool
    message: str
    complaints_created: int = 0
    wards_created: int = 0
    departments_created: int = 0
    issues_created: int = 0
    recommendations_created: int = 0
    alerts_created: int = 0
