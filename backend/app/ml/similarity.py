"""Similarity search using NumPy / FAISS"""

import numpy as np
from uuid import UUID
from typing import Optional
from app.core.config import settings


class SimilarityIndex:
    """Lightweight vector similarity search"""
    
    def __init__(self):
        self.vectors: Optional[np.ndarray] = None
        self.complaint_ids: list[UUID] = []
        self.dimension: Optional[int] = None
    
    def build(self, embeddings: list[list[float]], complaint_ids: list[UUID]):
        """
        Build index from embeddings.
        
        Args:
            embeddings: List of embedding vectors
            complaint_ids: Corresponding complaint IDs
        """
        if not embeddings:
            return
        
        self.vectors = np.array(embeddings, dtype='float32')
        self.dimension = self.vectors.shape[1]
        self.complaint_ids = complaint_ids
    
    def search(
        self,
        query_embedding: list[float],
        k: int = 10,
        exclude_id: UUID | None = None
    ) -> list[tuple[UUID, float]]:
        """
        Search for similar complaints using dot product on unit vectors.
        """
        if self.vectors is None or len(self.complaint_ids) == 0:
            return []
        
        query = np.array(query_embedding, dtype='float32')
        sims = np.dot(self.vectors, query)
        top_indices = np.argsort(-sims)
        
        results = []
        for idx in top_indices:
            cid = self.complaint_ids[idx]
            if exclude_id and cid == exclude_id:
                continue
            results.append((cid, float(sims[idx])))
            if len(results) >= k:
                break
        
        return results
    
    def is_empty(self) -> bool:
        """Check if index is empty"""
        return self.vectors is None or len(self.complaint_ids) == 0


# Global index instance
_global_index = SimilarityIndex()


def get_similarity_index() -> SimilarityIndex:
    """Get global similarity index"""
    return _global_index


def rebuild_similarity_index(embeddings: list[list[float]], complaint_ids: list[UUID]):
    """
    Rebuild the global similarity index.
    
    Args:
        embeddings: List of embedding vectors
        complaint_ids: Corresponding complaint IDs
    """
    _global_index.build(embeddings, complaint_ids)


def find_similar_complaints(
    query_embedding: list[float],
    k: int = 10,
    exclude_id: UUID | None = None,
    similarity_threshold: float | None = None
) -> list[tuple[UUID, float]]:
    """
    Find similar complaints using the global index.
    
    Args:
        query_embedding: Query embedding vector
        k: Number of results to return
        exclude_id: ID to exclude from results
        similarity_threshold: Minimum similarity score (optional)
        
    Returns:
        List of (complaint_id, similarity_score) tuples
    """
    results = _global_index.search(query_embedding, k, exclude_id)
    
    # Apply threshold if specified
    if similarity_threshold is not None:
        results = [(cid, score) for cid, score in results if score >= similarity_threshold]
    
    return results
