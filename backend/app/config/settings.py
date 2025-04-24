# from app.config.env import load_dotenv_file
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict


# load_dotenv_file(".env.backend", "care_coordinator")


class DatabaseConfig(BaseModel):
    """A place to store the appwrite database settings."""

    ID: str
    PROJECT_ID: str
    API_KEY: str
    PATIENT_COLLECTION_ID: str
    DOCTOR_COLLECTION_ID: str
    APPOINTMENT_COLLECTION_ID: str
    BUCKET_ID: str
    ENDPOINT_URL: str


class Settings(BaseSettings):
    """A model for storing all config settings."""

    DB: DatabaseConfig

    model_config = SettingsConfigDict(
        #env_file=".env.backend",
        env_nested_delimiter="__",
    )


settings = Settings()
