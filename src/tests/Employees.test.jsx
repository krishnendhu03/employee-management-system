import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import {
  BrowserRouter,
} from "react-router-dom";

import {
  Provider,
} from "react-redux";

import {
  configureStore,
} from "@reduxjs/toolkit";

import Employees from "../pages/Employees";

import employeeReducer from "../redux/employeeSlice";

import api from "../services/api";

import { toast } from "react-toastify";


// Mock API
jest.mock("../services/api");


// Mock Toast
jest.mock("react-toastify", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    warning: jest.fn(),
  },
}));


// Test employee data
const employees = [
  {
    id: 1,
    name: "John Doe",
    email: "john@test.com",
    department: "IT",
    designation: "Frontend Developer",
    salary: 65000,
    status: "Active",
  },

  {
    id: 2,
    name: "Jane Smith",
    email: "jane@test.com",
    department: "HR",
    designation: "HR Executive",
    salary: 50000,
    status: "Inactive",
  },

  {
    id: 3,
    name: "Alice",
    email: "alice@test.com",
    department: "IT",
    designation: "Cloud Engineer",
    salary: 80000,
    status: "Active",
  },
];


// Create a fresh Redux store for every test
function createTestStore() {
  return configureStore({
    reducer: {
      employee: employeeReducer,
    },
  });
}


// Helper function to render Employees page
function renderEmployees() {
  return render(
    <Provider store={createTestStore()}>
      <BrowserRouter>
        <Employees />
      </BrowserRouter>
    </Provider>
  );
}


describe("Employees page", () => {

  beforeEach(() => {
    jest.clearAllMocks();

    window.confirm = jest.fn();

    api.get.mockResolvedValue({
      data: employees,
    });
  });


  test("renders employees from API", async () => {
    renderEmployees();

    expect(
      await screen.findByText("John Doe")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Jane Smith")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Alice")
    ).toBeInTheDocument();

    expect(api.get).toHaveBeenCalledWith(
      "/employees"
    );
  });


  test("searches employees by name", async () => {
    const user = userEvent.setup();

    renderEmployees();

    await screen.findByText("John Doe");

    const searchInput =
      screen.getByPlaceholderText(
        "Search employee..."
      );

    await user.type(
      searchInput,
      "Jane"
    );

    expect(
      screen.getByText("Jane Smith")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("John Doe")
    ).not.toBeInTheDocument();
  });


  test("searches employees by email", async () => {
    const user = userEvent.setup();

    renderEmployees();

    await screen.findByText("John Doe");

    const searchInput =
      screen.getByPlaceholderText(
        "Search employee..."
      );

    await user.type(
      searchInput,
      "alice@test.com"
    );

    expect(
      screen.getByText("Alice")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("John Doe")
    ).not.toBeInTheDocument();
  });


  test("filters inactive employees", async () => {
    const user = userEvent.setup();

    renderEmployees();

    await screen.findByText("John Doe");

    const select =
      screen.getByRole("combobox");

    await user.selectOptions(
      select,
      "Inactive"
    );

    expect(
      screen.getByText("Jane Smith")
    ).toBeInTheDocument();

    expect(
      screen.queryByText("John Doe")
    ).not.toBeInTheDocument();

    expect(
      screen.queryByText("Alice")
    ).not.toBeInTheDocument();
  });


  test("shows no employees when search has no match", async () => {
    const user = userEvent.setup();

    renderEmployees();

    await screen.findByText("John Doe");

    const searchInput =
      screen.getByPlaceholderText(
        "Search employee..."
      );

    await user.type(
      searchInput,
      "DoesNotExist"
    );

    expect(
      screen.getByText(
        "No employees found."
      )
    ).toBeInTheDocument();
  });


  test("deletes an employee successfully", async () => {
    const user = userEvent.setup();

    window.confirm = jest.fn(
      () => true
    );

    api.delete.mockResolvedValue({
      data: {},
    });

    renderEmployees();

    await screen.findByText("John Doe");

    const deleteButtons =
      screen.getAllByRole("button", {
        name: "Delete",
      });

    await user.click(
      deleteButtons[0]
    );

    expect(
      window.confirm
    ).toHaveBeenCalledWith(
      "Are you sure you want to delete this employee?"
    );

    await waitFor(() => {
      expect(
        api.delete
      ).toHaveBeenCalledWith(
        "/employees/1"
      );
    });

    await waitFor(() => {
      expect(
        screen.queryByText(
          "John Doe"
        )
      ).not.toBeInTheDocument();
    });

    expect(
      toast.success
    ).toHaveBeenCalledWith(
      "Employee Deleted Successfully!"
    );
  });


  test("does not delete employee when confirmation is cancelled", async () => {
    const user = userEvent.setup();

    window.confirm = jest.fn(
      () => false
    );

    renderEmployees();

    await screen.findByText("John Doe");

    const deleteButtons =
      screen.getAllByRole("button", {
        name: "Delete",
      });

    await user.click(
      deleteButtons[0]
    );

    expect(
      window.confirm
    ).toHaveBeenCalledWith(
      "Are you sure you want to delete this employee?"
    );

    expect(
      api.delete
    ).not.toHaveBeenCalled();

    expect(
      toast.success
    ).not.toHaveBeenCalled();
  });


  test("shows error toast when employee loading fails", async () => {
    api.get.mockRejectedValue(
      new Error("Network Error")
    );

    renderEmployees();

    await waitFor(() => {
      expect(
        toast.error
      ).toHaveBeenCalledWith(
        "Failed to load employees."
      );
    });
  });

});