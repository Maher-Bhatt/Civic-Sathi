"""Model registry for loading ML models"""

import spacy
from sentence_transformers import SentenceTransformer
from functools import lru_cache
import sys

from app.core.config import settings


# Global variable to cache spaCy model (more reliable than lru_cache for this case)
_spacy_model = None


def get_spacy_model():
    """Load and cache spaCy model"""
    global _spacy_model
    
    # Return cached model if available
    if _spacy_model is not None:
        return _spacy_model
    
    # Try to load the model
    try:
        _spacy_model = spacy.load("en_core_web_sm")
        return _spacy_model
    except OSError:
        # Model not installed, try to download (ONE TIME ONLY)
        print("⚠ spaCy model not found. Downloading en_core_web_sm (one-time setup)...")
        print("This may take a minute...")
        
        try:
            import subprocess
            result = subprocess.run(
                [sys.executable, "-m", "spacy", "download", "en_core_web_sm"],
                capture_output=True,
                text=True,
                timeout=60
            )
            
            if result.returncode == 0 or "already satisfied" in result.stdout.lower():
                # Try loading again
                try:
                    _spacy_model = spacy.load("en_core_web_sm")
                    print("✓ spaCy model loaded successfully")
                    return _spacy_model
                except OSError:
                    pass
        except Exception as e:
            print(f"✗ Error downloading model: {e}")
        
        # Fallback: use blank English model (no NER, but won't crash)
        print("⚠ Using fallback blank spaCy model (limited functionality)")
        _spacy_model = spacy.blank("en")
        return _spacy_model


@lru_cache(maxsize=1)
def get_sentence_transformer():
    """Load and cache sentence transformer model"""
    return SentenceTransformer(settings.sentence_model_name)
