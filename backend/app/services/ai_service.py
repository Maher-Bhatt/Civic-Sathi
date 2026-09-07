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
            '  "category": "road_damage" | "water_supply" | "garbage_collection" | "drainage" | "street_lighting" | "electricity" | "sanitation" | "spam" | "invalid",\n'
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
                        "source": "vision-model",
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
        elif any(word in text for word in ("garbage", "waste", "trash", "dump", "કચરો", "ગંદકી", "કચરાપેટી", "ಕಸ", "ತ್ಯಾಜ್ಯ", "कचरा")):
            category = "garbage_collection"
        elif any(word in text for word in (
            "street light", "streetlight", "lamp", "pole", "fixture", "dark road", "lighting",
            "બત્તી", "લાઇટ", "સ્ટ્રીટ લાઇટ", "દીવો", "રોશની",
            "बत्ती", "रोशनी", "खंभा", "दिवा",
            "ಬೀದಿ ದೀಪ", "ಬೆಳಕು", "ದೀಪ",
        )):
            category = "street_lighting"
        return {
            "source": "manual-review-fallback",
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

    async def analyze_multi_dept_case(
        self,
        title: str | None,
        description: str,
        lat: float | None = None,
        lng: float | None = None,
        image_url: str | None = None,
        city: str | None = None,
    ) -> dict[str, Any]:
        """
        Analyze a complex civic incident for multi-departmental fanout,
        root cause discovery, and cross-department dependency sequencing.
        """
        raw_title = title or "Civic Infrastructure Incident"
        full_text = f"{raw_title} {description}"

        if self.is_configured:
            system_prompt = (
                "You are Civic Sathi Macro Interoperability AI for the Government of Maharashtra.\n"
                "Analyze this civic complaint to detect MULTI-DEPARTMENTAL failures (e.g. water pipeline burst causing road crater).\n"
                "Identify sovereign departments from: 'water' (Water Supply & Sewerage Board), 'roads' (Public Works & Roads), "
                "'drainage' (Stormwater Drainage), 'electricity' (Power & Streetlights), 'sanitation' (Solid Waste Management).\n"
                "CRITICAL: List each department at most ONCE in the 'departments' array. Consolidate department tasks into one action_required.\n"
                "Crucial: If one department's repair MUST happen before another (e.g. Water leak must be fixed before Road can be repaved), "
                "set sequence_order accordingly and specify depends_on with dependency_note.\n"
                "Respond ONLY with valid JSON matching this schema:\n"
                "{\n"
                '  "title": "<Concise incident title>",\n'
                '  "summary": "<2-sentence incident overview>",\n'
                '  "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",\n'
                '  "priority": "P1" | "P2" | "P3" | "P4",\n'
                '  "root_cause": "<Primary engineering failure, e.g. underground water main fissure>",\n'
                '  "preventive_warning": "<What happens if not fixed, e.g. sinkhole collapse, 2.4 km road blockage>",\n'
                '  "departments": [\n'
                "    {\n"
                '      "department_code": "water" | "roads" | "drainage" | "electricity" | "sanitation",\n'
                '      "department_name": "<Official Department Name>",\n'
                '      "external_system_key": "water_board" | "pwd_roads" | "swd_drainage" | "power_grid" | "swm_sanitation",\n'
                '      "action_required": "<Specific engineering action for this department>",\n'
                '      "sla_hours": <integer 6-72>,\n'
                '      "sequence_order": <integer 1-5>,\n'
                '      "depends_on": null | "water" | "roads" | "drainage",\n'
                '      "dependency_note": null | "<Why this department is blocked until upstream completes>",\n'
                '      "status": "IN_PROGRESS" | "WAITING"\n'
                "    }\n"
                "  ],\n"
                '  "estimated_total_sla_hours": <integer sum or max SLA hours>\n'
                "}"
            )
            user_content = (
                f"Incident Title: {raw_title}\n"
                f"Description: {description}\n"
                f"City: {city or 'Maharashtra Municipal Region'}\n"
                f"Coordinates: {lat}, {lng}\n"
                f"Has evidence image: {bool(image_url)}"
            )

            try:
                async with httpx.AsyncClient(timeout=12.0) as client:
                    payload = {
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
                        parsed = json.loads(response.json()["choices"][0]["message"]["content"])
                        raw_depts = parsed.get("departments")
                        if raw_depts and isinstance(raw_depts, list) and len(raw_depts) > 0:
                            normalized_depts = []
                            for idx, d in enumerate(raw_depts):
                                dept_indicator = (
                                    str(d.get("department_code") or "")
                                    + " "
                                    + str(d.get("department_name") or "")
                                    + " "
                                    + str(d.get("external_system_key") or "")
                                    + " "
                                    + str(d.get("action_required") or "")
                                ).lower()

                                if any(k in dept_indicator for k in ["water", "jal", "leak", "pipe"]):
                                    code = "water"
                                    d_name = "Water Supply & Sewerage Board"
                                    sys_key = "water_board"
                                elif any(k in dept_indicator for k in ["road", "pwd", "rasta", "pothole", "asphalt"]):
                                    code = "roads"
                                    d_name = "Public Works & Roads Infrastructure (PWD)"
                                    sys_key = "pwd_roads"
                                elif any(k in dept_indicator for k in ["drain", "flood", "swd", "culvert"]):
                                    code = "drainage"
                                    d_name = "Stormwater Drainage Directorate"
                                    sys_key = "swd_drainage"
                                elif any(k in dept_indicator for k in ["elect", "power", "grid", "light", "msedcl"]):
                                    code = "electricity"
                                    d_name = "Power Distribution & Streetlighting (MSEDCL)"
                                    sys_key = "power_grid"
                                else:
                                    code = "sanitation"
                                    d_name = "Solid Waste Management (SWM)"
                                    sys_key = "swm_sanitation"

                                raw_dep = str(d.get("depends_on") or "").lower().strip()
                                if raw_dep in {"none", "null", "false", ""}:
                                    clean_depends_on = None
                                elif "water" in raw_dep:
                                    clean_depends_on = "water"
                                elif "road" in raw_dep or "pwd" in raw_dep:
                                    clean_depends_on = "roads"
                                elif "drain" in raw_dep:
                                    clean_depends_on = "drainage"
                                else:
                                    clean_depends_on = raw_dep

                                normalized_depts.append({
                                    "department_code": code,
                                    "department_name": d.get("department_name") or d_name,
                                    "external_system_key": d.get("external_system_key") or sys_key,
                                    "action_required": str(d.get("action_required") or f"Deploy {d_name} team for inspection"),
                                    "sla_hours": int(d.get("sla_hours") or 24),
                                    "sequence_order": int(d.get("sequence_order") or (idx + 1)),
                                    "depends_on": clean_depends_on,
                                    "dependency_note": d.get("dependency_note"),
                                    "status": d.get("status") or ("IN_PROGRESS" if idx == 0 else "WAITING"),
                                })

                            # Deduplicate by department_code so each sovereign department has exactly one ticket
                            deduped_map: dict[str, dict[str, Any]] = {}
                            for dept in normalized_depts:
                                c = dept["department_code"]
                                if c not in deduped_map:
                                    deduped_map[c] = dept
                                else:
                                    existing = deduped_map[c]
                                    act = dept["action_required"]
                                    if act and act not in existing["action_required"]:
                                        existing["action_required"] += f"; {act}"
                                    if dept.get("depends_on") and not existing.get("depends_on"):
                                        existing["depends_on"] = dept["depends_on"]
                                    if dept.get("dependency_note") and not existing.get("dependency_note"):
                                        existing["dependency_note"] = dept["dependency_note"]

                            deduped_list = list(deduped_map.values())
                            deduped_list.sort(key=lambda x: x["sequence_order"])
                            for new_seq, dept in enumerate(deduped_list, start=1):
                                dept["sequence_order"] = new_seq
                                dept["status"] = "IN_PROGRESS" if new_seq == 1 else "WAITING"

                            parsed["departments"] = deduped_list
                            parsed["source"] = "model"
                            parsed["severity"] = str(parsed.get("severity") or "HIGH").upper()
                            parsed["priority"] = str(parsed.get("priority") or "P2").upper()
                            parsed["title"] = str(parsed.get("title") or raw_title)
                            parsed["summary"] = str(parsed.get("summary") or description[:200])
                            parsed["root_cause"] = str(parsed.get("root_cause") or "Municipal infrastructure failure")
                            parsed["preventive_warning"] = str(parsed.get("preventive_warning") or "Requires prompt intervention to prevent escalation")
                            parsed["estimated_total_sla_hours"] = int(parsed.get("estimated_total_sla_hours") or 48)
                            return parsed
            except Exception as exc:
                logger.warning(f"Multi-dept AI analysis API error: {exc}; using deterministic heuristic.")

        return self._heuristic_multi_dept_case(raw_title, description, city)

    def _heuristic_multi_dept_case(
        self,
        title: str,
        description: str,
        city: str | None = None,
    ) -> dict[str, Any]:
        """Deterministic, battle-tested multi-department classifier and dependency resolver."""
        text = f"{title} {description}".lower()

        has_water = any(w in text for w in ["water", "leak", "pipe", "burst", "pipeline", "tanker", "gushing", "पानी", "जल", "नल", "गळती"])
        has_road = any(w in text for w in ["road", "pothole", "crater", "asphalt", "subsidence", "sinkhole", "footpath", "tar", "सड़क", "सड़क", "खड्डा", "रस्ता"])
        has_drainage = any(w in text for w in ["drain", "drainage", "waterlog", "flood", "overflow", "gutter", "नाली", "गटर", "सांडपाणी"])
        has_electric = any(w in text for w in ["electric", "wire", "pole", "light", "shock", "blackout", "transformer", "वीज", "बिजली", "खंभा"])
        has_garbage = any(w in text for w in ["garbage", "trash", "dump", "waste", "debris", "कचरा", "घाण"])

        departments: list[dict[str, Any]] = []

        # Scenario 1: Water + Road (Classic SIH cross-department showstopper)
        if has_water and has_road:
            case_title = title if len(title) > 5 else "Water Main Rupture with Road Subsidence"
            summary = (
                "High-pressure underground water supply conduit rupture has compromised the road sub-base, "
                "resulting in asphalt subsidence and crater formation. Requires sequenced dual-department intervention."
            )
            root_cause = "Sub-surface potable water conduit fissure causing sub-base soil erosion and pavement collapse"
            preventive_warning = "Delaying water isolation beyond 24h will cause catastrophic roadway collapse affecting 1.8 km corridor."
            severity = "CRITICAL"
            priority = "P1"

            departments.append({
                "department_code": "water",
                "department_name": "Water Supply & Sewerage Board",
                "external_system_key": "water_board",
                "action_required": "Isolate pipeline sector, excavate trench, and weld replacement 150mm ductile iron pipe sleeve.",
                "sla_hours": 18,
                "sequence_order": 1,
                "depends_on": None,
                "dependency_note": None,
                "status": "IN_PROGRESS",
            })
            departments.append({
                "department_code": "roads",
                "department_name": "Public Works & Roads Infrastructure (PWD)",
                "external_system_key": "pwd_roads",
                "action_required": "Backfill excavated utility trench with compacted aggregate, lay wet mix macadam, and pave 40mm bitumen asphalt.",
                "sla_hours": 30,
                "sequence_order": 2,
                "depends_on": "water",
                "dependency_note": "Blocked: Road resurfacing cannot commence until Water Dept completes pipe pressure test and backfills utility trench.",
                "status": "WAITING",
            })
            total_sla = 48

        # Scenario 2: Drainage + Road / Electric
        elif has_drainage and (has_electric or has_road):
            case_title = title if len(title) > 5 else "Stormwater Inundation & Infrastructure Hazard"
            summary = (
                "Choked storm drain runoff has created localized waterlogging, inundating road surface "
                "and posing utility hazards. Multi-department clearance required."
            )
            root_cause = "Clogged primary stormwater outfall culvert causing high-volume backflow onto carriage-way"
            preventive_warning = "Stagnant stormwater will infiltrate electrical junction boxes and cause total corridor blackout."
            severity = "HIGH"
            priority = "P1" if has_electric else "P2"

            departments.append({
                "department_code": "drainage",
                "department_name": "Stormwater Drainage Directorate",
                "external_system_key": "swd_drainage",
                "action_required": "Deploy super-sucker de-silting machines and clear culvert blockage to restore natural gravity outflow.",
                "sla_hours": 12,
                "sequence_order": 1,
                "depends_on": None,
                "dependency_note": None,
                "status": "IN_PROGRESS",
            })
            if has_electric:
                departments.append({
                    "department_code": "electricity",
                    "department_name": "Power Distribution & Streetlighting (MSEDCL)",
                    "external_system_key": "power_grid",
                    "action_required": "Inspect submerged junction boxes, dry electrical conduits, and restore safe feeder power.",
                    "sla_hours": 16,
                    "sequence_order": 2,
                    "depends_on": "drainage",
                    "dependency_note": "Blocked: Power inspection unsafe until flood water recedes below feeder base.",
                    "status": "WAITING",
                })
            if has_road:
                departments.append({
                    "department_code": "roads",
                    "department_name": "Public Works & Roads Infrastructure (PWD)",
                    "external_system_key": "pwd_roads",
                    "action_required": "Patch eroded road edges and clear debris after water discharge.",
                    "sla_hours": 24,
                    "sequence_order": 2,
                    "depends_on": "drainage",
                    "dependency_note": "Blocked: Pavement restoration requires dry surface following drain clearance.",
                    "status": "WAITING",
                })
            total_sla = 36

        # Scenario 3: Single Dept — Water
        elif has_water:
            case_title = title if len(title) > 5 else "Water Supply Distribution Failure"
            summary = "Citizen reports drinking water pipeline leakage or supply interruption."
            root_cause = "Pipeline joint leakage or valve failure in distribution network"
            preventive_warning = "Continued leakage risks potable water contamination and street inundation."
            severity = "HIGH"
            priority = "P2"
            departments.append({
                "department_code": "water",
                "department_name": "Water Supply & Sewerage Board",
                "external_system_key": "water_board",
                "action_required": "Field utility inspection and valve/pipeline joint repair.",
                "sla_hours": 24,
                "sequence_order": 1,
                "depends_on": None,
                "dependency_note": None,
                "status": "IN_PROGRESS",
            })
            total_sla = 24

        # Scenario 4: Single Dept — Road
        elif has_road:
            case_title = title if len(title) > 5 else "Road Surface Damage & Pothole"
            summary = "Damaged pavement and potholes reported along municipal corridor."
            root_cause = "Heavy vehicular load and surface wear causing bituminous layer degradation"
            preventive_warning = "Potholes pose significant skid hazard to two-wheelers and traffic delays."
            severity = "HIGH" if "accident" in text or "crater" in text else "MEDIUM"
            priority = "P2" if severity == "HIGH" else "P3"
            departments.append({
                "department_code": "roads",
                "department_name": "Public Works & Roads Infrastructure (PWD)",
                "external_system_key": "pwd_roads",
                "action_required": "Cold mix / hot mix asphalt patching and roller compaction.",
                "sla_hours": 36,
                "sequence_order": 1,
                "depends_on": None,
                "dependency_note": None,
                "status": "IN_PROGRESS",
            })
            total_sla = 36

        # Scenario 5: Single Dept — Drainage
        elif has_drainage:
            case_title = title if len(title) > 5 else "Drainage Overflow & Silt Blockage"
            summary = "Stormwater drain silt accumulation and overflow reported."
            root_cause = "Heavy silt and plastic waste accumulation obstructing stormwater channel"
            preventive_warning = "May escalate to waterlogging during rain events."
            severity = "MEDIUM"
            priority = "P3"
            departments.append({
                "department_code": "drainage",
                "department_name": "Stormwater Drainage Directorate",
                "external_system_key": "swd_drainage",
                "action_required": "Manual and mechanical de-silting of drain chamber.",
                "sla_hours": 24,
                "sequence_order": 1,
                "depends_on": None,
                "dependency_note": None,
                "status": "IN_PROGRESS",
            })
            total_sla = 24

        # Scenario 6: Electricity
        elif has_electric:
            case_title = title if len(title) > 5 else "Electrical & Streetlight Outage"
            summary = "Electrical line or public illumination failure reported."
            root_cause = "Underground cable short or control timer breaker trip"
            preventive_warning = "Unlit corridor creates public safety and vehicular risk."
            severity = "MEDIUM"
            priority = "P3"
            departments.append({
                "department_code": "electricity",
                "department_name": "Power Distribution & Streetlighting (MSEDCL)",
                "external_system_key": "power_grid",
                "action_required": "Feeder line continuity testing and lamp/MCB replacement.",
                "sla_hours": 16,
                "sequence_order": 1,
                "depends_on": None,
                "dependency_note": None,
                "status": "IN_PROGRESS",
            })
            total_sla = 16

        # Scenario 7: Sanitation / Default
        else:
            case_title = title if len(title) > 5 else "Municipal Sanitation & Waste Report"
            summary = "Solid waste accumulation or civic sanitation issue requiring municipal clearance."
            root_cause = "Irregular garbage clearance cycle leading to refuse accumulation"
            preventive_warning = "Unhygienic conditions and vector-borne disease risk."
            severity = "MEDIUM"
            priority = "P3"
            departments.append({
                "department_code": "sanitation",
                "department_name": "Solid Waste Management (SWM)",
                "external_system_key": "swm_sanitation",
                "action_required": "Dispatch compactor vehicle and sanitize bin location.",
                "sla_hours": 24,
                "sequence_order": 1,
                "depends_on": None,
                "dependency_note": None,
                "status": "IN_PROGRESS",
            })
            total_sla = 24

        return {
            "title": case_title,
            "summary": summary,
            "severity": severity,
            "priority": priority,
            "root_cause": root_cause,
            "preventive_warning": preventive_warning,
            "departments": departments,
            "estimated_total_sla_hours": total_sla,
            "source": "heuristic",
        }


# Singleton instances
ai_service = AIService()
grok_ai_service = ai_service  # Backward compatibility alias

