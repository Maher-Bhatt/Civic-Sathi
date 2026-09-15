import os
import io
import base64
import logging
import pickle
import numpy as np
from PIL import Image
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import urllib.request

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('vision_ml')

CATEGORIES = [
    "road_damage",
    "water_supply",
    "garbage_collection",
    "drainage",
    "street_lighting",
    "electricity",
    "sanitation"
]

def extract_features(img: Image.Image) -> np.ndarray:
    '''Extract color histogram features from an image for a lightweight model.'''
    img = img.resize((64, 64)).convert('RGB')
    arr = np.array(img)
    hist_r, _ = np.histogram(arr[:, :, 0], bins=16, range=(0, 256))
    hist_g, _ = np.histogram(arr[:, :, 1], bins=16, range=(0, 256))
    hist_b, _ = np.histogram(arr[:, :, 2], bins=16, range=(0, 256))
    features = np.concatenate([hist_r, hist_g, hist_b]).astype(float)
    features /= (features.sum() + 1e-6)
    return features

def generate_synthetic_data(num_samples=1000):
    '''Generate synthetic feature data mimicking image histograms for demonstration.'''
    logger.info(f"Generating {num_samples} synthetic training samples...")
    X = []
    y = []
    for _ in range(num_samples):
        cat_idx = np.random.randint(len(CATEGORIES))
        category = CATEGORIES[cat_idx]
        base_features = np.random.rand(48)
        if category == 'road_damage':
            base_features[0:16] += 0.5
        elif category == 'water_supply':
            base_features[32:48] += 0.8
        elif category == 'garbage_collection':
            base_features += np.random.rand(48) * 0.5
        elif category == 'drainage':
            base_features[16:32] += 0.4
        base_features /= base_features.sum()
        X.append(base_features)
        y.append(category)
    return np.array(X), np.array(y)

def train_and_save_model(model_path="backend/app/ml/vision_model.pkl"):
    '''Professional ML training pipeline.'''
    logger.info("Starting ML Vision Model Training Pipeline...")
    X, y = generate_synthetic_data(5000)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    logger.info(f"Training on {len(X_train)} samples, validating on {len(X_test)} samples.")
    clf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    logger.info("Training Random Forest Classifier...")
    clf.fit(X_train, y_train)
    logger.info("Evaluating Model...")
    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    logger.info(f"Validation Accuracy: {acc:.4f}")
    logger.info("\n" + classification_report(y_test, y_pred))
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    with open(model_path, 'wb') as f:
        pickle.dump(clf, f)
    logger.info(f"Model successfully saved to {model_path}")

if __name__ == '__main__':
    train_and_save_model()
