from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models import Customer, Order, OrderItem, Product
from app.schemas import CustomerCreate, OrderCreate, ProductCreate, ProductUpdate


def list_products(db: Session) -> list[Product]:
    return db.query(Product).order_by(Product.id.desc()).all()


def get_product_or_404(db: Session, product_id: int) -> Product:
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


def create_product(db: Session, payload: ProductCreate) -> Product:
    existing = db.query(Product).filter(Product.sku == payload.sku).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="SKU already exists")

    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def update_product(db: Session, product_id: int, payload: ProductUpdate) -> Product:
    product = get_product_or_404(db, product_id)

    if payload.sku and payload.sku != product.sku:
        duplicate = db.query(Product).filter(Product.sku == payload.sku).first()
        if duplicate:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="SKU already exists")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


def delete_product(db: Session, product_id: int) -> None:
    product = get_product_or_404(db, product_id)
    db.delete(product)
    db.commit()


def list_customers(db: Session) -> list[Customer]:
    return db.query(Customer).order_by(Customer.id.desc()).all()


def get_customer_or_404(db: Session, customer_id: int) -> Customer:
    customer = db.get(Customer, customer_id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Customer not found")
    return customer


def create_customer(db: Session, payload: CustomerCreate) -> Customer:
    existing = db.query(Customer).filter(Customer.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")

    customer = Customer(**payload.model_dump())
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return customer


def delete_customer(db: Session, customer_id: int) -> None:
    customer = get_customer_or_404(db, customer_id)
    db.delete(customer)
    db.commit()


def list_orders(db: Session) -> list[Order]:
    return db.query(Order).order_by(Order.id.desc()).all()


def get_order_or_404(db: Session, order_id: int) -> Order:
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order


def create_order(db: Session, payload: OrderCreate) -> Order:
    customer = get_customer_or_404(db, payload.customer_id)
    if not payload.items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order must contain at least one item")

    order = Order(customer_id=customer.id, total_amount=Decimal("0.00"))
    db.add(order)
    db.flush()

    total_amount = Decimal("0.00")
    order_items: list[OrderItem] = []

    for item in payload.items:
        product = db.get(Product, item.product_id)
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Product {item.product_id} not found")
        if product.stock_quantity < item.quantity:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Insufficient stock for {product.name}")

        product.stock_quantity -= item.quantity
        item_total = Decimal(product.price) * item.quantity
        total_amount += item_total
        order_items.append(
            OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=item.quantity,
                unit_price=product.price,
            )
        )

    order.total_amount = total_amount
    db.add_all(order_items)
    db.commit()
    db.refresh(order)
    return order
