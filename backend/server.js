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
    const employee = req.body;

    const { data, error } = await supabase
      .from("employees")
      .insert([employee])
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
    const updates = req.body;

    const { data, error } = await supabase
      .from("employees")
      .update(updates)
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