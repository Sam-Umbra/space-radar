import pandas as pd
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# from src.config import DATA_DIR
import numpy as np

label_encoder = LabelEncoder()


def get_processed_data(filepath: Path):
    df = pd.read_csv(filepath)

    df = df.drop(columns=["id", "name", "orbitating_body"], errors="ignore")
    df = df.dropna()

    df["est_diameter_avg"] = (df["est_diameter_min"] + df["est_diameter_max"]) / 2

    X = df.drop(columns=["potentially_hazardous"])
    y = df["potentially_hazardous"].astype(int)

    y_encoded = label_encoder.fit_transform(y)

    return train_test_split(X, y, test_size=0.2, random_state=42, stratify=y_encoded)


def create_sim_asteroids_data(n_samples=1000) -> pd.DataFrame:
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
    df.loc[
        (df["est_diameter_min"] > 1.5) & (df["miss_distance"] < 10000000),
        "potentially_hazardous",
    ] = True
    return df


""" df_raw = create_sim_asteroids_data(n_samples=2000)
df_raw["est_diameter_max"] = df_raw["est_diameter_min"] * np.random.uniform(
    1.1, 1.4, len(df_raw)
)

save_path = DATA_DIR / 'data.csv'

df_raw.to_csv(save_path) """
