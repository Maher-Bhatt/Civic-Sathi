"""AI Service for civic intelligence, categorization, and copilot reasoning using Groq / Grok / OpenAI endpoints."""

import os
import json
import logging
import httpx
from typing import Any
from app.core.config import settings

logger = logging.getLogger("civicsathi.ai")


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
            self.model = os.getenv("LLM_MODEL") or getattr(settings, "llm_model", None) or "llama-3.1-8b-instant"
            self.vision_model = os.getenv("VISION_MODEL") or "meta-llama/llama-4-scout-17b-16e-instruct"

        elif self.api_key and self.api_key.startswith("xai-"):
            # xAI Grok API key
            self.provider = "xai"
            self.base_url = "https://api.x.ai/v1"
            self.model = os.getenv("GROK_MODEL") or "grok-beta"
            self.vision_model = os.getenv("VISION_MODEL") or "grok-2-vision-1212"

        else:
            self.provider = "groq" if (self.api_key and "gsk" in self.api_key) else "custom"
            self.base_url = getattr(settings, "llm_base_url", "https://api.groq.com/openai/v1").rstrip("/")
            self.model = getattr(settings, "llm_model", "llama-3.1-8b-instant")
            self.vision_model = os.getenv("VISION_MODEL") or getattr(settings, "vision_model", None) or "llama-4-scout-17b-16e-instruct"

    @property
    def is_configured(self) -> bool:
        """Return True if an LLM API key is configured."""
        return bool(self.api_key and self.api_key.strip())

    @property
    def vision_configured(self) -> bool:
        """Return True when a provider and vision model are configured."""
        return self.is_configured and bool(self.vision_model)

    @staticmethod
    def _detect_language(text: str, requested: str | None = None) -> str:
        if requested and requested.strip().lower() in {"en", "hi", "gu", "kn"}:
            return requested.strip().lower()
        if any("\u0900" <= char <= "\u097f" for char in text):
            return "hi"
        if any("\u0a80" <= char <= "\u0aff" for char in text):
            return "gu"
        if any("\u0c80" <= char <= "\u0cff" for char in text):
            return "kn"
        return "en"

    async def analyze_complaint(
        self,
        title: str,
        description: str,
        category_hint: str | None = None,
        language: str | None = None,
    ) -> dict[str, Any]:
        """
        Analyze a citizen's complaint for structured categorization,
        severity assessment (1-10), risk score (1-100), and municipal department routing.
        """
        detected_language = self._detect_language(f"{title} {description}", language)
        if not self.is_configured:
            logger.info("AI API key not configured; using local multilingual heuristic engine.")
            return self._local_complaint_heuristic(title, description, category_hint, detected_language)

        system_prompt = (
            "You are Civic Sathi Civic AI. Analyze municipal citizen complaints in India.\n"
            "Respond ONLY with a JSON object strictly matching this schema:\n"
            "{\n"
            '  "category": "road_damage" | "water_supply" | "garbage_collection" | "drainage" | "street_lighting" | "electricity" | "sanitation",\n'
            '  "severity_score": <int 1-10>,\n'
            '  "risk_score": <int 1-100>,\n'
            '  "priority": "low" | "medium" | "high" | "urgent",\n'
            '  "department_slug": "roads" | "water_supply" | "sanitation" | "drainage" | "electricity" | "public_works",\n'
            '  "language": "en" | "hi" | "gu" | "kn",\n'
            '  "interpreted_text": "<plain-English explanation of what the citizen is reporting>",\n'
            '  "summary": "<short 1-sentence summary>",\n'
            '  "suggested_action": "<operational recommendation for municipality/contractor>"\n'
            "}"
        )

        user_content = (
            f"Complaint Title: {title}\n"
            f"Complaint Description: {description}\n"
            f"Category Hint: {category_hint or 'None'}\n"
            f"Requested/input language: {detected_language}. Detect the actual language. "
            "Understand Hindi, Gujarati, Kannada, English, and mixed-language text. "
            "Write interpreted_text, summary, and suggested_action in clear English for municipal officers, "
            "while preserving the citizen's meaning and not inventing facts."
        )

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

        return self._local_complaint_heuristic(title, description, category_hint, detected_language)

    async def analyze_image(self, data_url: str, description: str | None = None) -> dict[str, Any]:
        """Analyze image pixels through an OpenAI-compatible vision endpoint."""
        if not self.vision_configured:
            return self._manual_image_review(description)

        system_prompt = (
            "You are Civic Sathi Vision, a careful civic-infrastructure image reviewer in India. "
            "Inspect the actual image pixels and respond only with JSON. Do not infer a category from a filename. "
            "If the image is unclear, say so and lower confidence. Use exactly one category from: "
            "road_damage, water_supply, garbage_collection, drainage, street_lighting, electricity, sanitation. "
            "Return {detected, category, confidence, evidence, safety_note}."
        )
        user_text = (
            "Review this citizen evidence photo. Describe only visible civic conditions, explain the visual evidence, "
            "and recommend a category. Citizen context: " + (description or "not provided")
        )
        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": self.vision_model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": [
                                {"type": "text", "text": user_text},
                                {"type": "image_url", "image_url": {"url": data_url, "detail": "auto"}},
                            ]},
                        ],
                        "temperature": 0.1,
                        "response_format": {"type": "json_object"},
                    },
                )
                if response.status_code == 200:
                    payload = response.json()
                    parsed = json.loads(payload["choices"][0]["message"]["content"])
                    allowed = {"road_damage", "water_supply", "garbage_collection", "drainage", "street_lighting", "electricity", "sanitation"}
                    category = str(parsed.get("category", "sanitation")).lower().strip()
                    if category not in allowed:
                        category = "sanitation"
                    confidence = str(parsed.get("confidence", "Low")).title()
                    if confidence not in {"Low", "Medium", "High"}:
                        confidence = "Low"
                    return {
                        "detected": str(parsed.get("detected") or "Civic condition visible; verify during field inspection"),
                        "category": category,
                        "confidence": confidence,
                        "evidence": str(parsed.get("evidence") or "The vision model did not provide a detailed evidence note."),
                        "safety_note": str(parsed.get("safety_note") or "Do not treat this suggestion as a safety clearance."),
                    }
                logger.warning("Vision API returned status %s: %s", response.status_code, response.text[:300])
        except Exception as exc:
            logger.warning("Vision analysis failed: %s", exc)
        return self._manual_image_review(description)

    def _manual_image_review(self, description: str | None = None) -> dict[str, Any]:
        """Honest fallback when a vision provider is unavailable; never pretend to see pixels."""
        text = (description or "").lower()
        category = "sanitation"
        if any(word in text for word in ("pothole", "road", "footpath")):
            category = "road_damage"
        elif any(word in text for word in ("drain", "waterlogging", "flood", "overflow")):
            category = "drainage"
        elif any(word in text for word in ("leak", "tap", "pipeline", "no water")):
            category = "water_supply"
        elif any(word in text for word in ("garbage", "waste", "trash", "dump")):
            category = "garbage_collection"
        return {
            "detected": "Image received; manual municipal verification required",
            "category": category,
            "confidence": "Low",
            "evidence": "No vision provider was available, so no claim is made about image pixels.",
            "safety_note": "A field inspector must verify the condition before action.",
        }

    async def copilot_chat(self, message: str, context: str | None = None) -> str:

        """AI copilot response for municipal officers and contractors."""
        if not self.is_configured:
            return (
                f"Hello! I am your Civic Sathi Copilot. Context: {context or 'Operations active'}. "
                "Triage queues are updated and contractor work orders are synchronized."
            )

        system_prompt = (
            "You are Civic Sathi AI Copilot for Indian municipal officers and contractors. "
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

        return "Civic Sathi Copilot: Operations are tracked in real-time. Triage queue and contractor work orders are synchronized."

    def _local_complaint_heuristic(self, title: str, description: str, hint: str | None, language: str | None = None) -> dict[str, Any]:
        """Deterministic multilingual fallback used only when the model provider is unavailable."""
        text = f"{title} {description} {hint or ''}".lower()
        detected_language = language or self._detect_language(text)
        if any(w in text for w in ["pothole", "road", "tar", "asphalt", "crater", "footpath", "divider", "सड़क", "सड़क", "गड्ढा", "રસ્તો", "ખાડો", "ರಸ್ತೆ", "ಗುಂಡಿ"]):
            category = "road_damage"
            dept = "roads"
            priority = "high" if "pothole" in text or "accident" in text else "medium"
        elif any(w in text for w in ["water", "leak", "pipeline", "tanker", "tap", "drinking", "sewage", "पानी", "जल", "नल", "लीक", "પાણી", "નળ", "લીક", "ನೀರು", "ನಳ", "ಸೋರಿಕೆ"]):
            category = "water_supply"
            dept = "water_supply"
            priority = "high" if "leak" in text or "no water" in text else "medium"
        elif any(w in text for w in ["garbage", "trash", "waste", "dump", "bin", "litter", "debris", "कचरा", "कूड़ा", "कूड़ा", "गंदगी", "કચરો", "ગંદકી", "કચરાપેટી", "ಕಸ", "ತ್ಯಾಜ್ಯ"]):
            category = "garbage_collection"
            dept = "sanitation"
            priority = "medium"
        elif any(w in text for w in ["drain", "drainage", "waterlogging", "flood", "clog", "overflow", "gutter", "नाली", "जलभराव", "बाढ़", "ओवरफ्लो", "ગટર", "ડ્રેનેજ", "પાણી ભરાવું", "ಚರಂಡಿ", "ನೀರು ನಿಲ್ಲಿಕೆ"]):
            category = "drainage"
            dept = "drainage"
            priority = "urgent" if "flood" in text or "overflow" in text else "high"
        elif any(w in text for w in ["light", "dark", "pole", "wire", "lamp", "blackout", "fixture", "बत्ती", "रोशनी", "खंभा", "બત્તી", "લાઇટ", "વીજળી", "ದೀಪ", "ಬೆಳಕು", "ವಿದ್ಯುತ್"]):
            category = "street_lighting"
            dept = "electricity"
            priority = "medium"
        elif any(w in text for w in ["power", "voltage", "electric", "transformer", "shock", "बिजली", "वोल्टेज", "ट्रांसफॉर्मर", "झटका", "વીજળી", "વોલ્ટેજ", "ટ્રાન્સફોર્મર", "વીજ શોક", "ವೋಲ್ಟೇಜ್", "ಟ್ರಾನ್ಸ್‌ಫಾರ್ಮರ್", "ವಿದ್ಯುತ್ ಆಘಾತ"]):
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
            "language": detected_language,
            "interpreted_text": f"Citizen reports a {category.replace('_', ' ')} issue: {description[:300]}",
            "summary": f"Citizen reports a {category.replace('_', ' ')} issue.",
            "suggested_action": f"Dispatch the {dept.replace('_', ' ')} inspection team to verify and route the {category.replace('_', ' ')} complaint."
        }


# Singleton instances
ai_service = AIService()
grok_ai_service = ai_service  # Backward compatibility alias
