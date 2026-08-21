from datetime import datetime, timezone
from types import SimpleNamespace
from uuid import UUID, uuid4

from app.services.merge_service import _proposal_components, _proposal_key


def complaint(category: str, title: str, description: str, city_id: UUID, index: int):
    return SimpleNamespace(
        id=UUID(f"00000000-0000-0000-0000-{index:012d}"),
        category=category,
        title=title,
        description=description,
        city_id=city_id,
        created_at=datetime(2026, 8, 21, tzinfo=timezone.utc),
        lat=22.30 + index / 100000,
        lng=73.18 + index / 100000,
        ward_id=None,
        address_text="Alkapuri Ward 9",
    )


def test_proposal_key_is_order_independent():
    city_id = uuid4()
    left = UUID("00000000-0000-0000-0000-000000000001")
    right = UUID("00000000-0000-0000-0000-000000000002")
    assert _proposal_key([left, right], "street light", city_id) == _proposal_key([right, left], "street_lighting", city_id)


def test_components_group_same_area_and_category_but_keep_other_category_separate(monkeypatch):
    city_id = uuid4()
    first = complaint("street light", "Street light outage", "Dark street light near Alkapuri market", city_id, 1)
    second = complaint("street_lighting", "Street lamp not working", "Dark street light near Alkapuri market", city_id, 2)
    different_category = complaint("road_damage", "Pothole", "Pothole near Alkapuri market", city_id, 3)

    monkeypatch.setattr("app.services.merge_service.same_area", lambda left, right: left.city_id == right.city_id and right.id != different_category.id)
    monkeypatch.setattr("app.services.merge_service._text_score", lambda left, right, embedding: 0.9 if right.id != different_category.id else 0.1)

    groups, edges = _proposal_components([first, second, different_category])
    assert [[item.id for item in group] for group in groups] == [[first.id, second.id]]
    assert len(edges) == 1
