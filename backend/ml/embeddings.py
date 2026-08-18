"""
Civic Sathi Embeddings Module
Phase 3: Generate Semantic Embeddings

Uses Sentence Transformers to generate semantic embeddings for similarity search.
"""

import pandas as pd
import numpy as np
from pathlib import Path
import pickle
import json
from sentence_transformers import SentenceTransformer
from tqdm import tqdm


class EmbeddingGenerator:
    """Generate semantic embeddings for Civic Sathi complaints"""
    
    def __init__(self, model_name: str = "sentence-transformers/all-MiniLM-L6-v2"):
        self.model_name = model_name
        self.model = None
        self.embedding_dim = 384  # For all-MiniLM-L6-v2
    
    def load_model(self):
        """Load Sentence Transformer model"""
        print(f"  Loading model: {self.model_name}...")
        self.model = SentenceTransformer(self.model_name)
        self.embedding_dim = self.model.get_sentence_embedding_dimension()
        print(f"  ✓ Model loaded (dimension: {self.embedding_dim})")
    
    def generate_embeddings(self, df: pd.DataFrame, text_column: str = 'text_cleaned', 
                          batch_size: int = 128, sample_size: int = None) -> np.ndarray:
        """Generate embeddings for all texts"""
        print("\n" + "="*80)
        print("GENERATING SEMANTIC EMBEDDINGS")
        print("="*80)
        
        # Load model if not loaded
        if self.model is None:
            self.load_model()
        
        # Get texts
        texts = df[text_column].fillna('').tolist()
        
        # Sample if requested (for testing)
        if sample_size is not None and sample_size < len(texts):
            print(f"\n  ⚠ Sampling {sample_size:,} records for testing")
            texts = texts[:sample_size]
        
        total_texts = len(texts)
        print(f"\n  Total texts to encode: {total_texts:,}")
        print(f"  Batch size: {batch_size}")
        print(f"  Estimated time: {(total_texts / batch_size / 60):.1f} minutes")
        
        # Generate embeddings in batches with progress bar
        print(f"\n  Generating embeddings...")
        embeddings = self.model.encode(
            texts,
            batch_size=batch_size,
            show_progress_bar=True,
            convert_to_numpy=True,
            normalize_embeddings=True  # Normalize for cosine similarity
        )
        
        print(f"\n  ✓ Generated {len(embeddings):,} embeddings")
        print(f"  ✓ Shape: {embeddings.shape}")
        print(f"  ✓ Memory: {embeddings.nbytes / (1024**2):.2f} MB")
        
        return embeddings
    
    def save_embeddings(self, embeddings: np.ndarray, output_dir: Path, 
                       filename: str = "embeddings.npy"):
        """Save embeddings to disk"""
        output_path = output_dir / filename
        
        print(f"\n  Saving embeddings to {filename}...")
        np.save(output_path, embeddings)
        
        size_mb = output_path.stat().st_size / (1024 * 1024)
        print(f"  ✓ Saved {len(embeddings):,} embeddings ({size_mb:.2f} MB)")
        
        # Save metadata
        metadata = {
            "model_name": self.model_name,
            "embedding_dim": self.embedding_dim,
            "num_embeddings": len(embeddings),
            "shape": embeddings.shape,
            "dtype": str(embeddings.dtype)
        }
        
        metadata_path = output_dir / "embeddings_metadata.json"
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=2, default=str)
        
        print(f"  ✓ Saved metadata: {metadata_path.name}")
        
        return output_path
    
    def load_embeddings(self, embeddings_path: Path) -> np.ndarray:
        """Load embeddings from disk"""
        print(f"  Loading embeddings from {embeddings_path.name}...")
        embeddings = np.load(embeddings_path)
        print(f"  ✓ Loaded {len(embeddings):,} embeddings (shape: {embeddings.shape})")
        return embeddings
    
    def compute_sample_similarities(self, embeddings: np.ndarray, n_samples: int = 5):
        """Compute sample similarities to verify embeddings"""
        print(f"\n  Computing sample similarities...")
        
        # Random samples
        indices = np.random.choice(len(embeddings), min(n_samples, len(embeddings)), replace=False)
        
        from sklearn.metrics.pairwise import cosine_similarity
        
        for idx in indices:
            vec = embeddings[idx].reshape(1, -1)
            similarities = cosine_similarity(vec, embeddings)[0]
            
            # Top 5 most similar (excluding self)
            top_indices = np.argsort(similarities)[::-1][1:6]
            top_scores = similarities[top_indices]
            
            print(f"\n    Sample {idx}:")
            print(f"      Top 5 similar: indices {top_indices.tolist()}")
            print(f"      Similarities: {top_scores.tolist()}")


def main():
    """Generate embeddings"""
    print("="*80)
    print("Civic Sathi EMBEDDING GENERATION - PHASE 3")
    print("="*80)
    
    # Load NLP data
    data_dir = Path(__file__).parent.parent / "data"
    df = pd.read_csv(data_dir / "processed" / "civicsathi_nlp.csv")
    
    print(f"\nLoaded {len(df):,} records")
    
    # Create embeddings directory
    embeddings_dir = data_dir / "embeddings"
    embeddings_dir.mkdir(exist_ok=True)
    
    # Initialize generator
    generator = EmbeddingGenerator()
    
    # IMPORTANT: For 766K records, this will take time
    # You can test with sample_size first
    USE_SAMPLE = False  # Set to False for full dataset
    sample_size = 50000 if USE_SAMPLE else None
    
    if USE_SAMPLE:
        print(f"\n⚠ WARNING: Running in SAMPLE MODE ({sample_size:,} records)")
        print(f"  Set USE_SAMPLE=False in code for full dataset")
    
    # Generate embeddings
    embeddings = generator.generate_embeddings(
        df, 
        text_column='text_cleaned',
        batch_size=256,
        sample_size=sample_size
    )
    
    # Save embeddings
    embeddings_path = generator.save_embeddings(
        embeddings, 
        embeddings_dir,
        filename="embeddings_sample.npy" if USE_SAMPLE else "embeddings_full.npy"
    )
    
    # Verify with sample similarities
    generator.compute_sample_similarities(embeddings, n_samples=3)
    
    # Save embedding IDs mapping
    if sample_size:
        df_sample = df.head(sample_size)
    else:
        df_sample = df
    
    id_mapping = df_sample[['complaint_id']].copy()
    id_mapping['embedding_index'] = range(len(id_mapping))
    
    mapping_path = embeddings_dir / ("id_mapping_sample.csv" if USE_SAMPLE else "id_mapping_full.csv")
    id_mapping.to_csv(mapping_path, index=False)
    
    print(f"\n✓ Saved ID mapping: {mapping_path.name}")
    
    print("\n" + "="*80)
    print("EMBEDDING GENERATION SUMMARY")
    print("="*80)
    print(f"  Model: {generator.model_name}")
    print(f"  Embeddings Generated: {len(embeddings):,}")
    print(f"  Embedding Dimension: {generator.embedding_dim}")
    print(f"  Mode: {'SAMPLE' if USE_SAMPLE else 'FULL'}")
    print("="*80)
    
    return embeddings


if __name__ == "__main__":
    main()
