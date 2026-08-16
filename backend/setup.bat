@echo off
REM JANMIND Backend - Automated Setup Script for Windows
REM This script automates the complete backend setup process

echo ========================================
echo  JANMIND Backend Setup Automation
echo ========================================
echo.

REM Check if we're in the backend directory
if not exist "requirements.txt" (
    echo ERROR: Please run this script from the backend directory!
    echo Current directory: %CD%
    pause
    exit /b 1
)

REM Step 1: Check if virtual environment is activated
echo [1/8] Checking virtual environment...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found or virtual environment not activated!
    echo Please activate your virtual environment first:
    echo   .venv\Scripts\activate
    pause
    exit /b 1
)
echo ✓ Python environment detected
echo.

REM Step 2: Verify core packages are installed
echo [2/8] Verifying package installation...
python -c "import spacy, torch, faiss, sqlalchemy" >nul 2>&1
if errorlevel 1 (
    echo WARNING: Core packages not fully installed yet.
    echo Please wait for pip installation to complete, then run this script again.
    echo.
    echo To check installation status, run:
    echo   python -m pip list
    pause
    exit /b 1
)
echo ✓ Core packages verified
echo.

REM Step 3: Download spaCy language model
echo [3/8] Downloading spaCy language model...
python -c "import spacy; spacy.load('en_core_web_sm')" >nul 2>&1
if errorlevel 1 (
    echo Downloading en_core_web_sm model...
    python -m spacy download en_core_web_sm
    if errorlevel 1 (
        echo ERROR: Failed to download spaCy model
        pause
        exit /b 1
    )
) else (
    echo ✓ spaCy model already installed
)
echo.

REM Step 4: Set up environment configuration
echo [4/8] Setting up environment configuration...
if not exist ".env" (
    if exist ".env.example" (
        copy .env.example .env >nul
        echo ✓ Created .env file from .env.example
        echo.
        echo IMPORTANT: Please edit .env file and update:
        echo   - DATABASE_URL (get from Neon console)
        echo   - OFFICER_API_KEY (generate a secure random key)
        echo.
        echo Press any key after you've updated .env file...
        pause >nul
    ) else (
        echo ERROR: .env.example file not found!
        pause
        exit /b 1
    )
) else (
    echo ✓ .env file already exists
)
echo.

REM Step 5: Check database connection
echo [5/8] Testing database connection...
python -c "from app.core.database import engine; engine.connect()" >nul 2>&1
if errorlevel 1 (
    echo ERROR: Cannot connect to database!
    echo Please check your DATABASE_URL in .env file
    echo Make sure it includes ?sslmode=require at the end
    pause
    exit /b 1
)
echo ✓ Database connection successful
echo.

REM Step 6: Run database migrations
echo [6/8] Setting up database schema...

REM Check if initial migration exists
if not exist "alembic\versions\*_initial_schema.py" (
    echo Creating initial migration...
    alembic revision --autogenerate -m "Initial schema"
    if errorlevel 1 (
        echo ERROR: Failed to create migration
        pause
        exit /b 1
    )
)

echo Applying migrations...
alembic upgrade head
if errorlevel 1 (
    echo ERROR: Failed to apply migrations
    pause
    exit /b 1
)
echo ✓ Database schema created
echo.

REM Step 7: Load demo data
echo [7/8] Loading demo data...
python -c "from app.services.seed_service import load_demo_data; import asyncio; asyncio.run(load_demo_data())" 2>nul
if errorlevel 1 (
    echo Note: Demo data may already be loaded or there was an error
    echo You can manually load data later using the /api/v1/seed/demo endpoint
) else (
    echo ✓ Demo data loaded successfully
)
echo.

REM Step 8: Final verification
echo [8/8] Running final checks...
python -c "import sys; from app.core.config import get_settings; settings = get_settings(); sys.exit(0 if settings.DATABASE_URL else 1)" >nul 2>&1
if errorlevel 1 (
    echo ERROR: Configuration validation failed
    pause
    exit /b 1
)
echo ✓ All checks passed
echo.

REM Setup complete
echo ========================================
echo  Setup Complete! 🚀
echo ========================================
echo.
echo Your backend is ready to run!
echo.
echo To start the development server:
echo   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
echo.
echo Then open in your browser:
echo   http://localhost:8000/docs
echo.
echo Quick API Tests:
echo   1. POST /api/v1/seed/demo - Load demo data
echo   2. POST /api/v1/issues/rebuild - Build systemic issues  
echo   3. GET /api/v1/issues - View detected issues
echo   4. GET /api/v1/analytics/summary - Dashboard data
echo.
echo Don't forget to add your X-Officer-Key header for protected endpoints!
echo.
pause
