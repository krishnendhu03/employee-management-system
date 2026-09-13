import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";
import EditEmployee from "./pages/EditEmployee";
import ViewEmployee from "./pages/ViewEmployee";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/employees" element={<Employees />} />
      <Route path="/add" element={<AddEmployee />} />
      <Route path="/edit/:id" element={<EditEmployee />} />
      <Route path="/view/:id" element={<ViewEmployee />} />
    </Routes>
  );
}

export default App;