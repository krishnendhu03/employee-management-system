import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { useDispatch } from "react-redux";

import Navbar from "../components/Navbar";

import {
  updateEmployee,
} from "../redux/employeeSlice";

import api from "../services/api";

import { toast } from "react-toastify";

const initialEmployee = {
  name: "",
  email: "",
  department: "",
  designation: "",
  salary: "",
  status: "Active",
};

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [employee, setEmployee] =
    useState(initialEmployee);

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  // Load employee details
  useEffect(() => {
    async function loadEmployee() {
      try {
        setLoading(true);

        const response = await api.get(
          `/employees/${id}`
        );

        setEmployee(response.data);
      } catch (error) {
        console.error(
          "Load employee error:",
          error
        );

        toast.error(
          "Failed to load employee."
        );
      } finally {
        setLoading(false);
      }
    }

    loadEmployee();
  }, [id]);

  function handleChange(e) {
    const {
      name,
      value,
    } = e.target;

    setEmployee((currentEmployee) => ({
      ...currentEmployee,
      [name]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (submitting) {
      return;
    }

    // Validate required fields
    const hasEmptyField =
      !employee.name.trim() ||
      !employee.email.trim() ||
      !employee.department.trim() ||
      !employee.designation.trim() ||
      !employee.salary;

    if (hasEmptyField) {
      toast.warning(
        "Please fill all fields."
      );

      return;
    }

    try {
      setSubmitting(true);

      const result = await dispatch(
        updateEmployee({
          id,
          employee,
        })
      );

      if (
        updateEmployee.fulfilled.match(
          result
        )
      ) {
        toast.success(
          "Employee Updated Successfully!"
        );

        navigate("/employees");
      } else {
        toast.error(
          "Failed to update employee."
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="container">
          <h2>Loading...</h2>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="container">

        <div className="form-container">

          <h2>Edit Employee</h2>

          <form onSubmit={handleSubmit}>

            <label htmlFor="name">
              Name
            </label>

            <input
              id="name"
              name="name"
              value={employee.name}
              onChange={handleChange}
            />

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={employee.email}
              onChange={handleChange}
            />

            <label htmlFor="department">
              Department
            </label>

            <input
              id="department"
              name="department"
              value={employee.department}
              onChange={handleChange}
            />

            <label htmlFor="designation">
              Designation
            </label>

            <input
              id="designation"
              name="designation"
              value={employee.designation}
              onChange={handleChange}
            />

            <label htmlFor="salary">
              Salary
            </label>

            <input
              id="salary"
              type="number"
              name="salary"
              value={employee.salary}
              onChange={handleChange}
            />

            <label htmlFor="status">
              Status
            </label>

            <select
              id="status"
              name="status"
              value={employee.status}
              onChange={handleChange}
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>

            <button
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "Updating..."
                : "Update Employee"}
            </button>

          </form>

        </div>

      </main>
    </>
  );
}