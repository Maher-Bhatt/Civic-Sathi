"""Text embedding generation using Sentence Transformers"""

import numpy as np
from app.ml.model_registry import get_sentence_transformer
from app.core.config import settings


def embed_text(text: str) -> list[float]:
    """
    Generate embedding for text using Sentence Transformers.
    
    Args:
        text: Input text to embed
        
    Returns:
        Embedding vector as list of floats
    """
    model = get_sentence_transformer()
    
    # Generate embedding
    embedding = model.encode(text, convert_to_numpy=True)
    
    # Normalize for cosine similarity
    embedding = embedding / np.linalg.norm(embedding)
    
    return embedding.tolist()


def embed_batch(texts: list[str]) -> list[list[float]]:
    """
    Generate embeddings for multiple texts.
    
    Args:
        texts: List of input texts
        
    Returns:
        List of embedding vectors
    """
    if not texts:
        return []
    
    model = get_sentence_transformer()
    
    # Batch encoding
    embeddings = model.encode(texts, convert_to_numpy=True, show_progress_bar=False)
    
    # Normalize each embedding
    norms = np.linalg.norm(embeddings, axis=1, keepdims=True)
    embeddings = embeddings / norms
    
    return embeddings.tolist()


def get_embedding_model_name() -> str:
    """Get the current embedding model name"""
    return settings.sentence_model_name


def get_embedding_dimension() -> int:
    """Get the embedding vector dimension"""
    model = get_sentence_transformer()
    return model.get_sentence_embedding_dimension()
