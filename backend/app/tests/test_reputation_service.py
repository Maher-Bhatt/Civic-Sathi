"""Deterministic tests for the server-authoritative civic reputation rules."""

from app.services.reputation_service import DEFAULT_RULES, level_for_xp


def test_level_thresholds_are_monotonic():
    assert level_for_xp(0) == (1, 0, "Civic Observer", 100)
    assert level_for_xp(100)[0] == 2
    assert level_for_xp(999)[0] == 4
    assert level_for_xp(1000)[0] == 5
    assert level_for_xp(12000)[0] == 10


def test_default_reward_rules_keep_daily_cap_conservative():
    assert DEFAULT_RULES["daily_positive_xp_cap"] == 60
    assert DEFAULT_RULES["xp"]["report_submitted"] == 5
    assert DEFAULT_RULES["impact"]["resolution_confirmed"] == 8
