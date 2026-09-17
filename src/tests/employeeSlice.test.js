import { configureStore } from "@reduxjs/toolkit";

import api from "../services/api";

import employeeReducer, {
  fetchEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from "../redux/employeeslice";

// Mock Axios API
 jest.mock("../services/api");

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
 ];

 // Create a fresh Redux store
function createTestStore() {
  return configureStore({
    reducer: {
      employee: employeeReducer,
    },
  });
 }

 describe("employeeSlice async thunks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
   });

   test("fetchEmployees successfully loads employees", async () => {
    api.get.mockResolvedValue({
      data: employees,
    });

    const store = createTestStore();

    const result = await store.dispatch(fetchEmployees());

    expect(fetchEmployees.fulfilled.match(result)).toBe(true);

    expect(api.get).toHaveBeenCalledWith("/employees");

    expect(store.getState().employee.employees).toEqual(employees);

    expect(store.getState().employee.loading).toBe(false);

    expect(store.getState().employee.error).toBeNull();
   });

   test("fetchEmployees handles API error", async () => {
    api.get.mockRejectedValue(new Error("Network Error"));

    const store = createTestStore();

    const result = await store.dispatch(fetchEmployees());

    expect(fetchEmployees.rejected.match(result)).toBe(true);

    expect(store.getState().employee.loading).toBe(false);

    expect(store.getState().employee.error).toBe(
      "Failed to load employees."
    );

    expect(store.getState().employee.employees).toEqual([]);
   });

   test("addEmployee successfully adds an employee", async () => {
    const newEmployee = {
      name: "Alice",
      email: "alice@test.com",
      department: "IT",
      designation: "Cloud Engineer",
      salary: "80000",
      status: "Active",
    };

    const createdEmployee = {
      id: 3,
      ...newEmployee,
    };

    // Supabase returns the created row as an array
    api.post.mockResolvedValue({
      data: [createdEmployee],
    });

    const store = createTestStore();

    const result = await store.dispatch(addEmployee(newEmployee));

    expect(addEmployee.fulfilled.match(result)).toBe(true);

    expect(api.post).toHaveBeenCalledWith(
      "/employees",
      newEmployee,
      {
        headers: {
          Prefer: "return=representation",
        },
      }
    );

    expect(store.getState().employee.employees).toEqual([
      createdEmployee,
    ]);

    expect(store.getState().employee.loading).toBe(false);

    expect(store.getState().employee.error).toBeNull();
   });

   test("updateEmployee successfully updates an employee", async () => {
    const existingEmployee = {
      id: 1,
      name: "John Doe",
      email: "john@test.com",
      department: "IT",
      designation: "Frontend Developer",
      salary: 65000,
      status: "Active",
    };

    const updatedEmployee = {
      ...existingEmployee,
      name: "John Updated",
      salary: 70000,
    };

    const store = createTestStore();

    // Put existing employees into Redux state
    store.dispatch({
      type: "employee/setEmployees",
      payload: [
        existingEmployee,
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@test.com",
          department: "HR",
          designation: "HR Executive",
          salary: 50000,
          status: "Inactive",
        },
      ],
    });

    // Supabase returns the updated row as an array
    api.patch.mockResolvedValue({
      data: [updatedEmployee],
    });

    const result = await store.dispatch(
      updateEmployee({
        id: 1,
        employee: updatedEmployee,
      })
    );

    expect(updateEmployee.fulfilled.match(result)).toBe(true);

    expect(api.patch).toHaveBeenCalledWith(
      "/employees?id=eq.1",
      updatedEmployee,
      {
        headers: {
          Prefer: "return=representation",
        },
      }
    );

    expect(store.getState().employee.employees).toEqual([
      updatedEmployee,
      {
        id: 2,
        name: "Jane Smith",
        email: "jane@test.com",
        department: "HR",
        designation: "HR Executive",
        salary: 50000,
        status: "Inactive",
      },
    ]);

    expect(store.getState().employee.loading).toBe(false);

    expect(store.getState().employee.error).toBeNull();
   });

  test("deleteEmployee successfully removes an employee", async () => {
    const store = createTestStore();

    store.dispatch({
      type: "employee/setEmployees",
      payload: employees,
    });

    api.delete.mockResolvedValue({
      data: {},
    });

    const result = await store.dispatch(deleteEmployee(1));

    expect(deleteEmployee.fulfilled.match(result)).toBe(true);

    expect(api.delete).toHaveBeenCalledWith(
      "/employees?id=eq.1"
    );

    expect(store.getState().employee.employees).toEqual([
      employees[1],
    ]);

    expect(store.getState().employee.loading).toBe(false);

    expect(store.getState().employee.error).toBeNull();
  });
});