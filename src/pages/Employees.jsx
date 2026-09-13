import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import EmployeeCard from "../components/EmployeeCard";
import Loader from "../components/Loader";

import {
  fetchEmployees,
  deleteEmployee,
} from "../redux/employeeSlice";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

export default function Employees() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const {
    employees,
    loading,
    error,
  } = useSelector(
    (state) => state.employee
  );

  // Local UI state
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const employeesPerPage = 5;

  // Fetch employees
  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  // Display API errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Reset pagination when table data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter, sortConfig]);

  // Delete employee
  async function handleDeleteEmployee(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) {
      return;
    }

    const result = await dispatch(
      deleteEmployee(id)
    );

    if (
      deleteEmployee.fulfilled.match(result)
    ) {
      toast.success(
        "Employee Deleted Successfully!"
      );
    } else {
      toast.error(
        "Failed to delete employee."
      );
    }
  }

  // Handle column sorting
  function handleSort(key) {
    setSortConfig((current) => {
      if (current.key === key) {
        return {
          key,
          direction:
            current.direction === "asc"
              ? "desc"
              : "asc",
        };
      }

      return {
        key,
        direction: "asc",
      };
    });
  }

  // Search and filter employees
  const filteredEmployees = employees.filter(
    (employee) => {
      const searchText =
        search.toLowerCase();

      const matchesSearch =
        employee.name
          .toLowerCase()
          .includes(searchText) ||
        employee.email
          .toLowerCase()
          .includes(searchText) ||
        employee.department
          .toLowerCase()
          .includes(searchText) ||
        employee.designation
          .toLowerCase()
          .includes(searchText) ||
        String(employee.salary).includes(
          searchText
        );

      const matchesFilter =
        filter === "All" ||
        employee.status === filter;

      return (
        matchesSearch &&
        matchesFilter
      );
    }
  );

  // Sort employees
  const sortedEmployees = [
    ...filteredEmployees,
  ].sort((employeeA, employeeB) => {
    if (!sortConfig.key) {
      return 0;
    }

    const valueA =
      employeeA[sortConfig.key];

    const valueB =
      employeeB[sortConfig.key];

    // Salary is numeric
    if (sortConfig.key === "salary") {
      return sortConfig.direction === "asc"
        ? Number(valueA) - Number(valueB)
        : Number(valueB) - Number(valueA);
    }

    // Other fields are strings
    const comparison = String(valueA)
      .toLowerCase()
      .localeCompare(
        String(valueB).toLowerCase()
      );

    return sortConfig.direction === "asc"
      ? comparison
      : -comparison;
  });

  // Pagination
  const totalPages = Math.ceil(
    sortedEmployees.length /
      employeesPerPage
  );

  const startIndex =
    (currentPage - 1) *
    employeesPerPage;

  const currentEmployees =
    sortedEmployees.slice(
      startIndex,
      startIndex + employeesPerPage
    );

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  function goToNextPage() {
    if (currentPage < totalPages) {
      setCurrentPage(
        currentPage + 1
      );
    }
  }

  function goToPreviousPage() {
    if (currentPage > 1) {
      setCurrentPage(
        currentPage - 1
      );
    }
  }

  // Loading state
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

      <main className="container">

        {/* Page header */}
        <div className="employee-header">
          <h1>Employees</h1>

          <button
            type="button"
            onClick={() =>
              navigate("/add")
            }
          >
            + Add Employee
          </button>
        </div>

        {/* Search and filter */}
        <SearchBar
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
        />

        {/* Employee table */}
        <table>
          <thead>
            <tr>

              <th>
                <button
                  type="button"
                  className="sort-button"
                  onClick={() =>
                    handleSort("name")
                  }
                >
                  Name
                </button>
              </th>

              <th>
                <button
                  type="button"
                  className="sort-button"
                  onClick={() =>
                    handleSort("email")
                  }
                >
                  Email
                </button>
              </th>

              <th>
                <button
                  type="button"
                  className="sort-button"
                  onClick={() =>
                    handleSort(
                      "department"
                    )
                  }
                >
                  Department
                </button>
              </th>

              <th>
                <button
                  type="button"
                  className="sort-button"
                  onClick={() =>
                    handleSort(
                      "designation"
                    )
                  }
                >
                  Designation
                </button>
              </th>

              <th>
                <button
                  type="button"
                  className="sort-button"
                  onClick={() =>
                    handleSort("salary")
                  }
                >
                  Salary
                </button>
              </th>

              <th>
                <button
                  type="button"
                  className="sort-button"
                  onClick={() =>
                    handleSort("status")
                  }
                >
                  Status
                </button>
              </th>

              <th>Action</th>

            </tr>
          </thead>

          <tbody>
            {currentEmployees.length > 0 ? (
              currentEmployees.map(
                (employee) => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}

                    onView={(id) =>
                      navigate(
                        `/view/${id}`
                      )
                    }

                    onEdit={(id) =>
                      navigate(
                        `/edit/${id}`
                      )
                    }

                    onDelete={
                      handleDeleteEmployee
                    }
                  />
                )
              )
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">

            <button
              type="button"
              onClick={
                goToPreviousPage
              }
              disabled={
                currentPage === 1
              }
            >
              Previous
            </button>

            {pageNumbers.map(
              (pageNumber) => (
                <button
                  type="button"
                  key={pageNumber}
                  onClick={() =>
                    setCurrentPage(
                      pageNumber
                    )
                  }
                  className={
                    currentPage ===
                    pageNumber
                      ? "active"
                      : ""
                  }
                >
                  {pageNumber}
                </button>
              )
            )}

            <button
              type="button"
              onClick={goToNextPage}
              disabled={
                currentPage ===
                totalPages
              }
            >
              Next
            </button>

          </div>
        )}

      </main>
    </>
  );
}