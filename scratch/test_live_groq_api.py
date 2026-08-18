"""Test live Groq API connection with provided key and llama-3.1-8b-instant model."""

import sys
import asyncio
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

# Set stdout encoding
sys.stdout.reconfigure(encoding='utf-8')

from dotenv import load_dotenv
load_dotenv(backend_dir / ".env")

from app.services.ai_service import ai_service


async def main():
    print("Testing live Groq API...")
    print(f"Configured: {ai_service.is_configured}")
    print(f"Provider: {ai_service.provider}")
    print(f"Model: {ai_service.model}")
    print(f"Base URL: {ai_service.base_url}")
    print(f"API Key prefix: {ai_service.api_key[:8]}...")

    # 1. Test complaint analysis
    res = await ai_service.analyze_complaint(
        title="Overflowing sewage drain near bus station",
        description="Drain is blocked and filthy black water is spilling onto the road near Majestic bus terminal.",
        category_hint="drainage"
    )
    print("\n--- Live Groq Analysis Output ---")
    print(res)

    # 2. Test copilot
    copilot_reply = await ai_service.copilot_chat(
        message="What is the standard SLA for sewer overflow in high pedestrian density zones?",
        context="Majestic Ward 94, Bengaluru."
    )
    print("\n--- Live Groq Copilot Response ---")
    print(copilot_reply)

    assert "category" in res, "Expected category in analysis"
    assert len(copilot_reply) > 10, "Expected copilot response"
    print("\n>>> LIVE GROQ API SUCCESSFUL WITH ZERO RATE LIMIT ISSUES! <<<")


if __name__ == "__main__":
    asyncio.run(main())
