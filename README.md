1. Employee Management System

A responsive Employee Management System built with React.js and Redux Toolkit. The application provides a complete employee CRUD workflow with search, filtering, sorting, pagination, dashboard analytics, API integration, loading states, error handling, and automated testing.

2. Features
Employee Management

- View all employees
- Add new employees
- Edit existing employees
- View employee details
- Delete employees
- Form validation
- Active/Inactive employee status

3. Employee Listing

- Search employees by:
  - Name
  - Email
  - Department
  - Designation
  - Salary
- Filter by employee status
- Sort by:
  - Name
  - Email
  - Department
  - Designation
  - Salary
  - Status
- Pagination
- Formatted salary display using Indian currency format
- Status badges for Active and Inactive employees

4. Dashboard

The dashboard provides an overview of employee data:

- Total employees
- Active employees
- Inactive employees
- Number of departments
- Average salary
- Highest salary
- Latest employee
- Quick summary
- Total salary

5. User Experience

- Loading indicators
- API error handling
- Success and error toast notifications
- Delete confirmation
- Submit-state feedback
- Responsive layout
- Accessible form labels and controls

6. Tech Stack

  Frontend

- React.js
- JavaScript (ES6+)
- HTML5
- CSS3
- React Router

  State Management

- Redux Toolkit
- Redux Async Thunks

  API & Data

- Axios
- JSON Server
- REST API integration

  Testing

- Jest
- React Testing Library
- Jest DOM
- User Event

  Development Tools

- Vite
- Git
- GitHub
- VS Code

7. Project Architecture

The application follows a component-based architecture with centralized state management and a dedicated API service.

React Components
       |
       v
React Router
       |
       v
Redux Toolkit
       |
       v
Async Thunks
       |
       v
Axios API Service
       |
       v
REST API
       |
       v
JSON Server

8. Folder Structure
employee-management-system/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── EmployeeCard.jsx
│   │   ├── Loader.jsx
│   │   ├── Navbar.jsx
│   │   └── SearchBar.jsx
│   │
│   ├── pages/
│   │   ├── AddEmployee.jsx
│   │   ├── Dashboard.jsx
│   │   ├── EditEmployee.jsx
│   │   ├── Employees.jsx
│   │   └── ViewEmployee.jsx
│   │
│   ├── redux/
│   │   ├── employeeSlice.js
│   │   └── store.js
│   │
│   ├── services/
│   │   └── api.js
│   │
│   ├── tests/
│   │   ├── AddEmployee.test.jsx
│   │   ├── EditEmployee.test.jsx
│   │   ├── EmployeeCard.test.jsx
│   │   ├── Employees.test.jsx
│   │   └── employeeSlice.test.js
│   │
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── setupTests.js
│
├── db.json
├── babel.config.cjs
├── jest.config.cjs
├── package.json
├── vite.config.js
└── README.md

9. Redux State Management

Employee collection data is managed using Redux Toolkit.

The employee slice manages:

employees
loading
error

CRUD operations are implemented using Redux Toolkit's createAsyncThunk:

fetchEmployees
addEmployee
updateEmployee
deleteEmployee

Each asynchronous operation handles:

Pending state
Successful response
API failure
Loading state
Error state

This keeps API-related state transitions centralized and predictable.

10. API Integration

Axios is configured through a dedicated API service:

src/services/api.js

The application communicates with the following REST endpoints:

GET    /employees
POST   /employees
PUT    /employees/:id
DELETE /employees/:id
GET    /employees/:id

JSON Server is used as a lightweight mock REST API for development and demonstration purposes.

11. Testing

The project includes automated tests using Jest and React Testing Library.

Current test coverage includes:

Component Tests
Employee card rendering
Employee listing
Search functionality
Employee filtering
Sorting
Pagination
Add employee form
Edit employee form
User interactions
Validation behavior
Redux Tests

The Redux async thunks are tested with mocked API requests.

Tested operations include:

Fetch employees successfully
Handle fetch API errors
Add employee successfully
Update employee successfully
Delete employee successfully

Test Result
Test Suites: 5 passed, 5 total
Tests:       20 passed, 20 total

Run the test suite with:

npm test

12. Getting Started

Prerequisites
Make sure the following are installed:

Node.js
npm
 1. Clone the repository
    
 2. Navigate to the project
    cd employee-management-system
 3. Install dependencies
    npm install
 4. Start JSON Server

Open a terminal and run:

npx json-server --watch db.json --port 3001

On Windows PowerShell, if npx execution is restricted, use:

npx.cmd json-server --watch db.json --port 3001

The API will run at:

http://localhost:3001
5. Start the React application

Open another terminal and run:

npm run dev

The application will be available at the local Vite development URL shown in the terminal.

Application Routes
Route	Description
/	Dashboard
/employees	Employee listing
/add	Add employee
/edit/:id	Edit employee
/view/:id	View employee details
Key Engineering Practices

13. This project demonstrates:

Component-based React development
React Hooks
Functional components
Redux Toolkit state management
Redux asynchronous thunks
REST API integration
Axios API abstraction
React Router navigation
Controlled form components
Client-side validation
Search and filtering
Sorting and pagination
Loading and error states
Reusable UI components
Automated component testing
Redux async thunk testing
Responsive CSS
Git-based development workflow
Future Improvements

14. Possible future enhancements include:

Authentication and role-based access
Backend API using Spring Boot or Node.js
Relational database integration
Server-side pagination
Server-side filtering and sorting
Employee profile images
Department management
Advanced form validation
CI/CD pipeline
Production deployment with a real backend

Built as a portfolio project demonstrating modern React development, state management, REST API integration, responsive UI development, and automated testing.

