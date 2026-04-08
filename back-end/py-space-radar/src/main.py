"""
Main API module for the Space Radar project.

This module implements a FastAPI application that provides endpoints for
asteroid hazard prediction using a pre-trained Random Forest model.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
from src.config import MODELS_DIR

app = FastAPI(
    title="Space radar ML API",
    description="Real-Time asteroids classification API",
    version="1.0.0",
)

#: Load the serialized model and scaler from the models directory.
try:
    model = joblib.load(MODELS_DIR / "radar_model.joblib")
    scaler = joblib.load(MODELS_DIR / "scaler.joblib")
    print("Model and scaler loaded with success")
except Exception as e:
    print(f"Error upon loading models. Run train.py first. Details: {e}")


class AsteroidData(BaseModel):
    """
    Pydantic model representing the input features for an asteroid.

    :param id: Asteroid id from NASA API
    :param est_diameter_min: Minimum estimated diameter in kilometers.
    :param est_diameter_max: Maximum estimated diameter in kilometers.
    :param relative_velocity: Velocity relative to Earth in km/h.
    :param miss_distance: Distance from Earth at closest approach in kilometers.
    :param absolute_magnitude: The intrinsic luminosity of the asteroid.
    """
    id: int
    name: str
    est_diameter_min: float
    est_diameter_max: float
    relative_velocity: float
    miss_distance: float
    absolute_magnitude: float


@app.post("/predict")
async def predict_hazard(data: AsteroidData):
    """
    Predict if an asteroid is potentially hazardous based on its physical properties.

    This endpoint processes input data, performs feature engineering (average diameter),
    scales the features, and returns the model's prediction and confidence score.

    :param data: The asteroid features provided in the request body.
    :type data: AsteroidData
    :return: A dictionary containing the hazard prediction and confidence score.
    """
    try:
        input_dict = {
            "est_diameter_min": data.est_diameter_min,
            "relative_velocity": data.relative_velocity,
            "miss_distance": data.miss_distance,
            "absolute_magnitude": data.absolute_magnitude,
            "est_diameter_max": data.est_diameter_max,
            "est_diameter_avg": (data.est_diameter_min + data.est_diameter_max) / 2,
        }

        X_input = pd.DataFrame([input_dict])

        X_scaled = scaler.transform(X_input)

        prediction = model.predict(X_scaled)[0]
        probability = model.predict_proba(X_scaled)[0][1]

        return {
            "id": data.id,
            "name": data.name,
            "is_hazardous": bool(prediction),
            "confidence_score": round(float(probability), 4),
            "status": "success",
            "est_diameter_min": data.est_diameter_min,
            "relative_velocity": data.relative_velocity,
            "miss_distance": data.miss_distance,
            "absolute_magnitude": data.absolute_magnitude,
            "est_diameter_max": data.est_diameter_max,
        }
    except Exception as e:
        print(f"Processing Error: {e}")
        raise HTTPException(
            status_code=500, detail=f"Internal processing error: {str(e)}"
        )


@app.get("/health")
async def health_check():
    """
    Check the operational status of the API and the model loading state.

    :return: A dictionary indicating the online status and if the model is ready.
    :rtype: dict
    """
    return {"status": "online", "model_loaded": model is not None}
