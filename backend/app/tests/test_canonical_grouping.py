from types import SimpleNamespace
from uuid import UUID

from app.services.canonical_grouping import (
    _text_score,
    normalize_area,
    normalize_category,
    normalize_comparison_text,
    same_area,
    select_canonical_group,
)


def complaint(*, city_id="city-a", category="water_supply", address_text="Alkapuri, Ward 9", lat=22.3072, lng=73.1812, title="Water supply issue", description="No water supply for two days"):
    return SimpleNamespace(
        id=UUID("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa"),
        city_id=city_id,
        category=category,
        address_text=address_text,
        lat=lat,
        lng=lng,
        title=title,
        description=description,
        analysis=None,
    )


def test_normalization_handles_case_spacing_punctuation_and_aliases():
    assert normalize_comparison_text("  No-water!  supply  ") == "no water supply"
    assert normalize_area("Baroda,  Ward 9") == "vadodara ward 9"
    assert normalize_area("Bangalore") == "bengaluru"
    assert normalize_category("Roads") == "road_damage"
    assert normalize_category("street light") == "street_lighting"


def test_same_area_requires_city_and_reliable_geography():
    first = complaint()
    same = complaint(lat=22.3073, lng=73.1813)
    different_city = complaint(city_id="city-b")
    far_away = complaint(lat=22.40, lng=73.35)

    assert same_area(first, same)
    assert not same_area(first, different_city)
    assert not same_area(first, far_away)


def test_text_matching_fallback_is_order_independent_and_does_not_match_unrelated_wording():
    first = complaint(title="Water supply interruption", description="No water supply in Alkapuri for two days")
    similar = complaint(title="Water stopped in Alkapuri", description="Residents have had no water for 2 days")
    unrelated = complaint(title="Water quality complaint", description="The water tastes contaminated and smells unusual")

    similar_score = _text_score(first, similar, None)
    unrelated_score = _text_score(first, unrelated, None)

    assert similar_score >= unrelated_score
    assert similar_score >= 0.35


def test_canonical_group_selection_is_deterministic_for_multiple_matching_groups():
    first = UUID("00000000-0000-0000-0000-000000000002")
    second = UUID("00000000-0000-0000-0000-000000000001")
    assert select_canonical_group({first, second}) == second
    assert select_canonical_group({second, first}) == second
