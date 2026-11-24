import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.get("/", (req, res) => {
  res.json({
    message: "Employee Management API is running",
  });
});

// Get all employees
app.get("/api/employees", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("employees")
      .select("*");

    if (error) {
      return res.status(500).json({
        message: "Failed to fetch employees",
        error: error.message,
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});
// Get employee by ID
app.get("/api/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({
        message: "Employee not found",
        error: error.message,
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Add employee
app.post("/api/employees", async (req, res) => {
  try {
    console.log("POST ROUTE HIT:", req.body.email);
    const employee = req.body;

    // Normalize email
    const email = employee.email?.trim().toLowerCase();

    // Validate required fields
    if (
      !employee.name?.trim() ||
      !email ||
      !employee.department?.trim() ||
      !employee.designation?.trim() ||
      employee.salary === undefined ||
      employee.salary === null
    ) {
      return res.status(400).json({
        message: "Validation failed",
        error: "Please provide all required fields.",
      });
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return res.status(400).json({
        message: "Invalid email",
        error: "Please enter a valid email address.",
      });
    }

    // Validate salary
    if (
      !/^\d+$/.test(String(employee.salary)) ||
      Number(employee.salary) <= 0
    ) {
      return res.status(400).json({
        message: "Invalid salary",
        error: "Salary must be a positive whole number.",
      });
    }

    // Check whether email already exists
console.log("Checking duplicate email:", email);


const { data: existingEmployee, error: checkError } =
  await supabase
    .from("employees")
    .select("id, email")
    .ilike("email", email)
    .limit(1)
    .maybeSingle();


console.log("Existing employee:", existingEmployee);
console.log("Duplicate check error:", checkError);

    if (checkError) {
      return res.status(500).json({
        message: "Database error",
        error: checkError.message,
      });
    }

    if (existingEmployee) {
      return res.status(409).json({
        message: "Duplicate employee",
        error: "An employee with this email already exists.",
      });
    }

    // Insert employee
    const employeeData = {
      name: employee.name.trim(),
      email,
      department: employee.department.trim(),
      designation: employee.designation.trim(),
      salary: Number(employee.salary),
      status: employee.status || "Active",
    };

    const { data, error } = await supabase
      .from("employees")
      .insert([employeeData])
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        message: "Failed to add employee",
        error: error.message,
      });
    }

    res.status(201).json(data);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

 // Update employee
app.patch("/api/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const employee = req.body;

    // Normalize email
    const email = employee.email?.trim().toLowerCase();

    // Validate required fields
    if (
      !employee.name?.trim() ||
      !email ||
      !employee.department?.trim() ||
      !employee.designation?.trim() ||
      employee.salary === undefined ||
      employee.salary === null
    ) {
      return res.status(400).json({
        message: "Validation failed",
        error: "Please provide all required fields.",
      });
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return res.status(400).json({
        message: "Invalid email",
        error: "Please enter a valid email address.",
      });
    }

    // Validate salary
    if (
      !/^\d+$/.test(String(employee.salary)) ||
      Number(employee.salary) <= 0
    ) {
      return res.status(400).json({
        message: "Invalid salary",
        error: "Salary must be a positive whole number.",
      });
    }

    // Check whether another employee uses this email
    const { data: existingEmployee, error: checkError } =
      await supabase
        .from("employees")
        .select("id, email")
        .ilike("email", email)
        .neq("id", id)
        .limit(1)
        .maybeSingle();

    if (checkError) {
      return res.status(500).json({
        message: "Database error",
        error: checkError.message,
      });
    }

    if (existingEmployee) {
      return res.status(409).json({
        message: "Duplicate employee",
        error: "An employee with this email already exists.",
      });
    }

    // Prepare updated employee data
    const employeeData = {
      name: employee.name.trim(),
      email,
      department: employee.department.trim(),
      designation: employee.designation.trim(),
      salary: Number(employee.salary),
      status: employee.status || "Active",
    };

    // Update employee in Supabase
    const { data, error } = await supabase
      .from("employees")
      .update(employeeData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        message: "Failed to update employee",
        error: error.message,
      });
    }

    res.json(data);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Delete employee
app.delete("/api/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("employees")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(400).json({
        message: "Failed to delete employee",
        error: error.message,
      });
    }

    res.json({
      message: "Employee deleted successfully",
      id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});