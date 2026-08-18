# Civic Sathi Phase 1: Data Audit Findings & Recommendations

**Audit Date:** August 11, 2026  
**Auditor:** Civic Sathi ML Engineering Team  
**Dataset:** Real Government Grievance Records (2020-2025)  

---

## 📊 EXECUTIVE SUMMARY

✅ **AUDIT STATUS:** **COMPLETE & SUCCESSFUL**

**Key Findings:**
- **766,648 total grievance records** across 6 years
- **100.82 MB** of real civic complaint data
- **100% schema compatibility** across all files
- **Excellent data quality** (99.98% complete)
- **Zero duplicate records**
- **Rich temporal coverage** (Feb 2020 - Jun 2025)
- **Ready for ML pipeline**

---

## 📁 DATASET INVENTORY

| File | Year | Rows | Columns | Size (MB) | Date Range |
|------|------|------|---------|-----------|------------|
| grievances_2020.csv | 2020 | 91,620 | 8 | 12.43 | Feb 8 - Dec 31, 2020 |
| grievances_2021.csv | 2021 | 103,504 | 8 | 13.66 | Jan 1 - Dec 31, 2021 |
| grievances_2022.csv | 2022 | 118,394 | 8 | 15.34 | Jan 1 - Dec 31, 2022 |
| grievances_2023.csv | 2023 | 119,140 | 8 | 15.16 | Jan 1 - Dec 31, 2023 |
| grievances_2024.csv | 2024 | 207,016 | 8 | 26.80 | Jan 1 - Dec 31, 2024 |
| grievances_2025.csv | 2025 | 126,974 | 8 | 17.43 | Jan 1 - Jun 19, 2025 |
| **TOTAL** | **6 years** | **766,648** | **8** | **100.82** | **5.4 years** |

### Growth Trend
- 2020: 91,620 complaints
- 2021: 103,504 (+13%)
- 2022: 118,394 (+14%)
- 2023: 119,140 (+0.6%)
- 2024: **207,016 (+74%!)** ⚠️ Major spike
- 2025: 126,974 (partial year)

**Observation:** 2024 saw a massive 74% increase in complaints - this is a critical systemic signal.

---

## 🗂️ DATA SCHEMA

### Complete Schema (All Files)

| Column | Data Type | Description | Civic Sathi Mapping |
|--------|-----------|-------------|-----------------|
| **Complaint ID** | int64 | Unique identifier | `id` (after validation) |
| **Category** | object (string) | Main complaint category | `category` |
| **Sub Category** | object (string) | Detailed subcategory | `subcategory` |
| **Grievance Date** | object (datetime) | Submission timestamp | `created_at` |
| **Ward Name** | object (string) | Geographic ward | `ward_name` → lookup `ward_id` |
| **Grievance Status** | object (string) | Resolution status | `status` |
| **Staff Remarks** | object (string) | Officer's notes | Use for NLP (staff-generated text) |
| **Staff Name** | object (string) | Assigned officer | `staff_name` / metadata |

### Sample Record (2025)
```json
{
  "Complaint ID": 20771690,
  "Category": "Electrical",
  "Sub Category": "Street Light Not Working",
  "Grievance Date": "2025-06-19 10:39:00.000000000",
  "Ward Name": "Jagajeevanram Nagar",
  "Grievance Status": "Registered",
  "Staff Remarks": "1st Assignment Based on Ward Mapping",
  "Staff Name": "syed zameer/JE"
}
```

---

## ✅ DATA QUALITY ASSESSMENT

### Overall Quality Score: **99.98% COMPLETE**

| Metric | Result | Status |
|--------|--------|--------|
| **Total Records** | 766,648 | ✅ |
| **Missing Values** | 182 (0.00%) | ✅ Excellent |
| **Duplicate Records** | 0 | ✅ Perfect |
| **Schema Consistency** | 100% | ✅ Perfect |
| **Date Coverage** | 5.4 years | ✅ Excellent |
| **Unique IDs** | All unique | ✅ Perfect |

### Missing Values Breakdown

| Year | Missing Field | Count | % |
|------|---------------|-------|---|
| 2020 | Grievance Status | 3 | 0.00% |
| 2021 | Grievance Status | 17 | 0.02% |
| 2022 | None | 0 | 0.00% |
| 2023 | None | 0 | 0.00% |
| 2024 | None | 0 | 0.00% |
| 2025 | Grievance Status, Staff Remarks, Staff Name | 54 | 0.04% |

**Conclusion:** Missing values are negligible and primarily in 2025 (likely pending complaints).

---

## 📈 CATEGORY DISTRIBUTION ANALYSIS

### Top 5 Categories (All Years Combined)

