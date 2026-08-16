"""Model registry for loading ML models with lazy loading and low-memory fallbacks"""

from functools import lru_cache
import sys
import numpy as np

from app.core.config import settings

_spacy_model = None
_sentence_model = None


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
    except Exception as e:
        print(f"spaCy not available (running in low-memory mode): {e}")
        return None


def get_sentence_transformer():
    """Lazy load sentence transformer or return lightweight embedding model"""
    global _sentence_model
    if _sentence_model is not None:
        return _sentence_model
    
    try:
        from sentence_transformers import SentenceTransformer
        _sentence_model = SentenceTransformer(settings.sentence_model_name)
        return _sentence_model
    except Exception as e:
        print(f"SentenceTransformer not loaded (running in low-memory mode): {e}")
        _sentence_model = LightweightEmbeddingModel(dim=384)
        return _sentence_model

