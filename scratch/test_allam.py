import os
import httpx
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GROQ_API_KEY")

for model in ["allam-2-7b", "openai/gpt-oss-20b"]:
    print(f"\n--- Testing {model} ---")
    try:
        with httpx.Client(timeout=10) as client:
            res = client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {api_key}"},
                json={
                    "model": model,
                    "messages": [
                        {"role": "system", "content": "You are a civic complaint classifier. Output JSON: {\"category\": \"road_damage\", \"severity_score\": 7}"},
                        {"role": "user", "content": "Pothole on MG Road"}
                    ],
                    "temperature": 0.1,
                    "max_tokens": 150
                }
            )
            print(f"Status: {res.status_code}")
            if res.status_code == 200:
                print("Content:", res.json()["choices"][0]["message"]["content"])
            else:
                print("Error:", res.text)
    except Exception as e:
        print("Exception:", e)
