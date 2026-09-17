import { render, screen } from "@testing-library/react";
import EmployeeCard from "../components/EmployeeCard";

describe("EmployeeCard", () => {
  const employee = {
    id: 1,
    name: "John Doe",
    email: "john@test.com",
    department: "IT",
    designation: "Frontend Developer",
    salary: 65000,
    status: "Active",
  };

  const mockDelete = jest.fn();
  const mockEdit = jest.fn();
  const mockView = jest.fn();

  test("renders employee information correctly", () => {
    render(
      <table>
        <tbody>
          <EmployeeCard
            employee={employee}
            onDelete={mockDelete}
            onEdit={mockEdit}
            onView={mockView}
          />
        </tbody>
      </table>
    );

    expect(
      screen.getByText("John Doe")
    ).toBeInTheDocument();

    expect(
      screen.getByText("john@test.com")
    ).toBeInTheDocument();

    expect(
      screen.getByText("IT")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Frontend Developer")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/65,000/)
    ).toBeInTheDocument();

    expect(
      screen.getByText("Active")
    ).toBeInTheDocument();
  });

  test("renders View, Edit and Delete buttons", () => {
    render(
      <table>
        <tbody>
          <EmployeeCard
            employee={employee}
            onDelete={mockDelete}
            onEdit={mockEdit}
            onView={mockView}
          />
        </tbody>
      </table>
    );

    expect(
      screen.getByRole("button", { name: "View" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Edit" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Delete" })
    ).toBeInTheDocument();
  });
});