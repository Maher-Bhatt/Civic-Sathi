import os
import httpx
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
candidate_models = ["groq/compound-mini", "openai/gpt-oss-20b", "allam-2-7b", "qwen/qwen3.6-27b"]

for model in candidate_models:
    print(f"\nTesting model: {model}...")
    try:
        with httpx.Client(timeout=10) as client:
            res = client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={"Authorization": f"Bearer {api_key}"},
                json={
                    "model": model,
                    "messages": [
                        {"role": "system", "content": "You are a helpful assistant. Respond with short JSON: {\"status\": \"ok\"}"},
                        {"role": "user", "content": "Hello"}
                    ],
                    "temperature": 0.1,
                    "max_tokens": 100
                }
            )
            print(f" -> Status: {res.status_code}")
            if res.status_code == 200:
                print(" -> Response:", res.json()["choices"][0]["message"]["content"])
            else:
                print(" -> Error:", res.text)
    except Exception as e:
        print(" -> Exception:", e)
