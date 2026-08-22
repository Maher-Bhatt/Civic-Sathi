# Live Civic Map Validation — 2026-08-22

## Sources
- Public Civic Map: https://janmind-public.vercel.app/map?commit=2eda6ca
- Public home preview: https://janmind-public.vercel.app/?commit=2eda6ca
- Backend aggregate endpoint: https://civic-sathi-f7ml.onrender.com/api/v1/analytics/public-map

## Observed live results

After deployment commit `2eda6ca`, the public Civic Map loaded real backend data for both cities. Vadodara (30-day window) rendered 5,310 reports, 806 reports in the last seven days, 24 mapped localities, and 830 resolved reports. Its displayed severity distribution was Moderate 1,969, High 527, and Critical 4. Bengaluru rendered 44,098 reports, 6,302 reports in the last seven days, 32 mapped localities, and 7,303 resolved reports. Its displayed severity distribution was Low 323, Moderate 785, High 844, and Critical 548.

The map response is privacy-safe and marked `source: backend-complaints`; mapped points are capped at 2,500 for browser performance while total report counts remain authoritative for the selected time window. The public home preview now uses the shared `buildLiveMapModel` path instead of the synthetic `areaActivity` generator.

The unsupported affected-population display was removed from summary cards, area panels, area tooltips, and hotspot tooltips. The UI now labels locality figures as mapped reports and resolved reports, and discloses that locality outlines are indicative while pins represent mapped complaints.

The municipality bulk-verify test selected real Received complaints `JN-2026-112938` and `JN-2026-112934`; the live backend returned `in_review` for both and the municipality UI displayed `Under Review` after refresh. The fix is in commit `0c79551`, included in the later public-map commit deployment state.
