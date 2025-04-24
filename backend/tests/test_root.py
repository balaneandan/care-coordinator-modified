from app.main import app

from fastapi.testclient import TestClient
from fastapi.middleware.cors import CORSMiddleware


class TestApp:
    @staticmethod
    def test_routers_included(client: TestClient):
        targets = [
            "/auth",
            "/api/appointment",
            "/api/doctor",
            "/api/patient",
        ]

        results = [
            any(route.path.startswith(target) for route in client.app.routes)
            for target in targets
        ]
        assert all(results), len(results)

    @staticmethod
    def test_cors_middleware(client: TestClient):
        any(
            isinstance(middleware, CORSMiddleware)
            for middleware in client.app.user_middleware
        )

    @staticmethod
    def test_lifespan():
        assert hasattr(app, "lifespan") is not None
