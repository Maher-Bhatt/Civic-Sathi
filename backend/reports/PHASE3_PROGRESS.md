# JANMIND Phase 3: ML Pipeline - IN PROGRESS

**Date:** August 11, 2026  
**Status:** 🔄 **Phase 3 In Progress - Core Modules Created**

---

## ✅ COMPLETED SO FAR

### 1. Feature Engineering ✅
**Module:** `ml/feature_engineering.py`

**Created Features (15 new features):**
- **Frequency Features (5):**
  - `category_frequency` - Total complaints per category
  - `subcategory_frequency` - Total complaints per subcategory
  - `ward_frequency` - Total complaints per ward
  - `category_ward_frequency` - Category × Ward combinations
  - `category_subcat_frequency` - Category × Subcategory combinations

- **Rolling Window Features (3):**
  - `complaints_same_day` - Daily complaint volume
  - `complaints_same_week` - Weekly complaint volume
  - `complaints_same_month` - Monthly complaint volume

- **Category Criticality Scores (2):**
  - `category_criticality` - Domain-based criticality (0-25)
  - `category_criticality_normalized` - Normalized to 0-1

- **Ward Concentration Metrics (2):**
  - `ward_frequency_normalized` - Ward frequency 0-1
  - `ward_rank` - Ward ranking by complaint volume

- **Recurrence Features (3):**
  - `category_reopen_rate` - Reopen rate per category
  - `ward_reopen_rate` - Reopen rate per ward
  - `category_closure_rate` - Closure rate per category

**Output:**
- `data/processed/janmind_features.csv` (323.82 MB, 45 columns)
- Added 16 new feature columns

---

### 2. NLP Preprocessing ✅
**Module:** `ml/nlp.py`

**Text Processing:**
- **Combined Text Creation:**
  - `combined_text` = Category + Subcategory + Staff Remarks
  - `category_subcat_text` = Category + Subcategory only

- **Text Cleaning:**
  - Lowercase conversion
  - Special character removal
  - Whitespace normalization
  - `text_cleaned` - Main field for embeddings
  - `category_subcat_cleaned` - Alternative field

- **Text Metrics:**
  - `text_cleaned_length` - Character count
  - Average text length: 60.7 characters
  - 100% of records have usable text

**Output:**
- `data/processed/janmind_nlp.csv` (475.07 MB, 51 columns)
- Ready for embedding generation

**Note:** spaCy keyword extraction skipped (using embeddings instead)

---

### 3. Embedding Generation 🔄
**Module:** `ml/embeddings.py`

**Configuration:**
- **Model:** `sentence-transformers/all-MiniLM-L6-v2`
- **Embedding Dimension:** 384
- **Batch Size:** 256
- **Mode:** Sample mode (50,000 records for testing)

**Status:** Currently generating embeddings...
- Progress: ~180/196 batches completed (92%)
- Estimated completion: ~2-3 minutes remaining
- Will generate full dataset (766K records) after successful test

**What Embeddings Do:**
- Convert text into 384-dimensional semantic vectors
- Enable similarity comparison using cosine distance
- Foundation for clustering and systemic detection

---

### 4. Similarity Search ✅
**Module:** `ml/similarity.py` 

**FAISS Implementation:**
- Fast similarity search using FAISS library
- Cosine similarity metric
- Configurable similarity threshold (default: 0.70)
- K-nearest neighbors search

**Capabilities:**
- Index building for fast search
- Query similar complaints
- Threshold-based filtering
- Batch similarity computation

**Awaiting:** Embeddings completion to build index

---

## 📋 MODULES CREATED

| Module | Status | Purpose |
|--------|--------|---------|
| `ml/__init__.py` | ✅ | Package initialization |
| `ml/data_audit.py` | ✅ | Data quality audit |
| `ml/data_loader.py` | ✅ | CSV loading & merging |
| `ml/preprocessing.py` | ✅ | Data cleaning |
| `ml/eda.py` | ✅ | Exploratory analysis |
| `ml/feature_engineering.py` | ✅ | ML feature creation |
| `ml/nlp.py` | ✅ | Text preprocessing |
| `ml/embeddings.py` | 🔄 | Semantic embeddings (in progress) |
| `ml/similarity.py` | ✅ | FAISS similarity search |
| `ml/clustering.py` | ⏳ | Issue clustering (next) |
| `ml/temporal_analysis.py` | ⏳ | Spike & trend detection (next) |
| `ml/risk.py` | ⏳ | Risk scoring (next) |
| `ml/systemic_issue.py` | ⏳ | Systemic detection (next) |
| `ml/root_cause.py` | ⏳ | Root cause signals (next) |
| `ml/recommendations.py` | ⏳ | Action recommendations (next) |
| `ml/evaluation.py` | ⏳ | Validation (next) |
| `ml/pipeline.py` | ⏳ | End-to-end pipeline (next) |

