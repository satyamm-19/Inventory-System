from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.core.database import get_db
from app.models import Customer, Order, OrderItem, Product

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get("", response_model=list[schemas.OrderRead])
def read_orders(db: Session = Depends(get_db)):
    orders = crud.list_orders(db)
    return [serialize_order(order) for order in orders]


@router.get("/{order_id}", response_model=schemas.OrderRead)
def read_order(order_id: int, db: Session = Depends(get_db)):
    order = crud.get_order_or_404(db, order_id)
    return serialize_order(order)


@router.post("", response_model=schemas.OrderRead, status_code=status.HTTP_201_CREATED)
def create_order(payload: schemas.OrderCreate, db: Session = Depends(get_db)):
    order = crud.create_order(db, payload)
    return serialize_order(order)


@router.delete("/{order_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_order(order_id: int, db: Session = Depends(get_db)):
    order = crud.get_order_or_404(db, order_id)
    db.delete(order)
    db.commit()


def serialize_order(order: Order) -> schemas.OrderRead:
    customer_name = order.customer.full_name if order.customer else ""
    items = [
        schemas.OrderItemRead(
            id=item.id,
            product_id=item.product_id,
            product_name=item.product.name if item.product else "",
            sku=item.product.sku if item.product else "",
            quantity=item.quantity,
            unit_price=item.unit_price,
        )
        for item in order.items
    ]
    return schemas.OrderRead(
        id=order.id,
        customer_id=order.customer_id,
        customer_name=customer_name,
        total_amount=order.total_amount,
        created_at=order.created_at,
        items=items,
    )
