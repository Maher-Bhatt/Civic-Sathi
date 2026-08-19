from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class ReputationBadgeOut(BaseModel):
    code: str
    name: str
    description: str
    awarded_at: datetime | None = None
    revoked_at: datetime | None = None


class ReputationTransactionOut(BaseModel):
    id: str
    amount: int
    action: str
    reason: str
    source_type: str
    source_id: str | None = None
    status: str
    verification_status: str
    at: datetime


class ImpactEventOut(BaseModel):
    id: str
    event_type: str
    impact_points: int
    source_type: str
    source_id: str | None = None
    verification_status: str
    at: datetime


class MissionOut(BaseModel):
    code: str
    title: str
    description: str
    category: str | None = None
    progress: int = 0
    target: int = 1
    xp_reward: int = 0
    completed: bool = False
    city_name: str | None = None
    ends_at: datetime | None = None


class CivicProfileSummaryOut(BaseModel):
    user_id: str
    role: str
    xp_total: int
    impact_score: int
    reputation_score: int
    level: int
    level_name: str
    current_level_xp: int
    next_level_xp: int
    level_progress_pct: int
    streak_days: int
    display_mode: str
    leaderboard_opt_in: bool
    sharing_opt_in: bool
    animation_enabled: bool
    reward_notifications_enabled: bool
    verified_contributions: int = 0
    resolutions_supported: int = 0


class CityImpactOut(BaseModel):
    city_name: str
    contributing_citizens: int = 0
    reports: int = 0
    verified_reports: int = 0
    resolved_reports: int = 0
    impact_points: int = 0
    milestone: str | None = None


class ReputationMeOut(BaseModel):
    profile: CivicProfileSummaryOut
    badges: list[ReputationBadgeOut] = Field(default_factory=list)
    missions: list[MissionOut] = Field(default_factory=list)
    transactions: list[ReputationTransactionOut] = Field(default_factory=list)
    impact_events: list[ImpactEventOut] = Field(default_factory=list)
    city_impact: list[CityImpactOut] = Field(default_factory=list)


class ReputationPreferencesPatch(BaseModel):
    display_mode: str | None = Field(default=None, pattern="^(initials|first_name|alias)$")
    leaderboard_opt_in: bool | None = None
    sharing_opt_in: bool | None = None
    animation_enabled: bool | None = None
    reward_notifications_enabled: bool | None = None


class ResolutionConfirmationOut(BaseModel):
    success: bool
    xp_awarded: int
    impact_awarded: int
    message: str
    profile: CivicProfileSummaryOut


class CityReputationOut(BaseModel):
    city: CityImpactOut
    top_contributors: list[dict[str, Any]] = Field(default_factory=list)


class RolePerformanceOut(BaseModel):
    role: str
    subject_name: str
    score: int
    metrics: dict[str, Any] = Field(default_factory=dict)
    achievements: list[ReputationBadgeOut] = Field(default_factory=list)
