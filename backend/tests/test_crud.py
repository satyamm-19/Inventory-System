import uuid
from decimal import Decimal
import requests

BASE = "http://localhost:8000"


def unique(s):
    return f"{s}-{uuid.uuid4().hex[:8]}"


def test_product_customer_order_flow():
    # create product
    sku = unique("TESTSKU")
    product_payload = {"name": "Test Product", "sku": sku, "price": 12.5, "stock_quantity": 10}
    r = requests.post(f"{BASE}/products", json=product_payload)
    assert r.status_code == 201
    product = r.json()
    assert product["sku"] == sku
    product_id = product["id"]

    # create customer
    # make a valid unique email (username+tag@example)
    customer_email = f"test+{uuid.uuid4().hex[:8]}@example.com"
    customer_payload = {"full_name": "Test Buyer", "email": customer_email, "phone": "555-0000"}
    r = requests.post(f"{BASE}/customers", json=customer_payload)
    assert r.status_code == 201
    customer = r.json()
    customer_id = customer["id"]

    # create order with quantity 3
    order_payload = {"customer_id": customer_id, "items": [{"product_id": product_id, "quantity": 3}]}
    r = requests.post(f"{BASE}/orders", json=order_payload)
    assert r.status_code == 201
    order = r.json()
    assert order["customer_id"] == customer_id
    assert len(order["items"]) == 1

    # verify stock decreased
    r = requests.get(f"{BASE}/products/{product_id}")
    assert r.status_code == 200
    prod_after = r.json()
    assert prod_after["stock_quantity"] == 7

    # cleanup: delete order (API has delete), delete product and customer
    r = requests.delete(f"{BASE}/orders/{order['id']}")
    assert r.status_code in (204, 200)
    r = requests.delete(f"{BASE}/products/{product_id}")
    assert r.status_code in (204, 200)
    r = requests.delete(f"{BASE}/customers/{customer_id}")
    assert r.status_code in (204, 200)
