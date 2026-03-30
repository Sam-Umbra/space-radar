from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent

DATA_DIR = ROOT_DIR / "data"
MODELS_DIR = ROOT_DIR / "models"

for path in [DATA_DIR, MODELS_DIR]:
    path.mkdir(parents=True, exist_ok=True)