| Category | Total Complaints | % | Trend |
|----------|------------------|---|-------|
| **Electrical** | ~310,000 | 40% | Growing |
| **Solid Waste (Garbage) Related** | ~195,000 | 25% | Stable |
| **Road Maintenance(Engg)** | ~111,000 | 14% | Growing |
| **Health Dept** | ~30,000 | 4% | Stable |
| **Forest** | ~35,000 | 5% | Stable |
| **Others** | ~85,000 | 11% | Various |

### Category Evolution (2020 → 2025)

**Electrical:**
- 2020: 33,822
- 2024: 75,155 (+122%)
- 2025: 42,138 (6 months)
- **Status:** Major growth, likely systemic infrastructure issue

**Solid Waste:**
- 2020: 24,022
- 2024: 57,329 (+139%)
- 2025: 38,151 (6 months)
- **Status:** Significant growth in waste management complaints

**Road Maintenance:**
- 2020: 16,372
- 2024: 24,973 (+53%)
- 2025: 14,124 (6 months)
- **Status:** Consistent growth

### Status Distribution

| Status | Count (Est) | % |
|--------|-------------|---|
| **Closed** | ~700,000 | 91% |
| **Registered** | ~20,000 | 3% |
| **Non Relevant** | ~16,000 | 2% |
| **Rejected** | ~17,000 | 2% |
| **ReOpen** | ~2,700 | 0.4% |
| **In Progress** | ~1,300 | 0.2% |
| **Resolved** | ~7,000 | 0.9% |
| **Long Term Solution** | ~500 | 0.1% |

**Key Insight:** 91% closure rate is high, but "ReOpen" complaints (2,700+) are critical signals for systemic issues.

---

## 🌍 GEOGRAPHIC DISTRIBUTION

### Ward Analysis

**Total Unique Wards:** ~200+ wards identified across Bangalore

**Top Complaint Wards (Need detailed analysis):**
- Ward names vary but appear consistent
- No GPS coordinates available (limitation identified)
- Ward boundaries not in dataset (need external GeoJSON)

**Limitations:**
- ❌ No latitude/longitude coordinates
- ❌ No ward boundary polygons
- ❌ No address-level granularity
- ✅ Ward names are standardized and usable

**Recommendation:** Map ward names to ward numbers and use external Bangalore ward boundary GeoJSON for geographic visualization.

---

## 📝 TEXT FIELD ANALYSIS

### Available Text for NLP

| Field | Avg Length | Max Length | NLP Potential | Notes |
|-------|------------|------------|---------------|-------|
| **Category** | ~17 chars | 29 | ❌ Low | Structured labels |
| **Sub Category** | ~23 chars | 72 | ⚠️ Medium | Semi-structured |
| **Staff Remarks** | 12-20 chars | 18,718 | ✅ **HIGH** | **Primary NLP source** |
| **Ward Name** | ~12 chars | 31 | ❌ Low | Geographic labels |
| **Staff Name** | ~17 chars | 49 | ❌ Low | Staff metadata |

### Critical Finding: STAFF REMARKS

**IMPORTANT:** 
- ✅ Staff Remarks **EXIST** and contain meaningful text
- ✅ Average length: 12-20 characters (short but usable)
- ✅ Max length: Up to 18,718 characters (some detailed notes)
- ⚠️ These are **STAFF-GENERATED TEXT**, not citizen complaints
- ⚠️ Cannot be labeled as "citizen complaint description"

**Sample Staff Remarks:**
```
"After tender,it will be attended."
"As per citizen conformation,so this complaint has been closed"
"Problem solved"
"1st Assignment Based on Ward Mapping"
"Clear"
"Closed"
```

**NLP Strategy:**
- Use Staff Remarks for semantic similarity (officer notes patterns)
- Use Category + Sub Category for clustering
- Do NOT claim we have original citizen text
- Staff language may indicate issue severity/complexity

---

## ⚠️ CRITICAL LIMITATIONS IDENTIFIED

### 1. **NO Citizen Complaint Text**
- ❌ No original citizen descriptions
- ❌ Cannot perform citizen sentiment analysis
- ✅ Can use Staff Remarks (officer notes)

### 2. **NO GPS Coordinates**
- ❌ No lat/lng for precise mapping
- ❌ Cannot calculate geographic distance
- ✅ Can use Ward Name for area-level analysis
- ✅ Can map to ward boundaries externally

### 3. **NO Priority/Severity Labels**
- ❌ No pre-labeled severity scores
- ❌ No explicit priority field
- ✅ Can infer from Status, ReOpen, temporal patterns

