Employee Management System

A full-stack Employee Management System featuring both a **responsive React.js web application** and a **cross-platform React Native mobile application**.

The project is built using React.js, React Native, Redux Toolkit, Expo, Axios, Node.js, Express.js, and Supabase PostgreSQL.

It provides a complete employee management workflow with CRUD operations, dashboard analytics, search, filtering, sorting, pagination, REST API integration, form validation, and automated testing.

1. Project Overview

This project consists of two applications sharing a backend and database.

| Application        | Frontend                | Backend             | Database            |
|--------------------|-------------------------|---------------------|---------------------|
| Web Application    | React.js, Redux Toolkit | Node.js, Express.js | Supabase PostgreSQL |
| Mobile Application | React Native, Expo      | Node.js, Express.js | Supabase PostgreSQL |

Both applications communicate with the same backend through RESTful APIs, allowing employee records to be managed from web and mobile platforms.

Web Application 

Features

- View all employees
- Add new employees
- Edit existing employees
- View employee details
- Delete employees
- Form validation
- Active/Inactive employee status

Employee Listing

Search employees by:
  - Name
  - Email
  - Department
  - Designation
  - Salary

Sort employees by:
  - Name
  - Email
  - Department
  - Designation
  - Salary
  - Status
Pagination
Formatted salary display using Indian currency format
Status badges for Active and Inactive employees

Dashboard Analytics

The dashboard provides an overview of employee data:

- Total employees
- Active employees
- Inactive employees
- Number of departments
- Average salary
- Highest salary
- Latest employee
- Total salary
- Quick summary

User Experience

- Loading indicators
- API error handling
- Success and error toast notifications
- Delete confirmation
- Submit-state feedback
- Responsive layout
- Accessible form labels and controls

Mobile Application – React Native

A cross-platform mobile application developed using React Native and Expo.

Features

- View employee records
- Add new employees
- Edit employee details
- Delete employees
- Employee status management
- Form validation
- Duplicate email prevention

Employee Listing

- Search employees by name and email
- Filter employees by Active and Inactive status
- Display newest employees first
- Employee details displayed in cards
- Formatted salary display

Dashboard

- Total employee count
- Active and inactive employee statistics
- Department statistics
- Salary summaries
- Latest employee information

User Experience

- Interactive success popups
- Delete confirmation modal
- Delete success and error modals
- Form validation messages
- Loading indicators
- API error handling
- Navigation using Expo Router

Mobile Application Testing

The mobile application was tested using:

- Expo Go
- Chrome browser
- Android device

Verified functionality includes:

- Dashboard loading
- Employee listing and sorting
- Search and status filtering
- Adding employees
- Editing employee details
- Deleting employees
- Duplicate email validation
- Invalid email validation
- Required field validation
- Salary validation
- Success and confirmation popups

Tech Stack

Web Frontend

- React.js
- JavaScript (ES6+)
- HTML5
- CSS3
- React Router

Mobile Frontend

- React Native
- Expo
- Expo Router
- JavaScript

State Management

- Redux Toolkit
- Redux Async Thunks
- React Hooks

Backend

- Node.js
- Express.js
- RESTful APIs

API Integration

- Axios

Database

- Supabase
- PostgreSQL

Testing

- Jest
- React Testing Library
- Jest DOM
- User Event
- Playwright

Development Tools

- Vite
- Git
- GitHub
- Visual Studio Code
- Expo Go

 5. Project Architecture

The web and mobile applications communicate with a shared backend, which handles employee operations and database communication.

Architecture Diagram


             WEB APPLICATION
                    |
              React.js
                    |
             React Router
                    |
             Redux Toolkit
                    |
              Axios API
                    |
                    |
             MOBILE APPLICATION
                    |
              React Native
                    |
               Expo Router
                    |
                Axios API
                    |
                    |
             SHARED BACKEND
                    |
              Node.js
                    |
              Express.js
                    |
               REST APIs
                    |
                 Axios
                    |
                Supabase
                    |
              PostgreSQL


Request Flow

Web Application:

React Components → Redux Toolkit → Async Thunks → Axios → Express.js → Supabase → PostgreSQL

Mobile Application:

React Native Components → Expo Router → Axios → Express.js → Supabase → PostgreSQL

6. Project Folder Structure

The repository contains separate frontend and backend directories.


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
├── mobile/
│   ├── src/
│   │   ├── app/
│   │   │   ├── tabs/
│   │   │   │   ├── index.jsx
│   │   │   │   ├── explore.jsx
│   │   │   │   └── add.jsx
│   │   │   │
│   │   │   └── employees/
│   │   │       └── [id].jsx
│   │   │       └── layout.jsx
│   │   └── services/
│   │       └── api.js
│   │
│   └── package.json
│
├── .gitignore
├── babel.config.cjs
├── jest.config.cjs
├── package.json
├── vite.config.js
└── README.md

Redux State Management – Web Application

Employee collection data is managed using Redux Toolkit.

The employee slice manages:

- employees – Employee records
- loading – API request status
- error – API error information

CRUD operations are implemented using Redux Toolkit's createAsyncThunk:

- fetchEmployees
- addEmployee
- updateEmployee
- deleteEmployee

Each asynchronous operation handles pending, successful, and failed API responses.

This keeps API-related state transitions centralized and predictable.

8. API Integration

Axios is configured through a dedicated API service.

text
src/services/api.js


The React and React Native frontends communicate with the Node.js and Express.js backend through RESTful APIs.

 API Endpoints

