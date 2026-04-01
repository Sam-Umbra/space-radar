"""
Asteroid Data Simulation and Analysis Module.

This script generates synthetic asteroid data, performs exploratory data analysis (EDA),
cleans the dataset, and prepares it for machine learning workflows.
"""
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

sns.set_theme(style="whitegrid")

print("Libs loaded.")

# Create sim data

def create_sim_asteroids_data(n_samples=1000) -> pd.DataFrame:
    """
    Generate a synthetic dataset of asteroid observations with physical and orbital properties.

    The function simulates features like diameter, velocity, and miss distance, 
    applying a deterministic rule to label hazardous objects based on size and proximity.

    :param n_samples: Number of asteroid records to generate, defaults to 1000.
    :type n_samples: int
    :return: A DataFrame containing simulated asteroid data.
    :rtype: pd.DataFrame
    """
    np.random.seed(42)
    data = {
        "id": np.arange(1000000, 1000000 + n_samples),
        "name": [f"Asteroid-{i}" for i in range(n_samples)],
        "est_diameter_min": np.random.uniform(0.01, 2.5, n_samples),
        "relative_velocity": np.random.uniform(5000, 150000, n_samples),
        "miss_distance": np.random.uniform(100000, 75000000, n_samples),
        "absolute_magnitude": np.random.uniform(15, 30, n_samples),
        "orbitating_body": ["Earth"] * n_samples,
        "potentially_hazardous": np.random.choice(
            [True, False], size=n_samples, p=[0.15, 0.85]
        ),
    }

    df = pd.DataFrame(data)
    # Logic: Large asteroids (min diam > 1.5) passing within 10M km are hazardous
    df.loc[
        (df["est_diameter_min"] > 1.5) & (df["miss_distance"] < 10000000),
        "potentially_hazardous",
    ] = True
    return df


#: Generate the raw dataset for simulation
df_raw = create_sim_asteroids_data(n_samples=2000)
df_raw["est_diameter_max"] = df_raw["est_diameter_min"] * np.random.uniform(
    1.1, 1.4, len(df_raw)
)

print(f"Dataset loaded with {df_raw.shape[0]} lines & {df_raw.shape[1]} columns.")

# Data info
# Display the first few rows of the raw data
df_raw.head()
# Display structural information of the dataframe
df_raw.info()

# Visualize the distribution of the target variable (Hazardous vs Safe)
df_raw["potentially_hazardous"].value_counts(normalize=True).plot(
    kind="bar",
    title="Dangerous Objects Distribution (DOD)",
    xlabel="Is dangerous?",
    ylabel="Proprotion",
    color=["skyblue", "salmon"],
)

plt.xticks([0, 1], ["False (Safe)", "True (Dangerous)"], rotation=0)
plt.show()

print(df_raw["potentially_hazardous"].value_counts())

# Data Cleaning and Feature Engineering
print("\n")

#: Create a copy to preserve the original raw data
df_cleaned: pd.DataFrame = df_raw.copy()

# Remove non-predictive metadata columns
columns_to_drop = ["id", "name", "orbitating_body"]
df_cleaned = df_cleaned.drop(columns=columns_to_drop)

# Define columns where missing values are unacceptable
critical_columns = ["est_diameter_min", "miss_distance", "relative_velocity"]
nulls_before = df_cleaned.isnull().sum().sum()
df_cleaned = df_cleaned.dropna(subset=critical_columns)
nulls_after = df_cleaned.isnull().sum().sum()

# Feature Engineering: Calculate the average diameter
df_cleaned["est_diamater_avg"] = (
    df_cleaned["est_diameter_min"] + df_cleaned["est_diameter_max"]
) / 2

print(f"Columns Dropped: {columns_to_drop}")
print(f"Null values removed: {nulls_before - nulls_after}")
print(f"Cleaned dataset format: {df_cleaned.shape}")
df_cleaned.head()

# Correlation Analysis
df_corr = df_cleaned.copy()
df_corr["potentially_hazardous"] = df_corr["potentially_hazardous"].astype(int)

corr_matrix = df_corr.corr()

plt.figure(figsize=(10, 8))
sns.heatmap(corr_matrix, annot=True, cmap="coolwarm", fmt=".2f", vmin=-1, vmax=1)
plt.title("Features Correlation Matrix")
plt.show()

# Machine Learning Preparation
# 1. Separate features (X) and target (y)
X = df_cleaned.drop(columns=["potentially_hazardous"])
y = df_cleaned["potentially_hazardous"]

# 2. Target encoding (Boolean -> Integer)
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

# 3. Stratified split (80% training, 20% testing)
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)

print(f"Features group size (X_train): {X_train.shape}")
print(f"Target group size (y_train): {y_train.shape}")
print(f"Features examples:\n{X_train.iloc[0]}")
print(f"\nTarget example encoded: {y_train[0]} (Original: {y.iloc[0]})")
