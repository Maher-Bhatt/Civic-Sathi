"""FAISS-based similarity search"""

import numpy as np
import faiss
from uuid import UUID
from typing import Optional
from app.core.config import settings


class SimilarityIndex:
    """FAISS index for similarity search"""
    
    def __init__(self):
        self.index: Optional[faiss.Index] = None
        self.complaint_ids: list[UUID] = []
        self.dimension: Optional[int] = None
    
    def build(self, embeddings: list[list[float]], complaint_ids: list[UUID]):
        """
        Build FAISS index from embeddings.
        
        Args:
            embeddings: List of embedding vectors
            complaint_ids: Corresponding complaint IDs
        """
        if not embeddings:
            return
        
        # Convert to numpy array
        vectors = np.array(embeddings, dtype='float32')
        self.dimension = vectors.shape[1]
        self.complaint_ids = complaint_ids
        
        # Create FAISS index (using L2 distance for normalized vectors = cosine similarity)
        self.index = faiss.IndexFlatL2(self.dimension)
        self.index.add(vectors)
    
    def search(
        self,
        query_embedding: list[float],
        k: int = 10,
        exclude_id: UUID | None = None
    ) -> list[tuple[UUID, float]]:
        """
        Search for similar complaints.
        
        Args:
            query_embedding: Query embedding vector
            k: Number of results to return
            exclude_id: ID to exclude from results (e.g., the query complaint itself)
            
        Returns:
            List of (complaint_id, similarity_score) tuples
        """
        if self.index is None or self.index.ntotal == 0:
            return []
        
        # Convert to numpy array
        query = np.array([query_embedding], dtype='float32')
        
        # Search (request more if we need to exclude one)
        search_k = k + 1 if exclude_id else k
        distances, indices = self.index.search(query, min(search_k, self.index.ntotal))
        
        # Convert distances to similarity scores (for normalized vectors)
        # L2 distance for normalized vectors: d = 2(1 - cosine_similarity)
        # So: similarity = 1 - d/2
        similarities = 1 - (distances[0] / 2)
        
        # Build results
        results = []
        for idx, similarity in zip(indices[0], similarities):
            if idx < len(self.complaint_ids):
                complaint_id = self.complaint_ids[idx]
                
                # Skip excluded ID
                if exclude_id and complaint_id == exclude_id:
                    continue
                
                results.append((complaint_id, float(similarity)))
                
                if len(results) >= k:
                    break
        
        return results
    
    def is_empty(self) -> bool:
        """Check if index is empty"""
        return self.index is None or self.index.ntotal == 0


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
