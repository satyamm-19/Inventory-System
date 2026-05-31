"""Seed script to create sample products and customers.
Run inside the backend environment: `python seed.py` or via Docker.
"""
from decimal import Decimal

from app.core.database import SessionLocal
from app.models import Product, Customer


def seed():
    db = SessionLocal()
    try:
        # sample products
        products = [
            Product(name='Widget A', sku='WIDGET-A', price=Decimal('9.99'), stock_quantity=100),
            Product(name='Widget B', sku='WIDGET-B', price=Decimal('19.50'), stock_quantity=50),
            Product(name='Gadget', sku='GADGET-1', price=Decimal('5.25'), stock_quantity=200),
        ]
        for p in products:
            existing = db.query(Product).filter(Product.sku == p.sku).first()
            if not existing:
                db.add(p)

        # sample customers
        customers = [
            Customer(full_name='Acme Corp', email='sales@acme.example', phone='555-0100'),
            Customer(full_name='Jane Doe', email='jane.doe@example.com', phone='555-0101'),
        ]
        for c in customers:
            existing = db.query(Customer).filter(Customer.email == c.email).first()
            if not existing:
                db.add(c)

        db.commit()
        print('Seed data inserted')
    finally:
        db.close()


if __name__ == '__main__':
    seed()
