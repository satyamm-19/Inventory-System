import { useEffect, useState } from "react";
import {
    createCustomer,
    deleteCustomer,
    listCustomers,
} from "../api/customers";

const blankCustomer = {
    full_name: "",
    email: "",
    phone: "",
};

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [form, setForm] = useState(blankCustomer);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadCustomers();
    }, []);

    async function loadCustomers() {
        setLoading(true);
        setError("");
        try {
            setCustomers(await listCustomers());
        } catch (requestError) {
            setError("Unable to load customers.");
        } finally {
            setLoading(false);
        }
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
    }

    function resetForm() {
        setForm(blankCustomer);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setMessage("");
        setError("");

        try {
            await createCustomer({
                full_name: form.full_name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim() || null,
            });
            setMessage("Customer created successfully.");
            resetForm();
            await loadCustomers();
        } catch (requestError) {
            setError(
                requestError?.response?.data?.detail ||
                    "Unable to save customer.",
            );
        }
    }

    async function handleDelete(customerId) {
        if (!confirm("Delete this customer?")) return;
        setMessage("");
        setError("");
        try {
            await deleteCustomer(customerId);
            setMessage("Customer deleted.");
            await loadCustomers();
        } catch (requestError) {
            setError(
                requestError?.response?.data?.detail ||
                    "Unable to delete customer.",
            );
        }
    }

    return (
        <section className="page">
            <header className="page-header">
                <div>
                    <p className="eyebrow">CRM</p>
                    <h2 className="page-title">Customers</h2>
                    <p className="page-subtitle">
                        Maintain your customer list and contact details.
                    </p>
                </div>
            </header>

            {message ? <p className="notice">{message}</p> : null}
            {error ? <p className="notice error">{error}</p> : null}

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <h3 className="panel-title">Add customer</h3>
                        <p className="panel-copy">
                            Email must be unique in the database.
                        </p>
                    </div>
                </div>

                <form className="stack" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-field">
                            <label htmlFor="customer-name">Full name</label>
                            <input
                                id="customer-name"
                                name="full_name"
                                value={form.full_name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="customer-email">Email</label>
                            <input
                                id="customer-email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-field">
                            <label htmlFor="customer-phone">Phone</label>
                            <input
                                id="customer-phone"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="form-actions">
                        <button className="button button-primary" type="submit">
                            Create customer
                        </button>
                        <button
                            className="button button-secondary"
                            type="button"
                            onClick={resetForm}
                        >
                            Clear form
                        </button>
                    </div>
                </form>
            </section>

            <section className="panel">
                <div className="panel-header">
                    <div>
                        <h3 className="panel-title">Customer list</h3>
                        <p className="panel-copy">Who can place orders.</p>
                    </div>
                    <button
                        className="button button-secondary"
                        type="button"
                        onClick={loadCustomers}
                    >
                        Reload
                    </button>
                </div>
                {loading ? (
                    <p className="muted">Loading customers...</p>
                ) : (
                    <div className="table-wrap">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td>{customer.full_name}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.phone || "-"}</td>
                                        <td>
                                            <button
                                                className="button button-danger"
                                                type="button"
                                                onClick={() =>
                                                    handleDelete(customer.id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {customers.length === 0 ? (
                            <p className="muted">No customers yet.</p>
                        ) : null}
                    </div>
                )}
            </section>
        </section>
    );
}
