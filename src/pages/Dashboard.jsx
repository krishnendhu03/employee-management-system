import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    try {
      setLoading(true);

      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  const totalEmployees = employees.length;

  const activeEmployees = employees.filter(
    (employee) => employee.status === "Active"
  ).length;

  const inactiveEmployees = employees.filter(
    (employee) => employee.status === "Inactive"
  ).length;

  const totalDepartments = new Set(
    employees.map((employee) => employee.department)
  ).size;

  const totalSalary = employees.reduce(
    (sum, employee) => sum + Number(employee.salary || 0),
    0
  );

  const averageSalary =
    totalEmployees > 0
      ? totalSalary / totalEmployees
      : 0;

  const highestSalary =
    totalEmployees > 0
      ? Math.max(
          ...employees.map((employee) =>
            Number(employee.salary || 0)
          )
        )
      : 0;

  const latestEmployee =
    employees.length > 0
      ? employees[employees.length - 1]
      : null;

  if (loading) {
    return (
      <>
        <Navbar />
        <Loader />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>Employee Management Overview</p>
        </div>

        <div className="dashboard-grid">

          <div className="dashboard-card">
            <h3>Total Employees</h3>
            <p className="dashboard-number">
              {totalEmployees}
            </p>
          </div>

          <div className="dashboard-card">
            <h3>Active Employees</h3>
            <p className="dashboard-number">
              {activeEmployees}
            </p>
          </div>

          <div className="dashboard-card">
            <h3>Inactive Employees</h3>
            <p className="dashboard-number">
              {inactiveEmployees}
            </p>
          </div>

          <div className="dashboard-card">
            <h3>Departments</h3>
            <p className="dashboard-number">
              {totalDepartments}
            </p>
          </div>

          <div className="dashboard-card">
            <h3>Average Salary</h3>
            <p className="dashboard-number">
              ₹ {averageSalary.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}
            </p>
          </div>

          <div className="dashboard-card">
            <h3>Highest Salary</h3>
            <p className="dashboard-number">
              ₹ {highestSalary.toLocaleString("en-IN")}
            </p>
          </div>

        </div>

        <div className="dashboard-bottom">

          <div className="dashboard-panel">
            <h2>Latest Employee</h2>

            {latestEmployee ? (
              <>
                <p>
                  <strong>Name:</strong>{" "}
                  {latestEmployee.name}
                </p>

                <p>
                  <strong>Department:</strong>{" "}
                  {latestEmployee.department}
                </p>

                <p>
                  <strong>Designation:</strong>{" "}
                  {latestEmployee.designation}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {latestEmployee.status}
                </p>
              </>
            ) : (
              <p>No employees available.</p>
            )}
          </div>

          <div className="dashboard-panel">
            <h2>Quick Summary</h2>

            <p>
              <strong>Active:</strong>{" "}
              {activeEmployees}
            </p>

            <p>
              <strong>Inactive:</strong>{" "}
              {inactiveEmployees}
            </p>

            <p>
              <strong>Departments:</strong>{" "}
              {totalDepartments}
            </p>

            <p>
              <strong>Total Salary:</strong>{" "}
              ₹ {totalSalary.toLocaleString("en-IN")}
            </p>
          </div>

        </div>
      </div>
    </>
  );
}