---

## 📊 DATA PROGRESSION

### Phase 1: Audit
- **Input:** 6 CSV files (2020-2025)
- **Output:** Audit reports

### Phase 2: Cleaning & EDA  
- **Input:** 766,648 raw records
- **Output:** `janmind_cleaned.csv` (29 columns)

### Phase 3A: Feature Engineering
- **Input:** Cleaned dataset
- **Output:** `janmind_features.csv` (45 columns, +16 features)

### Phase 3B: NLP Processing
- **Input:** Feature dataset
- **Output:** `janmind_nlp.csv` (51 columns, +6 text fields)

### Phase 3C: Embeddings (In Progress)
- **Input:** NLP dataset
- **Output:** 
  - `embeddings/embeddings_sample.npy` (50K × 384) 🔄
  - `embeddings/embeddings_full.npy` (766K × 384) ⏳
  - `embeddings/id_mapping.csv` ⏳

### Phase 3D: Similarity (Next)
- **Input:** Embeddings
- **Output:**
  - `embeddings/faiss_index.bin` ⏳
  - `embeddings/similarity_results.csv` ⏳

---

## 🎯 REMAINING PHASE 3 TASKS

### High Priority (Core ML)

1. **Complete Embeddings** 🔄
   - Finish sample embeddings (92% done)
   - Run full dataset embeddings (766K records)
   - Estimated time: 10-15 minutes for full dataset

2. **Build FAISS Index** ⏳
   - Create similarity search index
   - Test similarity queries
   - Validate results
   - Estimated time: 5 minutes

3. **Clustering Algorithm** ⏳
   - Implement density-based clustering
   - Group by: Category + Ward + Temporal + Semantic similarity
   - Detect systemic issue clusters
   - Estimated time: 30-40 minutes

4. **Temporal Analysis** ⏳
   - Spike detection algorithm
   - Persistence tracking
   - Growth rate calculation
   - Recurrence after closure
   - Estimated time: 30 minutes

5. **Risk Scoring Engine** ⏳
   - 6-factor risk model:
     1. Frequency Score (0-20)
     2. Temporal Score (0-15)
     3. Geographic Score (0-15)
     4. Category Score (0-25)
     5. Recurrence Score (0-15)
     6. Persistence Score (0-10)
   - Total: 0-100 risk score
   - Estimated time: 20 minutes

### Medium Priority (Intelligence Layer)

6. **Systemic Issue Detection** ⏳
   - Multi-signal algorithm
   - Cluster scoring
   - Issue classification (High/Medium/Low)
   - Evidence collection
   - Estimated time: 40 minutes

7. **Root Cause Signals** ⏳
   - Template-based analysis by category
   - Confidence scoring
   - Evidence gathering
   - Estimated time: 30 minutes

8. **Recommendation Engine** ⏳
   - Category-specific templates
   - Priority calculation
   - Resource estimation
   - Timeline suggestions
   - Estimated time: 30 minutes

### Low Priority (Validation)

9. **Evaluation & Validation** ⏳
   - Manual sample inspection
   - Clustering quality metrics
   - Similarity validation
   - Systemic issue validation
   - Estimated time: 45 minutes

10. **End-to-End Pipeline** ⏳
    - Integrate all modules
    - Create unified pipeline
    - Add logging & monitoring
    - Performance optimization
    - Estimated time: 30 minutes

---

## ⏱️ TIME ESTIMATES

| Task | Estimated Time |
|------|---------------|
| Complete Embeddings | 15 min |
| FAISS Index | 5 min |
| Clustering | 40 min |
| Temporal Analysis | 30 min |
| Risk Scoring | 20 min |
| Systemic Detection | 40 min |
| Root Cause | 30 min |
| Recommendations | 30 min |
| Evaluation | 45 min |
| Pipeline Integration | 30 min |
| **Total Remaining** | **~4-5 hours** |

---

## 🎓 TECHNICAL APPROACH

### Embeddings Strategy
- **Why sentence-transformers?**
  - State-of-the-art semantic understanding
  - Pre-trained on diverse text
  - Fast inference
  - Produces normalized vectors for cosine similarity

- **Why all-MiniLM-L6-v2?**
  - Balanced performance vs. speed
  - 384 dimensions (manageable size)
  - Good for short texts
  - Well-suited for complaint/category text

### Similarity Strategy
- **Why FAISS?**
  - Extremely fast similarity search
  - Scales to millions of vectors
  - Supports multiple metrics
  - Industry standard

- **Why cosine similarity?**
  - Scale-invariant
  - Works well with normalized embeddings
  - Interpretable (0-1 range)

