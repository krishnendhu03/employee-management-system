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

import EditEmployee from "../pages/EditEmployee";

import employeeReducer from "../redux/employeeslice";

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


// Mock React Router
jest.mock("react-router-dom", () => ({
  ...jest.requireActual(
    "react-router-dom"
  ),

  useParams: () => ({
    id: "1",
  }),

  useNavigate: () => jest.fn(),
}));


// Test employee
const employee = {
  id: 1,
  name: "John Doe",
  email: "john@test.com",
  department: "IT",
  designation: "Frontend Developer",
  salary: 65000,
  status: "Active",
};


// Create a fresh Redux store
function createTestStore() {
  return configureStore({
    reducer: {
      employee: employeeReducer,
    },
  });
}


// Render component with Redux + Router
function renderEditEmployee() {
  return render(
    <Provider store={createTestStore()}>
      <BrowserRouter>
        <EditEmployee />
      </BrowserRouter>
    </Provider>
  );
}


describe("EditEmployee", () => {

  beforeEach(() => {
    jest.clearAllMocks();

    // Supabase returns rows as an array
    api.get.mockResolvedValue({
      data: [employee],
    });
  });


  test("loads employee details into the form", async () => {
    renderEditEmployee();

    const nameInput =
      await screen.findByRole(
        "textbox",
        {
          name: "Name",
        }
      );

    await waitFor(() => {
      expect(nameInput).toHaveValue(
        "John Doe"
      );
    });

    expect(
      screen.getByRole("textbox", {
        name: "Email",
      })
    ).toHaveValue(
      "john@test.com"
    );

    expect(
      screen.getByRole("textbox", {
        name: "Department",
      })
    ).toHaveValue("IT");

    expect(
      screen.getByRole("textbox", {
        name: "Designation",
      })
    ).toHaveValue(
      "Frontend Developer"
    );

    expect(
      screen.getByRole("spinbutton", {
        name: "Salary",
      })
    ).toHaveValue(65000);

    expect(api.get).toHaveBeenCalledWith(
      "/employees?id=eq.1"
    );
  });


  test("shows validation warning when required fields are empty", async () => {
    const user = userEvent.setup();

    renderEditEmployee();

    const nameInput =
      await screen.findByRole(
        "textbox",
        {
          name: "Name",
        }
      );

    await waitFor(() => {
      expect(nameInput).toHaveValue(
        "John Doe"
      );
    });

    await user.clear(nameInput);

    await user.click(
      screen.getByRole("button", {
        name: "Update Employee",
      })
    );

    expect(
      toast.warning
    ).toHaveBeenCalledWith(
      "Please fill all fields."
    );

    expect(
      api.patch
    ).not.toHaveBeenCalled();
  });


  test("updates employee successfully", async () => {
    const user = userEvent.setup();

    const updatedEmployee = {
      ...employee,
      name: "John Updated",
    };

    // Supabase returns the updated row as an array
    api.patch.mockResolvedValue({
      data: [updatedEmployee],
    });

    renderEditEmployee();

    const nameInput =
      await screen.findByRole(
        "textbox",
        {
          name: "Name",
        }
      );

    await waitFor(() => {
      expect(nameInput).toHaveValue(
        "John Doe"
      );
    });

    await user.clear(nameInput);

    await user.type(
      nameInput,
      "John Updated"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Update Employee",
      })
    );

    await waitFor(() => {
      expect(api.patch).toHaveBeenCalledWith(
        "/employees?id=eq.1",
        {
          id: 1,
          name: "John Updated",
          email: "john@test.com",
          department: "IT",
          designation: "Frontend Developer",
          salary: 65000,
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
      "Employee Updated Successfully!"
    );
  });

});