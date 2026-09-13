import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import Navbar from "../components/Navbar";

import {
  addEmployee,
} from "../redux/employeeSlice";

import { toast } from "react-toastify";

const initialEmployee = {
  name: "",
  email: "",
  department: "",
  designation: "",
  salary: "",
  status: "Active",
};

export default function AddEmployee() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [employee, setEmployee] =
    useState(initialEmployee);

  const [submitting, setSubmitting] =
    useState(false);

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
        addEmployee(employee)
      );

      if (
        addEmployee.fulfilled.match(
          result
        )
      ) {
        toast.success(
          "Employee Added Successfully!"
        );

        navigate("/employees");
      } else {
        toast.error(
          "Failed to add employee."
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="container">

        <div className="form-container">

          <h2>Add Employee</h2>

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
                ? "Saving..."
                : "Save Employee"}
            </button>

          </form>

        </div>

      </main>
    </>
  );
}