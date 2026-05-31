import { useEffect, useState } from "react";
import {
    createProduct,
    deleteProduct,
    listProducts,
    updateProduct,
} from "../api/products";
import { formatInr } from "../utils/currency";

const blankProduct = {
    name: "",
    sku: "",
    price: "",
    stock_quantity: "",
};

export default function Products() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState(blankProduct);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        setLoading(true);
        setError("");
        try {
            setProducts(await listProducts());
        } catch (requestError) {
            setError("Unable to load products.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    }

    function startEdit(product) {
        setEditingId(product.id);
        setForm({
            name: product.name,
            sku: product.sku,
            price: String(product.price),
            stock_quantity: String(product.stock_quantity),
        });
    }

    function resetForm() {
        setEditingId(null);
        setForm(blankProduct);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage("");
        setError("");

        const payload = {
            name: form.name.trim(),
            sku: form.sku.trim(),
            price: Number(form.price),
            stock_quantity: Number(form.stock_quantity),
        };

        try {
            if (editingId) {
                await updateProduct(editingId, payload);
                setMessage("Product updated successfully.");
            } else {
                await createProduct(payload);
                setMessage("Product created successfully.");
            }
            resetForm();
            await loadProducts();
        } catch (requestError) {
            setError(
                requestError?.response?.data?.detail ||
                    "Unable to save product.",
            );
        }
    }

    async function handleDelete(productId) {
        if (!confirm("Delete this product?")) return;
        setMessage("");
        setError("");
        try {
            await deleteProduct(productId);
            setMessage("Product deleted.");
            await loadProducts();
        } catch (requestError) {
            setError(
                requestError?.response?.data?.detail ||
                    "Unable to delete product.",
            );
        }
    }

    return (
        <section className="page">
            <header className="page-header">
                <div>
                    <p className="eyebrow">Catalog</p>
                    <h2 className="page-title">Products</h2>
                    <p className="page-subtitle">
                        Create, update, and remove inventory items.
                    </p>
                </div>
            </header>

            {message ? <p className="notice">{message}</p> : null}
            {error ? <p className="notice error">{error}</p> : null}

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <h3 className="panel-title">
                            {editingId ? "Edit product" : "Add product"}
                        </h3>
                        <p className="panel-copy">
                            Keep SKU unique and stock quantity non-negative.
                        </p>
                    </div>
                    {editingId ? (
                        <button
                            className="button button-secondary"
                            type="button"
                            onClick={resetForm}
                        >
                            Cancel edit
                        </button>
                    ) : null}
                </div>

                <form className="stack" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-field">
                            <label htmlFor="product-name">Product name</label>
                            <input
                                id="product-name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="product-sku">SKU</label>
                            <input
                                id="product-sku"
                                name="sku"
                                value={form.sku}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="product-price">Price</label>
                            <input
                                id="product-price"
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={form.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="product-stock">
                                Stock quantity
                            </label>
                            <input
                                id="product-stock"
                                name="stock_quantity"
                                type="number"
                                min="0"
                                value={form.stock_quantity}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button className="button button-primary" type="submit">
                            {editingId ? "Update product" : "Create product"}
                        </button>
                    </div>
                </form>
            </section>

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <h3 className="panel-title">Current products</h3>
                        <p className="panel-copy">
                            Everything in your catalog.
                        </p>
                    </div>
                    <button
                        className="button button-secondary"
                        type="button"
                        onClick={loadProducts}
                    >
                        Reload
                    </button>
                </div>
                {loading ? (
                    <p className="muted">Loading products...</p>
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>SKU</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id}>
                                        <td>{product.name}</td>
                                        <td>{product.sku}</td>
                                        <td>{formatInr(product.price)}</td>
                                        <td>{product.stock_quantity}</td>
                                        <td>
                                            <div className="toolbar">
                                                <button
                                                    className="button button-secondary"
                                                    type="button"
                                                    onClick={() =>
                                                        startEdit(product)
                                                    }
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="button button-danger"
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(product.id)
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {products.length === 0 ? (
                            <p className="muted">No products yet.</p>
                        ) : null}
                    </div>
                )}
            </section>
        </section>
    );
}
