import { useEffect, useMemo, useState } from "react";
import { listCustomers } from "../api/customers";
import { createOrder, deleteOrder, listOrders } from "../api/orders";
import { listProducts } from "../api/products";
import { formatInr } from "../utils/currency";

const blankItem = { product_id: "", quantity: 1 };

export default function Orders() {
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [form, setForm] = useState({ customer_id: "", items: [blankItem] });
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadAll();
    }, []);

    async function loadAll() {
        setLoading(true);
        setError("");
        try {
            const [customersData, productsData, ordersData] = await Promise.all(
                [listCustomers(), listProducts(), listOrders()],
            );
            setCustomers(customersData);
            setProducts(productsData);
            setOrders(ordersData);
            setForm((current) => ({
                ...current,
                customer_id:
                    current.customer_id || String(customersData[0]?.id || ""),
            }));
        } catch (requestError) {
            setError("Unable to load order data.");
        } finally {
            setLoading(false);
        }
    }

    const selectedCustomer = useMemo(
        () =>
            customers.find(
                (customer) => String(customer.id) === String(form.customer_id),
            ),
        [customers, form.customer_id],
    );

    function updateItem(index, field, value) {
        setForm((current) => ({
            ...current,
            items: current.items.map((item, itemIndex) =>
                itemIndex === index ? { ...item, [field]: value } : item,
            ),
        }));
    }

    function addItem() {
        setForm((current) => ({
            ...current,
            items: [...current.items, { ...blankItem }],
        }));
    }

    function removeItem(index) {
        setForm((current) => ({
            ...current,
            items:
                current.items.length > 1
                    ? current.items.filter(
                          (_, itemIndex) => itemIndex !== index,
                      )
                    : current.items,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage("");
        setError("");

        const items = form.items
            .filter((item) => item.product_id)
            .map((item) => ({
                product_id: Number(item.product_id),
                quantity: Number(item.quantity),
            }));

        if (!form.customer_id || items.length === 0) {
            setError("Choose a customer and at least one product.");
            return;
        }

        try {
            await createOrder({ customer_id: Number(form.customer_id), items });
            setMessage("Order created successfully.");
            setForm({
                customer_id: form.customer_id,
                items: [{ ...blankItem }],
            });
            await loadAll();
        } catch (requestError) {
            setError(
                requestError?.response?.data?.detail || "Unable to save order.",
            );
        }
    }

    async function handleDelete(orderId) {
        if (!confirm("Delete this order?")) return;
        setMessage("");
        setError("");
        try {
            await deleteOrder(orderId);
            setMessage("Order deleted.");
            await loadAll();
        } catch (requestError) {
            setError(
                requestError?.response?.data?.detail ||
                    "Unable to delete order.",
            );
        }
    }

    return (
        <section className="page">
            <header className="page-header">
                <div>
                    <p className="eyebrow">Sales</p>
                    <h2 className="page-title">Orders</h2>
                    <p className="page-subtitle">
                        Create order records and automatically reduce inventory.
                    </p>
                </div>
            </header>

            {message ? <p className="notice">{message}</p> : null}
            {error ? <p className="notice error">{error}</p> : null}

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <h3 className="panel-title">Create order</h3>
                        <p className="panel-copy">
                            Stock validation and total calculation happen in the
                            API.
                        </p>
                    </div>
                </div>

                <form className="stack" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-field">
                            <label htmlFor="order-customer">Customer</label>
                            <select
                                id="order-customer"
                                value={form.customer_id}
                                onChange={(event) =>
                                    setForm((current) => ({
                                        ...current,
                                        customer_id: event.target.value,
                                    }))
                                }
                                required
                            >
                                <option value="">Select customer</option>
                                {customers.map((customer) => (
                                    <option
                                        key={customer.id}
                                        value={customer.id}
                                    >
                                        {customer.full_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="order-items">
                        {form.items.map((item, index) => (
                            <div
                                className="order-row"
                                key={`${index}-${item.product_id}`}
                            >
                                <div className="form-field">
                                    <label>Product</label>
                                    <select
                                        value={item.product_id}
                                        onChange={(event) =>
                                            updateItem(
                                                index,
                                                "product_id",
                                                event.target.value,
                                            )
                                        }
                                        required
                                    >
                                        <option value="">Select product</option>
                                        {products.map((product) => (
                                            <option
                                                key={product.id}
                                                value={product.id}
                                            >
                                                {product.name} (
                                                {product.stock_quantity} in
                                                stock)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-field">
                                    <label>Quantity</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(event) =>
                                            updateItem(
                                                index,
                                                "quantity",
                                                event.target.value,
                                            )
                                        }
                                        required
                                    />
                                </div>
                                <button
                                    className="button button-danger"
                                    type="button"
                                    onClick={() => removeItem(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="form-actions">
                        <button
                            className="button button-secondary"
                            type="button"
                            onClick={addItem}
                        >
                            Add item
                        </button>
                        <button className="button button-primary" type="submit">
                            Save order
                        </button>
                    </div>
                </form>
            </section>

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <h3 className="panel-title">Orders</h3>
                        <p className="panel-copy">
                            Recent transactions and their line items.
                        </p>
                    </div>
                    <button
                        className="button button-secondary"
                        type="button"
                        onClick={loadAll}
                    >
                        Reload
                    </button>
                </div>
                {loading ? (
                    <p className="muted">Loading orders...</p>
                ) : (
                    <div className="stack">
                        {orders.map((order) => (
                            <article className="card" key={order.id}>
                                <div className="panel-header">
                                    <div>
                                        <h4 className="panel-title">
                                            Order #{order.id}
                                        </h4>
                                        <p className="panel-copy">
                                            {order.customer_name} ·{" "}
                                            {new Date(
                                                order.created_at,
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="toolbar">
                                        <strong>
                                            {formatInr(order.total_amount)}
                                        </strong>
                                        <button
                                            className="button button-danger"
                                            type="button"
                                            onClick={() =>
                                                handleDelete(order.id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <ul
                                    className="stack"
                                    style={{ paddingLeft: 18, margin: 0 }}
                                >
                                    {order.items.map((item) => (
                                        <li key={item.id} className="muted">
                                            {item.product_name} · SKU {item.sku}{" "}
                                            · Qty {item.quantity} ·{" "}
                                            {formatInr(Number(item.unit_price))}
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        ))}
                        {orders.length === 0 ? (
                            <p className="muted">No orders yet.</p>
                        ) : null}
                    </div>
                )}
            </section>

            {selectedCustomer ? (
                <p className="muted">
                    Selected customer: {selectedCustomer.full_name}
                </p>
            ) : null}
        </section>
    );
}
