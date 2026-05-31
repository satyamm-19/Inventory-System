from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app import crud, schemas
from app.core.database import get_db

router = APIRouter(prefix="/customers", tags=["Customers"])


@router.get("", response_model=list[schemas.CustomerRead])
def read_customers(db: Session = Depends(get_db)):
    return crud.list_customers(db)


@router.get("/{customer_id}", response_model=schemas.CustomerRead)
def read_customer(customer_id: int, db: Session = Depends(get_db)):
    return crud.get_customer_or_404(db, customer_id)


@router.post("", response_model=schemas.CustomerRead, status_code=status.HTTP_201_CREATED)
def create_customer(payload: schemas.CustomerCreate, db: Session = Depends(get_db)):
    return crud.create_customer(db, payload)


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    crud.delete_customer(db, customer_id)
