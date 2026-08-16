"""Custom exceptions and error handling"""

from typing import Any
from uuid import uuid4
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError


class AppException(Exception):
    """Base application exception"""
    
    def __init__(
        self,
        message: str,
        code: str = "APP_ERROR",
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: dict[str, Any] | None = None,
    ):
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)


class ValidationException(AppException):
    """Validation error exception"""
    
    def __init__(self, message: str, fields: dict[str, list[str]] | None = None):
        super().__init__(
            message=message,
            code="VALIDATION_ERROR",
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            details={"fields": fields or {}},
        )


class NotFoundException(AppException):
    """Resource not found exception"""
    
    def __init__(self, message: str = "Resource not found"):
        super().__init__(
            message=message,
            code="NOT_FOUND",
            status_code=status.HTTP_404_NOT_FOUND,
        )


class UnauthorizedException(AppException):
    """Unauthorized access exception"""
    
    def __init__(self, message: str = "Unauthorized"):
        super().__init__(
            message=message,
            code="UNAUTHORIZED",
            status_code=status.HTTP_401_UNAUTHORIZED,
        )


class ForbiddenException(AppException):
    """Forbidden access exception"""
    
    def __init__(self, message: str = "Forbidden"):
        super().__init__(
            message=message,
            code="FORBIDDEN",
            status_code=status.HTTP_403_FORBIDDEN,
        )


def create_error_response(
    code: str,
    message: str,
    status_code: int,
    fields: dict[str, list[str]] | None = None,
    request_id: str | None = None,
) -> JSONResponse:
    """Create standardized error response"""
    
    error_data = {
        "error": {
            "code": code,
            "message": message,
            "request_id": request_id or f"req_{uuid4().hex[:12]}",
        }
    }
    
    if fields:
        error_data["error"]["fields"] = fields
    
    return JSONResponse(
        status_code=status_code,
        content=error_data,
    )


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    """Handle custom application exceptions"""
    return create_error_response(
        code=exc.code,
        message=exc.message,
        status_code=exc.status_code,
        fields=exc.details.get("fields"),
    )


async def validation_exception_handler(
    request: Request, exc: RequestValidationError | ValidationError
) -> JSONResponse:
    """Handle Pydantic validation errors"""
    
    fields = {}
    for error in exc.errors():
        field_path = ".".join(str(loc) for loc in error["loc"][1:])
        if field_path not in fields:
            fields[field_path] = []
        fields[field_path].append(error["msg"])
    
    return create_error_response(
        code="VALIDATION_ERROR",
        message="Request validation failed",
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        fields=fields,
    )


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handle unexpected exceptions"""
    return create_error_response(
        code="INTERNAL_ERROR",
        message="An unexpected error occurred",
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