### 4. **NO Resolution Quality Metrics**
- ❌ No citizen satisfaction scores
- ❌ No resolution time tracking
- ✅ Can calculate: complaint_date → close_date (if closed)

### 5. **NO Department Field**
- ❌ No explicit department assignment
- ✅ Can map Category → Department (rule-based)

---

## ✅ AVAILABLE FEATURES FOR ML

### What We CAN Build With This Data:

#### 1. **Temporal Analysis** ✅
- Complaint trends over time
- Seasonal patterns
- Spike detection
- Week/month/year aggregations
- Growth rate calculations

#### 2. **Category-Based Clustering** ✅
- Group by Category + Sub Category
- Identify recurring subcategories
- Track category volume changes

#### 3. **Geographic Analysis** ✅
- Ward-level complaint distribution
- Ward × Category patterns
- Hot-spot ward identification

#### 4. **Status-Based Intelligence** ✅
- Closure rate analysis
- "ReOpen" signal detection (critical for systemic issues)
- Status transition patterns

#### 5. **Semantic Similarity** ✅ (Limited)
- Use Staff Remarks for similarity
- Combine Category + Sub Category + Staff Remarks
- Find similar officer notes

#### 6. **Systemic Issue Detection** ✅
- High-volume Category + Ward + Time patterns
- ReOpen rate as systemic signal
- Persistent subcategory detection

#### 7. **Risk Scoring** ✅
- Frequency-based risk
- Temporal concentration risk
- Geographic concentration risk
- Category criticality risk
- ReOpen/recurrence risk

---

## 🎯 Civic Sathi FEATURE MAPPING

### Proposed Mapping: CSV → Civic Sathi Database

| CSV Field | Civic Sathi Field | Transformation |
|-----------|---------------|----------------|
| Complaint ID | `id` (UUID) | Generate UUID, store original as `original_id` |
| Category | `category` | Standardize & map to department |
| Sub Category | `subcategory` | Standardize |
| Grievance Date | `created_at` | Parse datetime |
| Ward Name | `ward_id` | Lookup ward by name |
| Grievance Status | `status` | Map to: received/in_progress/resolved/closed/rejected |
| Staff Remarks | Store in `complaint_analysis.cleaned_text` | NLP preprocessing |
| Staff Name | `metadata` | Store as JSONB |

### New Derived Features

| Feature | Calculation | Purpose |
|---------|-------------|---------|
| `priority` | Rule-based from Category + ReOpen | Risk assessment |
| `severity_score` | Based on category criticality | Triage |
| `risk_score` | Multi-factor risk model | Systemic detection |
| `is_reopen` | Grievance Status == "ReOpen" | Key systemic signal |
| `complaint_count_in_ward` | Aggregation | Geographic patterns |
| `complaint_count_in_category` | Aggregation | Frequency patterns |
| `days_to_resolution` | grievance_date → close_date | Performance metric |

---

## 📊 TEMPORAL COVERAGE ANALYSIS

### Date Range Summary

| Year | Start Date | End Date | Days Covered | Completeness |
|------|------------|----------|--------------|--------------|
| 2020 | Feb 8, 2020 | Dec 31, 2020 | 328 days | Partial (90%) |
| 2021 | Jan 1, 2021 | Dec 31, 2021 | 365 days | Complete |
| 2022 | Jan 1, 2022 | Dec 31, 2022 | 365 days | Complete |
| 2023 | Jan 1, 2023 | Dec 31, 2023 | 365 days | Complete |
| 2024 | Jan 1, 2024 | Dec 31, 2024 | 366 days | Complete |
| 2025 | Jan 1, 2025 | Jun 19, 2025 | 170 days | Partial (47%) |

**Total Coverage:** 1,959 days (~5.4 years)

**Data Quality:** Continuous, no gaps detected

---

## 🔥 CRITICAL SYSTEMIC SIGNALS (Preliminary)

### 1. **2024 Complaint Explosion**
- 74% increase from 2023 → 2024
- Likely indicates real systemic deterioration
- Requires investigation across all categories

### 2. **Electrical Infrastructure Crisis**
- 310,000+ electrical complaints (40% of all complaints)
- Growing every year
- Top subcategories need analysis

### 3. **Solid Waste Management Issues**
- 195,000+ garbage complaints (25%)
- Consistent high volume
- Major urban service gap

### 4. **ReOpen Pattern**
- 2,700+ complaints reopened after closure
- Strong indicator of incomplete resolution
- Critical for systemic issue detection

---

## 🚀 RECOMMENDED ML PIPELINE STRATEGY

### Phase 2: Data Cleaning & Merging
1. ✅ Merge all 6 files (schema compatible)
2. ✅ Standardize category/subcategory names
3. ✅ Parse dates uniformly
4. ✅ Handle 182 missing values (fill or remove)
5. ✅ Create `source_year` field
6. ✅ Generate UUIDs
7. ✅ Map ward names to ward IDs

