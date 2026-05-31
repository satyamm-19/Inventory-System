import requests


BASE = "http://localhost:8000"


def test_health():
    r = requests.get(f"{BASE}/health")
    assert r.status_code == 200
    assert r.json().get("status") == "ok"


def test_products_list():
    r = requests.get(f"{BASE}/products")
    assert r.status_code == 200
    assert isinstance(r.json(), list)
