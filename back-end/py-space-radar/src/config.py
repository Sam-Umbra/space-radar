"""
Configuration module for the Space Radar project.

This module defines the directory structure and ensures that necessary
folders for data and model storage are present in the filesystem.
"""

from pathlib import Path

#: The absolute path to the project's root directory.
ROOT_DIR = Path(__file__).resolve().parent.parent

#: Directory path where dataset files (CSV) are stored.
DATA_DIR = ROOT_DIR / "data"

#: Directory path where serialized model and scaler files are stored.
MODELS_DIR = ROOT_DIR / "models"

def setup_directories():
    """Create the data and models directories if they do not already exist."""
    for path in [DATA_DIR, MODELS_DIR]:
        path.mkdir(parents=True, exist_ok=True)

setup_directories()
