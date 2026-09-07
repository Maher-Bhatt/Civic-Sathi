"""Real-time event broadcaster for Sathi Setu and SIH26129 Interoperability Bus"""

import asyncio
import json
import logging
from collections import deque
from datetime import datetime, timezone
from typing import AsyncGenerator
from uuid import uuid4

from app.schemas.integration import LiveTransitMessage

logger = logging.getLogger(__name__)


class EventBroadcaster:
    """
    In-memory async pub/sub broadcaster for live interoperability events.
    Supports Server-Sent Events (SSE) streaming and ring-buffer history.
    """

    def __init__(self, max_history: int = 50):
        self._subscribers: set[asyncio.Queue] = set()
        self._history: deque[LiveTransitMessage] = deque(maxlen=max_history)
        self._seed_initial_history()

    def _seed_initial_history(self):
        """Seed realistic initial interoperability events for immediate demo visualization"""
        now = datetime.now(timezone.utc)
        seeds = [
            LiveTransitMessage(
                id=f"msg-{uuid4().hex[:8]}",
                timestamp=now.isoformat(),
                source="mcgm_portal",
                target="sathi_setu",
                event_type="CITIZEN_GRIEVANCE_INTAKE",
                summary="High-pressure pipe leak & asphalt crater registered on SV Road, Bandra",
                case_number="MH-MCGM-2026-080596",
                status="success",
                payload={"ward": "H-West", "severity": "CRITICAL", "priority": "P1"},
            ),
            LiveTransitMessage(
                id=f"msg-{uuid4().hex[:8]}",
                timestamp=now.isoformat(),
                source="sathi_setu",
                target="water_board",
                event_type="DISPATCH_WORK_ORDER",
                summary="Ticket WS-32025 dispatched to Water Supply & Sewerage Board via REST API",
                case_number="MH-MCGM-2026-080596",
                status="success",
                payload={"external_ticket": "WS-32025", "sla_hours": 18, "action": "Weld 150mm sleeve"},
            ),
            LiveTransitMessage(
                id=f"msg-{uuid4().hex[:8]}",
                timestamp=now.isoformat(),
                source="sathi_setu",
                target="pwd_roads",
                event_type="DEPENDENCY_LOCK_ENGAGED",
                summary="Ticket RD-95718 placed on autonomous lock: WAITING for Water Board completion",
                case_number="MH-MCGM-2026-080596",
                status="success",
                payload={"external_ticket": "RD-95718", "is_blocked": True, "depends_on": "water_board"},
            ),
        ]
        for s in seeds:
            self._history.append(s)

    async def broadcast(self, message: LiveTransitMessage):
        """Broadcast an event to all connected SSE clients and record to history"""
        self._history.append(message)
        dead_subscribers = set()
        for queue in self._subscribers:
            try:
                queue.put_nowait(message)
            except asyncio.QueueFull:
                dead_subscribers.add(queue)

        for dead in dead_subscribers:
            self._subscribers.discard(dead)

    def get_recent_events(self, limit: int = 25) -> list[LiveTransitMessage]:
        """Return snapshot of recent events from history ring buffer"""
        return list(self._history)[-limit:]

    async def subscribe(self) -> AsyncGenerator[str, None]:
        """Async generator yielding SSE formatted strings for streaming responses"""
        queue: asyncio.Queue = asyncio.Queue(maxsize=100)
        self._subscribers.add(queue)

        # First yield the recent history so the client immediately displays events
        for past_msg in list(self._history)[-10:]:
            data = past_msg.model_dump_json()
            yield f"id: {past_msg.id}\nevent: message\ndata: {data}\n\n"

        try:
            while True:
                try:
                    # Wait for next event or yield keepalive heartbeat every 15s
                    msg: LiveTransitMessage = await asyncio.wait_for(queue.get(), timeout=15.0)
                    data = msg.model_dump_json()
                    yield f"id: {msg.id}\nevent: message\ndata: {data}\n\n"
                except asyncio.TimeoutError:
                    # Heartbeat comment to keep HTTP connection alive
                    yield ": heartbeat\n\n"
        except (asyncio.CancelledError, GeneratorExit):
            pass
        finally:
            self._subscribers.discard(queue)


# Global singleton instance
event_broadcaster = EventBroadcaster()
