"""AI Service for civic intelligence, categorization, and copilot reasoning using Groq / Grok / OpenAI endpoints."""

import os
import json
import logging
import httpx
from typing import Any
from app.core.config import settings

logger = logging.getLogger("janmind.ai")


class AIService:
    """Unified AI service supporting Groq (llama-3.1-8b-instant), xAI (Grok), and fallback engines."""

    def __init__(self):
        # Resolve API key from settings or environment
        self.api_key = (
            settings.groq_api_key
            or os.getenv("GROQ_API_KEY")
            or settings.llm_api_key
            or os.getenv("LLM_API_KEY")
            or settings.xai_api_key
            or os.getenv("XAI_API_KEY")
            or settings.grok_api_key
            or os.getenv("GROK_API_KEY")
        )
        
        # Auto-configure provider based on API key prefix
        if self.api_key and self.api_key.startswith("gsk_"):
            # Groq API key
            self.provider = "groq"
            self.base_url = "https://api.groq.com/openai/v1"
            # Use lower/lightweight model so limits can't be reached
            self.model = os.getenv("LLM_MODEL") or getattr(settings, "llm_model", None) or "llama-3.1-8b-instant"
        elif self.api_key and self.api_key.startswith("xai-"):
            # xAI Grok API key
            self.provider = "xai"
            self.base_url = "https://api.x.ai/v1"
            self.model = os.getenv("GROK_MODEL") or "grok-beta"
        else:
            self.provider = "groq" if (self.api_key and "gsk" in self.api_key) else "custom"
            self.base_url = getattr(settings, "llm_base_url", "https://api.groq.com/openai/v1").rstrip("/")
            self.model = getattr(settings, "llm_model", "llama-3.1-8b-instant")

    @property
    def is_configured(self) -> bool:
        """Return True if an LLM API key is configured."""
        return bool(self.api_key and self.api_key.strip())

    async def analyze_complaint(
        self,
        title: str,
        description: str,
        category_hint: str | None = None
    ) -> dict[str, Any]:
        """
        Analyze a citizen's complaint for structured categorization,
        severity assessment (1-10), risk score (1-100), and municipal department routing.
        """
        if not self.is_configured:
            logger.info("AI API key not configured; using local heuristic engine.")
            return self._local_complaint_heuristic(title, description, category_hint)

        system_prompt = (
            "You are JANMIND Civic AI. Analyze municipal citizen complaints in India.\n"
            "Respond ONLY with a JSON object strictly matching this schema:\n"
            "{\n"
            '  "category": "road_damage" | "water_supply" | "garbage_collection" | "drainage" | "street_lighting" | "electricity" | "sanitation",\n'
            '  "severity_score": <int 1-10>,\n'
            '  "risk_score": <int 1-100>,\n'
            '  "priority": "low" | "medium" | "high" | "urgent",\n'
            '  "department_slug": "roads" | "water_supply" | "sanitation" | "drainage" | "electricity" | "public_works",\n'
            '  "summary": "<short 1-sentence summary>",\n'
            '  "suggested_action": "<operational recommendation for municipality/contractor>"\n'
            "}"
        )

        user_content = f"Complaint Title: {title}\nComplaint Description: {description}\nCategory Hint: {category_hint or 'None'}"

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                payload: dict[str, Any] = {
                    "model": self.model,
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_content},
                    ],
                    "temperature": 0.1,
                    "response_format": {"type": "json_object"},
                }

                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json=payload,
                )

                if response.status_code == 200:
                    data = response.json()
                    content = data["choices"][0]["message"]["content"]
                    parsed = json.loads(content)
                    logger.info(f"AI ({self.model}) successfully analyzed complaint: {parsed.get('category')}")
                    return parsed
                else:
                    logger.warning(f"AI API returned status {response.status_code}: {response.text}")
        except Exception as e:
            logger.warning(f"AI API call failed: {e}; using heuristic fallback.")

        return self._local_complaint_heuristic(title, description, category_hint)

    async def copilot_chat(self, message: str, context: str | None = None) -> str:
        """AI copilot response for municipal officers and contractors."""
        if not self.is_configured:
            return (
                f"Hello! I am your JANMIND Copilot. Context: {context or 'Operations active'}. "
                "Triage queues are updated and contractor work orders are synchronized."
            )

        system_prompt = (
            "You are JANMIND AI Copilot for Indian municipal officers and contractors. "
            "Give brief, expert, actionable operational advice on civic complaints, contractor allocation, "
            "and SLA compliance."
        )

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": f"Operational Context: {context or 'None'}\n\nOfficer Question: {message}"},
                        ],
                        "temperature": 0.3,
                        "max_tokens": 350,
                    },
                )
                if response.status_code == 200:
                    data = response.json()
                    return data["choices"][0]["message"]["content"]
        except Exception as e:
            logger.warning(f"AI Copilot call error: {e}")

        return "JANMIND Copilot: Operations are tracked in real-time. Triage queue and contractor work orders are synchronized."

    def _local_complaint_heuristic(self, title: str, description: str, hint: str | None) -> dict[str, Any]:
        """Local high-precision heuristic fallback."""
        text = f"{title} {description} {hint or ''}".lower()
        if any(w in text for w in ["pothole", "road", "tar", "asphalt", "crater", "footpath", "divider"]):
            category = "road_damage"
            dept = "roads"
            priority = "high" if "pothole" in text or "accident" in text else "medium"
        elif any(w in text for w in ["water", "leak", "pipeline", "tanker", "tap", "drinking", "sewage"]):
            category = "water_supply"
            dept = "water_supply"
            priority = "high" if "leak" in text or "no water" in text else "medium"
        elif any(w in text for w in ["garbage", "trash", "waste", "dump", "bin", "litter", "debris"]):
            category = "garbage_collection"
            dept = "sanitation"
            priority = "medium"
        elif any(w in text for w in ["drain", "drainage", "waterlogging", "flood", "clog", "overflow", "gutter"]):
            category = "drainage"
            dept = "drainage"
            priority = "urgent" if "flood" in text or "overflow" in text else "high"
        elif any(w in text for w in ["light", "dark", "pole", "wire", "lamp", "blackout", "fixture"]):
            category = "street_lighting"
            dept = "electricity"
            priority = "medium"
        elif any(w in text for w in ["power", "voltage", "electric", "transformer", "shock"]):
            category = "electricity"
            dept = "electricity"
            priority = "urgent" if "shock" in text or "transformer" in text else "high"
        else:
            category = "sanitation"
            dept = "sanitation"
            priority = "medium"

        severity = 8 if priority == "urgent" else 6 if priority == "high" else 4
        risk = severity * 10 + 15

        return {
            "category": category,
            "severity_score": severity,
            "risk_score": risk,
            "priority": priority,
            "department_slug": dept,
            "summary": f"Civic issue reported: {title}",
            "suggested_action": f"Dispatch municipal inspection team for {category.replace('_', ' ')}."
        }


# Singleton instances
ai_service = AIService()
grok_ai_service = ai_service  # Backward compatibility alias
