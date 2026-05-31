"""initial create tables

Revision ID: 0001_initial_create_tables
Revises: 
Create Date: 2026-05-31 12:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '0001_initial_create_tables'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'products',
        sa.Column('id', sa.Integer(), primary_key=True, nullable=False),
        sa.Column('name', sa.String(length=150), nullable=False),
        sa.Column('sku', sa.String(length=80), nullable=False),
        sa.Column('price', sa.Numeric(10, 2), nullable=False),
        sa.Column('stock_quantity', sa.Integer(), nullable=False, server_default='0'),
        sa.UniqueConstraint('sku', name='uq_products_sku'),
    )

    op.create_table(
        'customers',
        sa.Column('id', sa.Integer(), primary_key=True, nullable=False),
        sa.Column('full_name', sa.String(length=150), nullable=False),
        sa.Column('email', sa.String(length=150), nullable=False),
        sa.Column('phone', sa.String(length=50), nullable=True),
        sa.UniqueConstraint('email', name='uq_customers_email'),
    )

    op.create_table(
        'orders',
        sa.Column('id', sa.Integer(), primary_key=True, nullable=False),
        sa.Column('customer_id', sa.Integer(), sa.ForeignKey('customers.id', ondelete='CASCADE'), nullable=False),
        sa.Column('total_amount', sa.Numeric(10, 2), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )

    op.create_table(
        'order_items',
        sa.Column('id', sa.Integer(), primary_key=True, nullable=False),
        sa.Column('order_id', sa.Integer(), sa.ForeignKey('orders.id', ondelete='CASCADE'), nullable=False),
        sa.Column('product_id', sa.Integer(), sa.ForeignKey('products.id', ondelete='RESTRICT'), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.Column('unit_price', sa.Numeric(10, 2), nullable=False),
    )


def downgrade():
    op.drop_table('order_items')
    op.drop_table('orders')
    op.drop_table('customers')
    op.drop_table('products')