| Operation       | Method | Endpoint             |
|-----------------|--------|----------------------|
| Get employees   | GET    | /api/employees       |
| Get employee    | GET    | /api/employees/:id   |
| Add employee    | POST   | /api/employees       |
| Update employee | PATCH  | /api/employees/:id   |
| Delete employee | DELETE | /api/employees/:id   |

9. Backend

The backend is implemented using Node.js and Express.js.

Responsibilities

- Handling REST API requests
- Defining employee CRUD routes
- Communicating with Supabase
- Returning API responses to frontend applications
- Handling API errors
- Managing environment-based configuration

The backend runs independently from both frontend applications.

10. Database

The project uses Supabase PostgreSQL with a table named:

employees

Database Schema

| Column      | Data Type |
|-------------|-----------|
| id          | int8      |
| name        | text      |
| email       | text      |
| department  | text      |
| designation | text      |
| salary      | numeric   | 
| status      | text      |

Row Level Security (RLS) is enabled for the table with policies configured for the application's demo CRUD workflow.

A unique database index is used to prevent duplicate email addresses.

**Security Note:** This project uses sample employee data for demonstration purposes. Public CRUD policies should not be used for production applications containing real employee information without appropriate authentication and authorization.

11. Testing

11.1 Web Application – Jest & React Testing Library

The test suite covers:

- Employee card rendering
- Employee listing
- Search functionality
- Employee filtering
- Sorting
- Pagination
- Add employee form
- Edit employee form
- User interactions
- Validation behavior

Redux Tests

The Redux async thunks are tested with mocked API requests.

Tested operations include:

- Fetch employees successfully
- Handle fetch API errors
- Add employee successfully
- Update employee successfully
- Delete employee successfully

Jest Test Results

Test Suites: 5 passed, 5 total
Tests:       20 passed, 20 total
Snapshots:   0 total

Run the test suite:

npm test

11.2 Web Application – Playwright

Playwright is used to automate browser-based testing.

Test Coverage

- Employee creation
- Employee updation
- Employee deletion
- Delete confirmation and cancellation
- Search functionality
- Employee sorting
- Pagination
- Employee API response validation

Run Playwright Tests

npx playwright test --project=chromium

Generate the HTML test report:

npx playwright show-report

Playwright Test Results

8 automated tests covering CRUD operations, search, sorting, pagination, and API functionality.

11.3 Mobile Application Testing

The React Native application was tested on an Android device using Expo Go.

Verified Functionality

- Dashboard
- Employee listing
- Employee sorting
- Search and filtering
- Add employee
- Edit employee
- Delete employee
- Form validation
- Duplicate email prevention
- Interactive modals

The mobile application's core workflows were also tested in Chrome.

12. Getting Started

Prerequisites

Make sure the following are installed:

- Node.js
- npm
- Git
- Supabase account
- Expo Go (for Android mobile testing)

Step 1: Clone the Repository

git clone <https://github.com/krishnendhu03/employee-management-system>

Step 2: Navigate to the Project

cd employee-management-system

Step 3: Install Web Application Dependencies

npm install

Step 4: Install Backend Dependencies

cd backend
npm install

Step 5: Configure Environment Variables
Create a .env file inside the backend directory:

backend/.env
Add your Supabase credentials:

SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

Do not commit actual environment variables or secret credentials to GitHub.

Step 6: Start the Backend

From the backend directory:

npm run dev

The Express API runs on the configured backend port.

For local development, the example API URL is:

http://localhost:5000

Step 7: Start the Web Application

Open another terminal in the project root:

npm run dev

The application will be available at the local Vite development URL displayed in the terminal.

Step 8: Start the Mobile Application

Open another terminal:

cd mobile
npm install

Start Expo:

npx expo start

Scan the QR code using Expo Go to run the application on an Android device.

For tunnel mode:

npx expo start --tunnel

Make sure the mobile API service is configured with a reachable backend URL.

Deployment

| Component       | Platform            |
|-----------------|---------------------|
| Web Application | GitHub Pages        |
| Backend API     | Render              |
| Database        | Supabase PostgreSQL |
| Mobile Testing  | Expo Go             |

The web and mobile applications use the shared backend API and Supabase database.

The mobile application has been tested through Expo Go. A standalone Android APK or Google Play Store release is not currently included.

14. Skills Demonstrated

This project demonstrates practical experience in:

- Component-based React development
- React Native development
- Expo and Expo Router
- React Hooks
- Functional components
- Redux Toolkit state management
- Redux asynchronous thunks
- Node.js backend development
- Express.js REST API development
- Frontend-backend separation
- REST API integration
- Axios API abstraction
- Supabase integration
- PostgreSQL database integration
- React Router navigation
- Controlled form components
- Client-side validation
- Search and filtering
- Sorting and pagination
- Loading and error states
- Reusable UI components
- Automated component testing
- Redux async thunk testing
- End-to-end browser testing
- Cross-platform mobile testing
- Responsive CSS
- Environment-based configuration
- Git-based development workflow

15. Production Build – Web Application

Create an optimized production build:

npm run build

Preview the production build locally:

npm run preview

16. Future Improvements

Possible future enhancements include:

- Authentication and role-based access control
- Employee profile images
- Department management
- Server-side pagination
- Server-side filtering and sorting
- Advanced form validation
- Push notifications for mobile
- CI/CD pipeline
- Production-grade authorization and database policies
- Application monitoring and error logging
- Standalone Android application build

- 17. Links

- [Live Demo](https://krishnendhu03.github.io/employee-management-system/)
- [GitHub Repository](https://github.com/krishnendhu03/employee-management-system)

18. Author

Developed as a full-stack web and mobile application project to demonstrate practical skills in React.js, React Native, Redux Toolkit, Expo, REST API integration, Node.js backend development, Supabase database operations, and automated testing.




