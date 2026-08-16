"""
JANMIND NLP Module
Phase 3: Text Preprocessing for Embeddings

Preprocesses staff remarks and category text for semantic embeddings.
"""

import pandas as pd
import numpy as np
import re
from pathlib import Path
import spacy


class NLPPreprocessor:
    """NLP preprocessing for JANMIND text data"""
    
    def __init__(self):
        self.nlp = None
        self.load_spacy_model()
    
    def load_spacy_model(self):
        """Load spaCy model"""
        try:
            print("  Loading spaCy model...")
            self.nlp = spacy.load("en_core_web_sm", disable=["parser", "ner"])  # Faster loading
            print("  [OK] spaCy model loaded")
        except Exception as e:
            print(f"  [WARNING] Could not load spaCy: {e}")
            print("  [OK] Will use basic preprocessing")
            self.nlp = None
    
    def preprocess_all(self, df: pd.DataFrame) -> pd.DataFrame:
        """Preprocess all text fields"""
        print("\n" + "="*80)
        print("NLP PREPROCESSING")
        print("="*80)
        
        df_nlp = df.copy()
        
        # 1. Create combined text field
        print("\n[1/3] Creating combined text field...")
        df_nlp = self.create_combined_text(df_nlp)
        
        # 2. Clean text
        print("[2/3] Cleaning text...")
        df_nlp = self.clean_text(df_nlp)
        
        # 3. Extract keywords (optional with spaCy)
        print("[3/3] Extracting keywords...")
        df_nlp = self.extract_keywords(df_nlp)
        
        print(f"\n✓ NLP preprocessing complete!")
        
        return df_nlp
    
    def create_combined_text(self, df: pd.DataFrame) -> pd.DataFrame:
        """Combine category, subcategory, and staff remarks for embeddings"""
        # Combine multiple text fields
        df['combined_text'] = (
            df['category'].astype(str) + ' | ' +
            df['subcategory'].astype(str) + ' | ' +
            df['staff_remarks'].astype(str)
        )
        
        # Also create a simpler version (category + subcategory only)
        df['category_subcat_text'] = (
            df['category'].astype(str) + ' ' +
            df['subcategory'].astype(str)
        )
        
        print(f"  ✓ Created combined text fields")
        print(f"  ✓ Avg combined text length: {df['combined_text'].str.len().mean():.1f} chars")
        
        return df
    
    def clean_text(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean text for embeddings"""
        # Clean combined text
        df['text_cleaned'] = df['combined_text'].apply(self._clean_single_text)
        
        # Clean category_subcat text
        df['category_subcat_cleaned'] = df['category_subcat_text'].apply(self._clean_single_text)
        
        # Text length
        df['text_cleaned_length'] = df['text_cleaned'].str.len()
        
        print(f"  ✓ Cleaned text fields")
        print(f"  ✓ Avg cleaned text length: {df['text_cleaned_length'].mean():.1f} chars")
        
        return df
    
    def _clean_single_text(self, text: str) -> str:
        """Clean a single text string"""
        if pd.isna(text) or text == '':
            return ''
        
        # Convert to string
        text = str(text)
        
        # Lowercase
        text = text.lower()
        
        # Remove special characters but keep spaces and basic punctuation
        text = re.sub(r'[^a-z0-9\s\|\-]', ' ', text)
        
        # Remove multiple spaces
        text = re.sub(r'\s+', ' ', text)
        
        # Strip
        text = text.strip()
        
        return text
    
    def extract_keywords(self, df: pd.DataFrame) -> pd.DataFrame:
        """Extract keywords using spaCy (if available)"""
        if self.nlp is None:
            print(f"  ⚠ spaCy not available, skipping keyword extraction")
            df['keywords'] = ''
            return df
        
        # Sample-based keyword extraction (too expensive for 766K records)
        # For production, we'll skip this and rely on embeddings
        
        df['keywords'] = ''  # Placeholder
        
        print(f"  ✓ Keyword extraction skipped (using embeddings instead)")
        
        return df
    
    def get_text_stats(self, df: pd.DataFrame) -> dict:
        """Get text statistics"""
        return {
            "total_records": len(df),
            "avg_combined_length": df['combined_text'].str.len().mean(),
            "avg_cleaned_length": df['text_cleaned_length'].mean(),
            "records_with_text": (df['text_cleaned_length'] > 5).sum(),
            "percentage_with_text": ((df['text_cleaned_length'] > 5).sum() / len(df)) * 100
        }


def main():
    """Run NLP preprocessing"""
    print("="*80)
    print("JANMIND NLP PREPROCESSING - PHASE 3")
    print("="*80)
    
    # Load features data
    data_dir = Path(__file__).parent.parent / "data"
    df = pd.read_csv(data_dir / "processed" / "janmind_features.csv", parse_dates=['grievance_date'])
    
    print(f"\nLoaded {len(df):,} records")
    
    # Preprocess
    preprocessor = NLPPreprocessor()
    df_nlp = preprocessor.preprocess_all(df)
    
    # Save
    output_path = data_dir / "processed" / "janmind_nlp.csv"
    df_nlp.to_csv(output_path, index=False)
    
    size_mb = output_path.stat().st_size / (1024 * 1024)
    print(f"\n✓ Saved NLP dataset: {output_path.name} ({size_mb:.2f} MB)")
    
    # Stats
    stats = preprocessor.get_text_stats(df_nlp)
    
    print("\n" + "="*80)
    print("NLP PREPROCESSING SUMMARY")
    print("="*80)
    print(f"  Total Records: {stats['total_records']:,}")
    print(f"  Avg Combined Length: {stats['avg_combined_length']:.1f} chars")
    print(f"  Avg Cleaned Length: {stats['avg_cleaned_length']:.1f} chars")
    print(f"  Records with Text: {stats['records_with_text']:,} ({stats['percentage_with_text']:.1f}%)")
    print("="*80)
    
    return df_nlp


if __name__ == "__main__":
    main()
