Employee Management System

A responsive full-stack Employee Management System built with React.js, Redux Toolkit, Axios, Node.js, Express.js, and Supabase PostgreSQL. The application provides a complete employee CRUD workflow with search, filtering, sorting, pagination, dashboard analytics, REST API integration, loading states, error handling, and automated testing.

1. Features

Employee Management

- View all employees
- Add new employees
- Edit existing employees
- View employee details
- Delete employees
- Form validation
- Active/Inactive employee status

Employee Listing

- Search employees by:
  - Name
  - Email
  - Department
  - Designation
  - Salary

 Filter by employee status
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

2. Dashboard

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

3. User Experience

- Loading indicators
- API error handling
- Success and error toast notifications
- Delete confirmation
- Submit-state feedback
- Responsive layout
- Accessible form labels and controls

4. Tech Stack

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
- Node.js
- Express.js
- RESTful APIs
- Supabase
- PostgreSQL

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

5. Project Architecture

The application follows a component-based architecture with centralized state management, a dedicated Axios API service, and a Node.js/Express.js backend for RESTful API operations.


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
Node.js + Express.js 
       |
       v
   Supabase 
       |
       v
PostgreSQL Database

6. Folder Structure

employee-management-system/
│
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   └── server.js
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
├── .gitignore
├── babel.config.cjs
├── jest.config.cjs
├── package.json
├── vite.config.js
└── README.md

7. Redux State Management

Employee collection data is managed using Redux Toolkit.

The employee slice manages:

employees
loading
error

8. CRUD operations are implemented using Redux Toolkit's createAsyncThunk:

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

9. API Integration

Axios is configured through a dedicated API service:

src/services/api.js

The React frontend communicates with the Node.js and Express.js backend through RESTful APIs.

The Express backend handles employee CRUD operations and communicates with Supabase for persistent PostgreSQL data storage.

| Operation       | Method | Endpoint                  |
|-----------------|--------|---------------------------|
| Get employees   | GET    | /api/employees            |
| Get employee    | GET    | /api/employees/:id        |
| Add employee    | POST   | /api/employees            |
| Update employee | PATCH  | /api/employees/:id        |
| Delete employee | DELETE | /api/employees/:id        |

Request flow:

React → Redux Toolkit → Axios → Express.js → Supabase → PostgreSQL

10. Backend

The backend is implemented using Node.js and Express.js.

Responsibilities include:

- Handling REST API requests
- Defining employee CRUD routes
- Communicating with Supabase
- Returning API responses to the React frontend
- Handling API errors
- Managing environment-based configuration

Backend API endpoints:

GET    /api/employees
GET    /api/employees/:id
POST   /api/employees
PATCH  /api/employees/:id
DELETE /api/employees/:id

The backend runs independently from the React development server.

11. Database

The application uses a Supabase PostgreSQL table named:

employees

The table contains:

| Column      | Type    |
|-------------|---------|
| id          | int8    |
| name        | text    |
| email       | text    |
| department  | text    |
| designation | text    |
| salary      | numeric |
| status      | text    |

Row Level Security (RLS) is enabled for the table with policies configured for the application's demo CRUD workflow.

This project uses sample employee data for demonstration purposes. Public CRUD policies should not be used for production applications containing real employee information without appropriate authentication and authorization.

12. Testing

The project includes automated tests using Jest and React Testing Library.
Component Tests

The test suite covers:

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
Snapshots:   0 total

Run the test suite with:

npm test

13. Getting Started

Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git

1. Clone the repository

git clone <https://github.com/krishnendhu03/employee-management-system>

2. Navigate to the project

cd employee-management-system

3. Install frontend dependencies

npm install

4. Install backend dependencies

cd backend
npm install

5. Configure backend environment variables

Create a .env file inside the backend directory:

backend/.env

Add:

SUPABASE_URL=supabase_project_url
SUPABASE_ANON_KEY=supabase_publishable_key

Do not commit the actual .env file to GitHub.

6. Start the backend

From the backend directory:

npm run dev

The Express API runs on:

http://localhost:5000

7. Start the frontend

Open another terminal in the project root:

npm run dev

The application will be available at the local Vite development URL shown in the terminal.


14. This project demonstrates:

Component-based React development
React Hooks
Functional components
Redux Toolkit state management
Redux asynchronous thunks
Node.js backend development
Express.js REST API development
Frontend-backend separation
REST API integration
Axios API abstraction
Supabase integration
PostgreSQL database integration
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
Environment-based configuration
Git-based development workflow

15. Production Build

Create a production build with:

npm run build

Preview the production build locally with:

npm run preview

16. Future Improvements

Possible future enhancements include:

Authentication and role-based access control
Server-side pagination
Server-side filtering and sorting
Employee profile images
Department management
Advanced form validation
CI/CD pipeline
Production-grade authorization and database policies
Application monitoring and error logging
Production deployment

17. Links

- [Live Demo](https://krishnendhu03.github.io/employee-management-system/)
- [GitHub Repository](https://github.com/krishnendhu03/employee-management-system)