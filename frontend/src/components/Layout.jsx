import { NavLink } from "react-router-dom";

const links = [
    { to: "/", label: "Dashboard" },
    { to: "/products", label: "Products" },
    { to: "/customers", label: "Customers" },
    { to: "/orders", label: "Orders" },
];

export default function Layout({ children }) {
    return (
        <div className="shell">
            <aside className="sidebar">
                <div>
                    <p className="eyebrow">Inventory System</p>
                    <h1>Control center for stock and orders</h1>
                    <p className="sidebar-copy">
                        FastAPI backend, React frontend, PostgreSQL, Docker.
                    </p>
                </div>
                <nav className="nav-links">
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </nav>
            </aside>
            <main className="content">{children}</main>
        </div>
    );
}
