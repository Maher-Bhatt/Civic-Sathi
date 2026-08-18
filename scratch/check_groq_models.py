import os
import httpx
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GROQ_API_KEY")

with httpx.Client(timeout=10) as client:
    res = client.get(
        "https://api.groq.com/openai/v1/models",
        headers={"Authorization": f"Bearer {api_key}"}
    )
    print("Status:", res.status_code)
    if res.status_code == 200:
        data = res.json()
        models = [m["id"] for m in data.get("data", [])]
        print("Available Groq models on this key:")
        for m in sorted(models):
            print(" -", m)
    else:
        print("Error:", res.text)
