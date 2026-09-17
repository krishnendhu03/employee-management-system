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

import AddEmployee from "../pages/AddEmployee";

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


// Create a fresh Redux store for every test
function createTestStore() {
  return configureStore({
    reducer: {
      employee: employeeReducer,
    },
  });
}


// Helper function to render AddEmployee
function renderAddEmployee() {
  return render(
    <Provider store={createTestStore()}>
      <BrowserRouter>
        <AddEmployee />
      </BrowserRouter>
    </Provider>
  );
}


describe("AddEmployee", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });


  test("shows validation warning when form is empty", async () => {
    const user = userEvent.setup();

    renderAddEmployee();

    const saveButton =
      screen.getByRole("button", {
        name: "Save Employee",
      });

    await user.click(saveButton);

    expect(
      toast.warning
    ).toHaveBeenCalledWith(
      "Please fill all fields."
    );

    expect(
      api.post
    ).not.toHaveBeenCalled();
  });


  test("submits valid employee data successfully", async () => {
    const user = userEvent.setup();

    const createdEmployee = {
      id: 4,
      name: "Alice",
      email: "alice@test.com",
      department: "IT",
      designation: "Frontend Developer",
      salary: "80000",
      status: "Active",
    };

    // Supabase returns the inserted row as an array
    api.post.mockResolvedValue({
      data: [createdEmployee],
    });

    renderAddEmployee();

    await user.type(
      screen.getByRole("textbox", {
        name: "Name",
      }),
      "Alice"
    );

    await user.type(
      screen.getByRole("textbox", {
        name: "Email",
      }),
      "alice@test.com"
    );

    await user.type(
      screen.getByRole("textbox", {
        name: "Department",
      }),
      "IT"
    );

    await user.type(
      screen.getByRole("textbox", {
        name: "Designation",
      }),
      "Frontend Developer"
    );

    await user.type(
      screen.getByRole("spinbutton", {
        name: "Salary",
      }),
      "80000"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Save Employee",
      })
    );

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        "/employees",
        {
          name: "Alice",
          email: "alice@test.com",
          department: "IT",
          designation: "Frontend Developer",
          salary: "80000",
          status: "Active",
        },
        {
          headers: {
            Prefer: "return=representation",
          },
        }
      );
    });

    expect(
      toast.success
    ).toHaveBeenCalledWith(
      "Employee Added Successfully!"
    );
  });

});