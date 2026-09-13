import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { toast } from "react-toastify";

export default function ViewEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    loadEmployee();
  }, []);

  async function loadEmployee() {
    try {
      const res = await api.get("/employees/" + id);
      setEmployee(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load employee.");
    }
  }

  if (!employee) {
    return (
      <>
        <Navbar />
        <div className="container">
          <h2>Loading...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="container">

        <div className="form-container">

          <h2>Employee Details</h2>

          <p><strong>Name:</strong> {employee.name}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Department:</strong> {employee.department}</p>
          <p><strong>Designation:</strong> {employee.designation}</p>
          <p><strong>Salary:</strong> ₹ {employee.salary}</p>
          <p><strong>Status:</strong> {employee.status}</p>

          <button className="back-btn" onClick={() => navigate("/employees")}>
  Back
</button>

        </div>

      </div>
    </>
  );
}