from datetime import UTC, datetime

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def project_payload() -> dict:
    return {
        "id": "test-project",
        "name": "Test project",
        "schemaVersion": "1.0.0",
        "device": {"id": "esp32", "name": "ESP32", "width": 320, "height": 480, "target": "esp32"},
        "screens": [
            {
                "id": "home",
                "name": "Inicio",
                "background": "#000000",
                "components": [
                    {
                        "id": "button-1",
                        "type": "button",
                        "name": "power",
                        "x": 10,
                        "y": 10,
                        "width": 120,
                        "height": 50,
                        "text": "Encender",
                        "background": "#5ad7c8",
                        "color": "#000000",
                        "borderRadius": 12,
                        "fontSize": 16,
                        "action": {"type": "wyss.command", "value": "desktop.power_on"},
                    }
                ],
            }
        ],
        "activeScreenId": "home",
        "updatedAt": datetime.now(UTC).isoformat(),
    }


def test_health() -> None:
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_publish_and_get_latest_release() -> None:
    payload = project_payload()
    response = client.post("/api/projects/test-project/publish", json=payload)
    assert response.status_code == 201
    release = response.json()
    assert release["version"] >= 1
    assert len(release["checksum"]) == 64

    latest = client.get("/api/projects/test-project/releases/latest")
    assert latest.status_code == 200
    assert latest.json()["version"] == release["version"]


def test_rejects_component_outside_device_bounds() -> None:
    payload = project_payload()
    payload["screens"][0]["components"][0]["x"] = 300
    response = client.post("/api/projects/test-project/publish", json=payload)
    assert response.status_code == 422
