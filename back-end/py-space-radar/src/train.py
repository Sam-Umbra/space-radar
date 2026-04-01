"""
Model Training Module for Space Radar.

This script handles the end-to-end machine learning pipeline: loading processed data,
feature scaling, training a Random Forest classifier, evaluating performance,
and persisting the model artifacts.
"""
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns
from src.data_processor import get_processed_data
from src.config import DATA_DIR, MODELS_DIR

#: Path to the source dataset CSV file.
filepath = DATA_DIR / "data.csv"

# Load and split the dataset into training and testing sets.
X_train, X_test, y_train, y_test = get_processed_data(filepath)

#: Initialize and fit the standard scaler to normalize feature distributions.
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

#: Initialize the Random Forest Classifier with balanced class weights to handle potential skew.
model = RandomForestClassifier(
    n_estimators=100, max_depth=10, class_weight="balanced", random_state=42
)

# Train the model using the scaled training features.
model.fit(X_train_scaled, y_train)

# Generate predictions for evaluation.
y_pred = model.predict(X_test_scaled)
print("\n Classification Report")
print(classification_report(y_test, y_pred))

# Generate and visualize the confusion matrix.
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(8, 6))
sns.heatmap(
    cm,
    annot=True,
    fmt="d",
    cmap="Blues",
    xticklabels=["Safe", "Dangerous"],
    yticklabels=["Safe", "Dangerous"],
)
plt.xlabel("Model prediction")
plt.ylabel("Reality (NASA)")
plt.title("Confusion Matrix: Space Radar")
plt.show()

# Persist the trained model and the scaler for use in the API.
joblib.dump(model, MODELS_DIR / "radar_model.joblib")
joblib.dump(scaler, MODELS_DIR / "scaler.joblib")
print(f"\nModel saved on: {MODELS_DIR}")