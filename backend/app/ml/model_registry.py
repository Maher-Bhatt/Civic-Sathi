"""Model registry for loading ML models with lazy loading and low-memory fallbacks"""

import os

import numpy as np

from app.core.config import settings
from app.core.logging import get_logger

_spacy_model = None
_sentence_model = None
logger = get_logger(__name__)


class LightweightEmbeddingModel:
    """Deterministic, lightweight embedding model for low-memory environments (under 512MB RAM)"""
    def __init__(self, dim: int = 384):
        self.dim = dim
    
    def encode(self, texts, convert_to_numpy: bool = True, show_progress_bar: bool = False):
        single = isinstance(texts, str)
        if single:
            texts = [texts]
        
        vectors = []
        for text in texts:
            vec = np.zeros(self.dim, dtype=np.float32)
            words = (text or "").lower().split()
            for w in words:
                h = abs(hash(w)) % self.dim
                vec[h] += 1.0
            norm = np.linalg.norm(vec)
            if norm > 0:
                vec = vec / norm
            vectors.append(vec)
        
        res = np.array(vectors, dtype=np.float32)
        return res[0] if single else res

    def get_sentence_embedding_dimension(self) -> int:
        return self.dim


def get_spacy_model():
    """Lazy load and cache spaCy model or return lightweight fallback"""
    global _spacy_model
    if _spacy_model is not None:
        return _spacy_model
    
    try:
        import spacy
        try:
            _spacy_model = spacy.load("en_core_web_sm")
            return _spacy_model
        except Exception:
            _spacy_model = spacy.blank("en")
            return _spacy_model
    except Exception:
        logger.warning("spaCy is unavailable; using low-memory keyword fallback", exc_info=True)
        return None


def get_sentence_transformer():
    """Lazy load sentence transformer or return lightweight embedding model"""
    global _sentence_model
    if _sentence_model is not None:
        return _sentence_model

    offline = os.getenv("HF_HUB_OFFLINE", "").lower() in {"1", "true", "yes"}
    try:
        from sentence_transformers import SentenceTransformer
        _sentence_model = SentenceTransformer(
            settings.sentence_model_name,
            local_files_only=offline,
        )
        return _sentence_model
    except Exception:
        logger.warning(
            "SentenceTransformer is unavailable; using lightweight embeddings",
            exc_info=not offline,
        )
        _sentence_model = LightweightEmbeddingModel(dim=384)
        return _sentence_model

