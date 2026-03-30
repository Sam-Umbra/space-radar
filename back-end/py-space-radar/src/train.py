import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns
from src.data_processor import get_processed_data
from src.config import DATA_DIR, MODELS_DIR

filepath = DATA_DIR / "data.csv"

X_train, X_test, y_train, y_test = get_processed_data(filepath)

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

model = RandomForestClassifier(
    n_estimators=100, max_depth=10, class_weight="balanced", random_state=42
)

model.fit(X_train_scaled, y_train)

y_pred = model.predict(X_test_scaled)
print("\n Classification Report")
print(classification_report(y_test, y_pred))

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

joblib.dump(model, MODELS_DIR / "radar_model.joblib")
joblib.dump(scaler, MODELS_DIR / "scaler.joblib")
print(f"\nModel saved on: {MODELS_DIR}")
