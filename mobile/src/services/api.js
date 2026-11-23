
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://employee-management-system-o7di.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
