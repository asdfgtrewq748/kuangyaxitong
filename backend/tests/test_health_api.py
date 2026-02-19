"""
Test cases for health check API endpoints

This module tests the health check endpoints to ensure:
1. Module can be imported without syntax errors
2. Health check endpoints return correct responses
3. Error handling works as expected
"""

import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import requests

from app.main import app


client = TestClient(app)


def test_health_module_importable():
    """Test that health module can be imported without errors."""
    from app.routes import health
    assert hasattr(health, 'router')
    assert health.router is not None


def test_basic_health_check():
    """Test basic health check endpoint returns ok status."""
    response = client.get("/health")
    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "ok"
    assert data["backend"] is True
    assert data["database"] is True
    assert data["data_dir_exists"] is True
    assert "operational" in data["message"].lower()


def test_api_health_check_success():
    """Test API health check endpoint when external service is available."""
    # Mock the requests.get to avoid actual HTTP call
    with patch('requests.get') as mock_get:
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.raise_for_status = MagicMock()
        mock_get.return_value = mock_response

        response = client.get("/api/health")
        assert response.status_code == 200

        data = response.json()
        assert data["status"] == "ok"
        assert data["backend"] is True
        assert data["database"] is True
        assert data["data_dir_exists"] is True


def test_api_health_check_connection_error():
    """Test API health check endpoint handles connection errors gracefully."""
    # Mock requests.get to raise connection error
    with patch('requests.get') as mock_get:
        mock_get.side_effect = requests.RequestException("Connection failed")

        response = client.get("/api/health")
        assert response.status_code == 200  # Should still return 200

        data = response.json()
        assert data["status"] == "error"
        assert data["backend"] is False
        assert data["database"] is False
        assert "Connection failed" in data["message"]


def test_api_health_check_timeout():
    """Test API health check endpoint handles timeout gracefully."""
    # Mock requests.get to raise timeout
    with patch('requests.get') as mock_get:
        mock_get.side_effect = requests.Timeout("Request timed out")

        response = client.get("/api/health")
        assert response.status_code == 200

        data = response.json()
        assert data["status"] == "error"
        assert data["backend"] is False
        assert "timeout" in data["message"].lower() or "timed out" in data["message"].lower()


def test_status_check():
    """Test status check endpoint returns ok status."""
    response = client.get("/api/status")
    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "ok"
    assert data["backend"] is True
    assert data["database"] is True
    assert data["data_dir_exists"] is True
    assert "operational" in data["message"].lower()


def test_health_response_model():
    """Test that HealthResponse model works correctly."""
    from app.routes.health import HealthResponse

    # Valid response
    response = HealthResponse(
        status="ok",
        backend=True,
        database=True,
        data_dir_exists=True,
        message="Test message"
    )
    assert response.status == "ok"
    assert response.backend is True

    # Test JSON serialization
    response_dict = response.model_dump()
    assert "status" in response_dict
    assert "backend" in response_dict
    assert "message" in response_dict
