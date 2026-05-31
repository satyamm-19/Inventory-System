import { useEffect, useState } from "react";
import { listCustomers } from "../api/customers";
import { listOrders } from "../api/orders";
import { listProducts } from "../api/products";

export default function Dashboard() {
    const [data, setData] = useState({
        products: [],
        customers: [],
        orders: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        setLoading(true);
        setError("");
        try {
            const [products, customers, orders] = await Promise.all([
                listProducts(),
                listCustomers(),
                listOrders(),
            ]);
            setData({ products, customers, orders });
        } catch (requestError) {
            setError("Unable to load dashboard data.");
        } finally {
            setLoading(false);
        }
    }

    const lowStock = data.products.filter(
        (product) => product.stock_quantity <= 5,
    );

    return (
        <section className="page">
            <header className="page-header">
                <div>
                    <p className="eyebrow">Overview</p>
                    <h2 className="page-title">Inventory dashboard</h2>
                    <p className="page-subtitle">
                        Track products, customers, and orders from one screen.
                    </p>
                </div>
                <button
                    className="button button-secondary"
                    onClick={loadDashboard}
                    type="button"
                >
                    Refresh
                </button>
            </header>

            {error ? <p className="notice error">{error}</p> : null}
            {loading ? <p className="muted">Loading dashboard...</p> : null}

            <div className="grid cards">
                <article className="card">
                    <p className="card-label">Total Products</p>
                    <p className="card-value">{data.products.length}</p>
                </article>
                <article className="card">
                    <p className="card-label">Total Customers</p>
                    <p className="card-value">{data.customers.length}</p>
                </article>
                <article className="card">
                    <p className="card-label">Total Orders</p>
                    <p className="card-value">{data.orders.length}</p>
                </article>
                <article className="card">
                    <p className="card-label">Low Stock Items</p>
                    <p className="card-value">{lowStock.length}</p>
                </article>
            </div>

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <h3 className="panel-title">Low stock products</h3>
                        <p className="panel-copy">
                            Products at or under 5 units so you can restock
                            early.
                        </p>
                    </div>
                </div>
                <div className="low-stock-list">
                    {lowStock.length === 0 ? (
                        <p className="muted">
                            No low stock products right now.
                        </p>
                    ) : (
                        lowStock.map((product) => (
                            <div className="low-stock-item" key={product.id}>
                                <div>
                                    <strong>{product.name}</strong>
                                    <div className="muted">
                                        SKU {product.sku}
                                    </div>
                                </div>
                                <strong>{product.stock_quantity} left</strong>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </section>
    );
}