### Phase 3: Feature Engineering
1. ✅ Temporal features (year, month, week, day)
2. ✅ Frequency features (complaints per ward/category)
3. ✅ Status-based features (is_reopen, is_closed)
4. ✅ Rolling aggregations (7-day, 30-day counts)
5. ✅ Category criticality scores

### Phase 4: NLP Pipeline
1. ⚠️ Use Staff Remarks (not citizen text)
2. ✅ Combine: Category + Sub Category + Staff Remarks
3. ✅ Clean and preprocess
4. ✅ Generate embeddings (Sentence Transformers)
5. ✅ Build FAISS similarity index

### Phase 5: Clustering & Systemic Detection
1. ✅ Cluster by: Ward + Category + Temporal + Semantic similarity
2. ✅ Identify high-volume clusters
3. ✅ Flag clusters with:
   - High frequency
   - Temporal concentration
   - Geographic concentration
   - High reopen rate
   - Persistent recurrence

### Phase 6: Risk Scoring
**6-Factor Risk Model:**
1. **Frequency Score** (0-20): Complaint volume
2. **Temporal Score** (0-15): Recent spike detection
3. **Geographic Score** (0-15): Ward concentration
4. **Category Score** (0-25): Category criticality
5. **Recurrence Score** (0-15): ReOpen rate
6. **Persistence Score** (0-10): Duration of issue

### Phase 7: Root Cause Signals
- Template-based by Category
- Evidence from: volume, geography, temporal, reopens
- Confidence scoring

### Phase 8: Recommendations
- Category-specific action templates
- Evidence-driven suggestions

---

## ⚠️ DATA LIMITATIONS & DISCLAIMERS

### What This Dataset CANNOT Do:

1. ❌ **Citizen Sentiment Analysis**
   - No original citizen text available

2. ❌ **Precise Geographic Analysis**
   - No GPS coordinates
   - Ward-level only

3. ❌ **Ground-Truth Validation**
   - No labeled "systemic issues"
   - Manual validation required

4. ❌ **Causal Inference**
   - Observational data only
   - Cannot prove root causes definitively

5. ❌ **Real-Time Prediction**
   - Historical data only
   - Can detect patterns, not predict new complaints

### What This Dataset CAN Do:

1. ✅ **Pattern Detection**
   - Identify recurring category/ward combinations
   - Detect temporal trends and spikes

2. ✅ **Risk Assessment**
   - Score issues by multiple factors
   - Flag high-risk clusters

3. ✅ **Systemic Intelligence**
   - Detect possible systemic issues
   - Provide evidence-based signals

4. ✅ **Decision Support**
   - Generate investigation recommendations
   - Prioritize high-risk areas

---

## 📋 NEXT STEPS: PHASE 2 PREPARATION

### Immediate Actions:

1. ✅ **Approve Phase 1 Findings**
   - Review this report
   - Confirm ML strategy

2. 🔄 **Create Data Cleaning Module**
   - `ml/data_loader.py`
   - `ml/preprocessing.py`
   - `ml/feature_engineering.py`

3. 🔄 **Merge 6 Datasets**
   - Create `civicsathi_grievances_master.csv`
   - Add source tracking
   - Validate row counts

4. 🔄 **EDA & Profiling**
   - Generate comprehensive charts
   - Category analysis
   - Ward analysis
   - Temporal analysis

5. 🔄 **Schema Mapping**
   - Create Civic Sathi database mappings
   - Build data transformation pipeline

---

## ✅ PHASE 1 CONCLUSION

**Status:** ✅ **AUDIT COMPLETE - READY FOR PHASE 2**

**Data Quality:** **EXCELLENT (99.98% complete)**

**Schema Compatibility:** **PERFECT (100% compatible)**

**ML Pipeline Viability:** **CONFIRMED - PROCEED**

**Confidence Level:** **HIGH**

---

**Report Generated:** August 11, 2026  
**Next Phase:** Data Cleaning & EDA  
**Estimated Timeline:** Phase 2-3: 2-3 hours | Phase 4-8: 4-6 hours

---

## 📞 Questions for Approval

Before proceeding to Phase 2, please confirm:

1. ✅ Are you satisfied with the audit findings?
2. ✅ Do you approve the ML strategy?
3. ✅ Should we proceed with merging all 6 files?
4. ✅ Do you want detailed EDA charts/visualizations?
5. ✅ Any specific categories/wards to focus on?

**Awaiting approval to proceed to Phase 2: Data Cleaning & Merge** 🚀
