import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api";

// Fetch all employees
export const fetchEmployees = createAsyncThunk(
  "employee/fetchEmployees",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/employees");
      return response.data;
    } catch (error) {
      console.error("Fetch employees error:", error);
      return rejectWithValue("Failed to load employees.");
    }
  }
);

// Add employee
export const addEmployee = createAsyncThunk(
  "employee/addEmployee",
  async (employee, { rejectWithValue }) => {
    try {
      const response = await api.post("/employees", employee, {
        headers: {
          Prefer: "return=representation",
        },
      });

      return response.data[0];
    } catch (error) {
      console.error("Add employee error:", error);
      return rejectWithValue("Failed to add employee.");
    }
  }
);

// Update employee
export const updateEmployee = createAsyncThunk(
  "employee/updateEmployee",
  async ({ id, employee }, { rejectWithValue }) => {
    try {
      const response = await api.patch(
        `/employees?id=eq.${id}`,
        employee,
        {
          headers: {
            Prefer: "return=representation",
          },
        }
      );

      return response.data[0];
    } catch (error) {
      console.error("Update employee error:", error);
      return rejectWithValue("Failed to update employee.");
    }
  }
);

// Delete employee
export const deleteEmployee = createAsyncThunk(
  "employee/deleteEmployee",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/employees?id=eq.${id}`);
      return id;
    } catch (error) {
      console.error("Delete employee error:", error);
      return rejectWithValue("Failed to delete employee.");
    }
  }
);

const initialState = {
  employees: [],
  loading: false,
  error: null,
};

const employeeSlice = createSlice({
  name: "employee",
  initialState,

  reducers: {
    setEmployees: (state, action) => {
      state.employees = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add
      .addCase(addEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.push(action.payload);
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.employees.findIndex(
          (employee) => employee.id === action.payload.id
        );

        if (index !== -1) {
          state.employees[index] = action.payload;
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;

        state.employees = state.employees.filter(
          (employee) => employee.id !== action.payload
        );
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setEmployees } = employeeSlice.actions;

export default employeeSlice.reducer;