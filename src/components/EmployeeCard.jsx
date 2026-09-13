export default function EmployeeCard({
  employee,
  onDelete,
  onEdit,
  onView,
}) {
  return (
    <tr>
      <td>{employee.name}</td>

      <td>{employee.email}</td>

      <td>{employee.department}</td>

      <td>{employee.designation}</td>

      <td>₹ {Number(employee.salary).toLocaleString("en-IN")}</td>

      <td>
        <span
          className={`status-badge ${
            employee.status.toLowerCase()
          }`}
        >
          {employee.status}
        </span>
      </td>

      <td>
        <button
          type="button"
          onClick={() => onView(employee.id)}
        >
          View
        </button>

        <button
          type="button"
          onClick={() => onEdit(employee.id)}
          style={{
            marginLeft: "8px",
          }}
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(employee.id)}
          style={{
            marginLeft: "8px",
            background: "crimson",
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}