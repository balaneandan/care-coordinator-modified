from unittest.mock import Mock
import pytest

from app.main import app
from app.db import connect

from fastapi.testclient import TestClient


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def mock_connect():
    return Mock(connect)
