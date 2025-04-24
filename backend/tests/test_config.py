import pytest
import os

from app.config.env import finder, load_dotenv_file
from app.config.settings import DatabaseConfig

from pydantic import ValidationError


@pytest.fixture
def env_file(tmp_path):
    """Fixture to create a mock dotenv file."""
    os.chdir(tmp_path)
    env_file = tmp_path / ".env.local"
    env_file.write_text("TEST_VAR=value")
    return env_file


class TestFinder:
    @staticmethod
    def test_file_exists(tmp_path, env_file):
        result = finder(".env.local", tmp_path)
        assert result == str(env_file)

    @staticmethod
    def test_fail(tmp_path):
        with pytest.raises(FileNotFoundError):
            finder(".env", tmp_path)


class TestLoadDotenvFile:
    @staticmethod
    def test_success(tmp_path, env_file, monkeypatch):
        monkeypatch.setenv("DOTENV_LOCAL_PATH", str(env_file))
        load_dotenv_file(env_file, tmp_path)
        assert os.getenv("TEST_VAR") == "value"


class TestDatabaseConfig:
    def test_valid_data(self):
        data = {
            "ID": "1",
            "PROJECT_ID": "project123",
            "API_KEY": "api_key_123",
            "PATIENT_COLLECTION_ID": "patients",
            "DOCTOR_COLLECTION_ID": "doctors",
            "APPOINTMENT_COLLECTION_ID": "appointments",
            "BUCKET_ID": "bucket_123",
            "ENDPOINT_URL": "http://example.com",
        }
        config = DatabaseConfig(**data)
        assert config.ID == data["ID"]

    def test_missing_required_fields(self):
        data = {
            "ID": "1",
            "PROJECT_ID": "project123",
            # Missing API_KEY
            "PATIENT_COLLECTION_ID": "patients",
            "DOCTOR_COLLECTION_ID": "doctors",
            "APPOINTMENT_COLLECTION_ID": "appointments",
            "BUCKET_ID": "bucket_123",
            "ENDPOINT_URL": "http://example.com",
        }
        with pytest.raises(ValidationError):
            DatabaseConfig(**data)

    def test_invalid_data_type(self):
        data = {
            "ID": "1",
            "PROJECT_ID": "project123",
            "API_KEY": "api_key_123",
            "PATIENT_COLLECTION_ID": "patients",
            "DOCTOR_COLLECTION_ID": "doctors",
            "APPOINTMENT_COLLECTION_ID": "appointments",
            "BUCKET_ID": "bucket_123",
            "ENDPOINT_URL": 12345,  # Invalid type
        }
        with pytest.raises(ValidationError):
            DatabaseConfig(**data)
