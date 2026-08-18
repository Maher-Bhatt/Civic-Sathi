"""
Civic Sathi Similarity Module
Phase 3: FAISS Similarity Search

Builds FAISS index for fast similarity search.
"""

import pandas as pd
import numpy as np
from pathlib import Path
import faiss
import pickle


class SimilaritySearcher:
    """FAISS-based similarity search for Civic Sathi"""
    
    def __init__(self, embedding_dim: int = 384):
        self.embedding_dim = embedding_dim
        self.index = None
        self.id_mapping = None
    
    def build_index(self, embeddings: np.ndarray, metric: str = 'cosine'):
        """Build FAISS index"""
        print("\n" + "="*80)
        print("BUILDING FAISS INDEX")
        print("="*80)
        
        n_vectors = len(embeddings)
        
        print(f"\n  Building index for {n_vectors:,} vectors...")
        print(f"  Dimension: {self.embedding_dim}")
        print(f"  Metric: {metric}")
        
        # For cosine similarity, normalize embeddings first
        if metric == 'cosine':
            # Embeddings should already be normalized
            faiss.normalize_L2(embeddings)
            self.index = faiss.IndexFlatIP(self.embedding_dim)  # Inner product for cosine
        else:
            self.index = faiss.IndexFlatL2(self.embedding_dim)  # L2 distance
        
        # Add vectors to index
        self.index.add(embeddings)
        
        print(f"  ✓ Index built with {self.index.ntotal:,} vectors")
        
        return self.index
    
    def search_similar(self, query_embedding: np.ndarray, k: int = 10, 
                      threshold: float = 0.70) -> tuple:
        """Search for similar vectors"""
        if self.index is None:
            raise ValueError("Index not built yet!")
        
        # Normalize query
        query_embedding = query_embedding.reshape(1, -1).astype('float32')
        faiss.normalize_L2(query_embedding)
        
        # Search
        distances, indices = self.index.search(query_embedding, k)
        
        # Filter by threshold (cosine similarity threshold)
        mask = distances[0] >= threshold
        filtered_distances = distances[0][mask]
        filtered_indices = indices[0][mask]
        
        return filtered_indices, filtered_distances
    
    def save_index(self, output_dir: Path, filename: str = "faiss_index.bin"):
        """Save FAISS index"""
        if self.index is None:
            raise ValueError("No index to save!")
        
        output_path = output_dir / filename
        
        print(f"\n  Saving FAISS index to {filename}...")
        faiss.write_index(self.index, str(output_path))
        
        size_mb = output_path.stat().st_size / (1024 * 1024)
        print(f"  ✓ Saved index ({size_mb:.2f} MB)")
        
        return output_path
    
    def load_index(self, index_path: Path):
        """Load FAISS index"""
        print(f"  Loading FAISS index from {index_path.name}...")
        self.index = faiss.read_index(str(index_path))
        print(f"  ✓ Loaded index with {self.index.ntotal:,} vectors")
        return self.index
    
    def find_similar_complaints(self, df: pd.DataFrame, embeddings: np.ndarray,
                               sample_indices: list = None, k: int = 10,
                               threshold: float = 0.70) -> pd.DataFrame:
        """Find similar complaints for samples"""
        if sample_indices is None:
            # Random samples
            sample_indices = np.random.choice(len(df), min(10, len(df)), replace=False)
        
        results = []
        
        print(f"\n  Finding similar complaints for {len(sample_indices)} samples...")
        
        for idx in sample_indices:
            query_emb = embeddings[idx]
            similar_indices, similarities = self.search_similar(query_emb, k=k, threshold=threshold)
            
            if len(similar_indices) > 1:  # Exclude self
                for sim_idx, sim_score in zip(similar_indices[1:], similarities[1:]):
                    results.append({
                        'query_id': df.iloc[idx]['complaint_id'],
                        'query_category': df.iloc[idx]['category'],
                        'query_subcategory': df.iloc[idx]['subcategory'],
                        'query_text': df.iloc[idx]['text_cleaned'][:100],
                        'similar_id': df.iloc[sim_idx]['complaint_id'],
                        'similar_category': df.iloc[sim_idx]['category'],
                        'similar_subcategory': df.iloc[sim_idx]['subcategory'],
                        'similar_text': df.iloc[sim_idx]['text_cleaned'][:100],
                        'similarity_score': float(sim_score)
                    })
        
        results_df = pd.DataFrame(results)
        print(f"  ✓ Found {len(results_df)} similar pairs")
        
        return results_df


def main():
    """Build FAISS index"""
    print("="*80)
    print("Civic Sathi SIMILARITY SEARCH - PHASE 3")
    print("="*80)
    
    # Load embeddings
    data_dir = Path(__file__).parent.parent / "data"
    embeddings_dir = data_dir / "embeddings"
    
    print("\n  Loading embeddings...")
    embeddings = np.load(embeddings_dir / "embeddings_sample.npy")
    print(f"  ✓ Loaded {len(embeddings):,} embeddings")
    
    # Build index
    searcher = SimilaritySearcher(embedding_dim=embeddings.shape[1])
    searcher.build_index(embeddings, metric='cosine')
    
    # Save index
    searcher.save_index(embeddings_dir, "faiss_index_sample.bin")
    
    # Load NLP data for similarity demo
    df = pd.read_csv(data_dir / "processed" / "civicsathi_nlp.csv", nrows=50000)
    
    # Find similar complaints
    similar_df = searcher.find_similar_complaints(
        df,
        embeddings,
        sample_indices=[0, 100, 1000, 5000, 10000],
        k=10,
        threshold=0.70
    )
    
    # Save results
    output_path = embeddings_dir / "similarity_results_sample.csv"
    similar_df.to_csv(output_path, index=False)
    print(f"\n✓ Saved similarity results: {output_path.name}")
    
    # Print sample
    print("\n" + "="*80)
    print("SAMPLE SIMILAR COMPLAINTS")
    print("="*80)
    if len(similar_df) > 0:
        sample = similar_df.head(5)
        for _, row in sample.iterrows():
            print(f"\nQuery: {row['query_category']} - {row['query_subcategory']}")
            print(f"  → Similar: {row['similar_category']} - {row['similar_subcategory']}")
            print(f"  → Similarity: {row['similarity_score']:.3f}")
    
    print("="*80)
    
    return searcher


if __name__ == "__main__":
    main()
