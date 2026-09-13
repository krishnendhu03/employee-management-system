import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      style={{
        background: "#2563eb",
        color: "white",
        padding: "15px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2>Employee Manager</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link
          to="/"
          style={{ color: "white", textDecoration: "none" }}
        >
          Dashboard
        </Link>

        <Link
          to="/employees"
          style={{ color: "white", textDecoration: "none" }}
        >
          Employees
        </Link>

        <Link
          to="/add"
          style={{ color: "white", textDecoration: "none" }}
        >
          Add Employee
        </Link>
      </div>
    </nav>
  );
}