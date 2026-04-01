import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from src.config import DATA_DIR
import numpy as np

#: Global LabelEncoder instance used for target variable transformation.
label_encoder = LabelEncoder()


def get_processed_data(filepath: Path):
    """
    Load, clean, and split the asteroid dataset for machine learning training.

    This function reads a CSV file, removes non-predictive columns, handles missing values,
    performs feature engineering for average diameter, and splits the data into
    stratified training and testing sets.

    :param filepath: The filesystem path to the source CSV dataset.
    :type filepath: pathlib.Path
    :return: A tuple containing (X_train, X_test, y_train, y_test).
    :rtype: tuple(pd.DataFrame, pd.DataFrame, pd.Series, pd.Series)
    """
    # Load dataset from CSV using the first column as index
    df = pd.read_csv(filepath, index_col=0)

    # Drop metadata columns that do not contribute to the physical hazard prediction
    df = df.drop(columns=["id", "name", "orbitating_body"], errors="ignore")
    df = df.dropna()

    # Feature engineering: Create a mean diameter feature from min and max bounds
    df["est_diameter_avg"] = (df["est_diameter_min"] + df["est_diameter_max"]) / 2

    # Separate features (X) and target variable (y)
    X = df.drop(columns=["potentially_hazardous"])
    y = df["potentially_hazardous"].astype(int)

    # Encode target labels and perform a stratified split to maintain class proportions
    y_encoded = label_encoder.fit_transform(y)
    return train_test_split(X, y, test_size=0.2, random_state=42, stratify=y_encoded)


def create_sim_asteroids_data(n_samples=1000) -> pd.DataFrame:
    """
    Generate a synthetic dataset of asteroid observations.

    Creates randomized data for physical characteristics and orbital metrics,
    applying a specific logic to flag potentially hazardous objects.

    :param n_samples: The number of asteroid records to generate, defaults to 1000.
    :type n_samples: int, optional
    :return: A DataFrame containing simulated asteroid features and hazard labels.
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
    # Deterministic logic: Large asteroids passing close to Earth are marked as hazardous
    df.loc[
        (df["est_diameter_min"] > 1.5) & (df["miss_distance"] < 10000000),
        "potentially_hazardous",
    ] = True
    return df

# Execution block: Generate and persist the initial simulated dataset
df_raw = create_sim_asteroids_data(n_samples=2000)
df_raw["est_diameter_max"] = df_raw["est_diameter_min"] * np.random.uniform(
    1.1, 1.4, len(df_raw)
)

save_path = DATA_DIR / "data.csv"
df_raw.to_csv(save_path)
print(f"Simulated data saved to {save_path}")