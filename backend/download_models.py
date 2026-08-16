"""
Download required ML models before migration
Run this once before running the migration script
"""

import sys
import subprocess

def download_spacy():
    """Download spaCy English model"""
    print("="*80)
    print("DOWNLOADING SPACY MODEL")
    print("="*80)
    print("\nDownloading en_core_web_sm...")
    
    try:
        result = subprocess.run(
            [sys.executable, "-m", "spacy", "download", "en_core_web_sm"],
            capture_output=True,
            text=True,
            check=False
        )
        
        if "already satisfied" in result.stdout.lower() or result.returncode == 0:
            print("✓ spaCy model ready")
            return True
        else:
            print(f"✗ Download failed: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"✗ Error: {e}")
        return False


def verify_spacy():
    """Verify spaCy model loads"""
    print("\n" + "="*80)
    print("VERIFYING SPACY MODEL")
    print("="*80)
    
    try:
        import spacy
        nlp = spacy.load("en_core_web_sm")
        print("✓ spaCy model loads successfully")
        
        # Test it
        doc = nlp("This is a test")
        print(f"✓ spaCy model works (processed {len(doc)} tokens)")
        return True
        
    except Exception as e:
        print(f"✗ Error loading model: {e}")
        return False


def main():
    """Main function"""
    print("\n" + "="*80)
    print("ML MODELS SETUP")
    print("="*80)
    print("\nThis will download required models for text processing.")
    print("Run this ONCE before using the migration script.\n")
    
    # Download spaCy model
    spacy_ok = download_spacy()
    
    if spacy_ok:
        # Verify it works
        verify_ok = verify_spacy()
        
        if verify_ok:
            print("\n" + "="*80)
            print("✅ ALL MODELS READY")
            print("="*80)
            print("\nYou can now run the migration script:")
            print("  python quick_migrate_test.py")
            print("  OR")
            print("  python migrate_real_data.py")
            return True
    
    print("\n" + "="*80)
    print("✗ SETUP INCOMPLETE")
    print("="*80)
    print("\nPlease fix the errors above before running migration.")
    return False


if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
