from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ProductBase(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    sku: str = Field(min_length=1, max_length=80)
    price: Decimal = Field(gt=0)
    stock_quantity: int = Field(ge=0)


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=150)
    sku: str | None = Field(default=None, min_length=1, max_length=80)
    price: Decimal | None = Field(default=None, gt=0)
    stock_quantity: int | None = Field(default=None, ge=0)


class ProductRead(ProductBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class CustomerBase(BaseModel):
    full_name: str = Field(min_length=1, max_length=150)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=50)


class CustomerCreate(CustomerBase):
    pass


class CustomerRead(CustomerBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class OrderItemRead(BaseModel):
    id: int
    product_id: int
    product_name: str
    sku: str
    quantity: int
    unit_price: Decimal
    model_config = ConfigDict(from_attributes=True)


class OrderCreate(BaseModel):
    customer_id: int
    items: list[OrderItemCreate]


class OrderRead(BaseModel):
    id: int
    customer_id: int
    customer_name: str
    total_amount: Decimal
    created_at: datetime
    items: list[OrderItemRead]
    model_config = ConfigDict(from_attributes=True)