### Clustering Strategy (Planned)
- **Multi-dimensional clustering:**
  - Semantic similarity (embeddings)
  - Category grouping
  - Ward grouping
  - Temporal proximity

- **Why density-based?**
  - No need to specify K
  - Finds natural clusters
  - Handles noise
  - Variable cluster sizes

### Risk Scoring Strategy (Planned)
- **6-Factor Model:**
  1. **Frequency** - High volume = higher risk
  2. **Temporal** - Recent spike = higher risk
  3. **Geographic** - Concentration = higher risk
  4. **Category** - Critical services = higher risk
  5. **Recurrence** - Reopens = systemic issue
  6. **Persistence** - Long duration = deeper problem

---

## 🔍 PRELIMINARY INSIGHTS

### Feature Engineering Insights
- **Most frequent category:** Electrical (310K complaints)
- **Highest reopen rate:** (To be analyzed after clustering)
- **Ward concentration:** Jnanabharathi Ward (18K complaints)
- **Category criticality:** Water Crisis (25), Health (22), Sanitation (21)

### NLP Insights
- **Average text length:** 60.7 characters (short but usable)
- **100% text coverage:** All records have processable text
- **Text composition:** Category + Subcategory + Staff Remarks
- **Language:** English (mixed with some local terms - acceptable)

---

## ⚠️ KNOWN LIMITATIONS

### Current Limitations
1. **spaCy Model Loading Issue:**
   - Solution: Using basic preprocessing (sufficient for embeddings)
   
2. **Sample Mode for Embeddings:**
   - Currently testing with 50K records
   - Will scale to full 766K after validation

3. **No Citizen Text:**
   - Using staff remarks + category/subcategory
   - Still semantically meaningful
   - Sufficient for similarity detection

### Not Limitations (Confirmed Strengths)
✅ Data quality excellent (99.98% complete)
✅ Schema fully compatible
✅ Text fields available and usable
✅ Temporal coverage complete
✅ Feature engineering successful

---

## 📁 Generated Files So Far

```
data/
├── raw/
│   ├── grievances_2020.csv
│   ├── grievances_2021.csv
│   ├── grievances_2022.csv
│   ├── grievances_2023.csv
│   ├── grievances_2024.csv
│   └── grievances_2025.csv
├── processed/
│   ├── janmind_master.csv (119 MB)
│   ├── janmind_cleaned.csv (214 MB)
│   ├── janmind_features.csv (323 MB)
│   └── janmind_nlp.csv (475 MB)
└── embeddings/
    ├── embeddings_sample.npy (in progress) 🔄
    ├── embeddings_metadata.json (pending) ⏳
    └── id_mapping_sample.csv (pending) ⏳

reports/
├── data_audit_report.json
├── eda_report.json
├── PHASE1_DATA_AUDIT_FINDINGS.md
├── PHASE2_COMPLETE.md
└── PHASE3_PROGRESS.md (this file)

ml/
├── __init__.py
├── data_audit.py
├── data_loader.py
├── preprocessing.py
├── eda.py
├── feature_engineering.py
├── nlp.py
├── embeddings.py (running) 🔄
└── similarity.py
```

---

## 🚀 NEXT IMMEDIATE STEPS

1. **Monitor embedding generation** (should complete in ~2-3 min)
2. **Validate sample embeddings** work correctly
3. **Run full 766K embedding generation** (~15 min)
4. **Build FAISS index** (~5 min)
5. **Test similarity search** on samples
6. **Proceed to clustering** algorithm

---

## ✅ SUCCESS CRITERIA for Phase 3

- [x] Feature engineering complete (15 features added)
- [x] NLP preprocessing complete (text cleaned & combined)
- [🔄] Embeddings generated (sample in progress)
- [ ] FAISS index built
- [ ] Similarity search validated
- [ ] Clustering algorithm implemented
- [ ] Temporal analysis complete
- [ ] Risk scoring system complete
- [ ] Systemic detection algorithm complete
- [ ] Root cause inference complete
- [ ] Recommendation engine complete
- [ ] Evaluation & validation complete

**Progress:** 3/12 major components complete (25%)

---

## 📊 Current Resource Usage

- **Disk Space:** ~1.2 GB (raw + processed data)
- **Memory:** ~2-3 GB during embedding generation
- **Compute:** CPU-based (Sentence Transformers + FAISS)
- **Time Invested:** ~2 hours (Phases 1-2), ~1 hour (Phase 3 so far)

---

**Status:** Phase 3 core infrastructure complete. Awaiting embedding completion to proceed with clustering and systemic detection algorithms.

**Next Update:** After embedding generation completes or Phase 3 fully complete.

---

**Report Generated:** August 11, 2026  
**Estimated Phase 3 Completion:** 4-5 hours remaining
