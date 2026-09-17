import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.VITE_SUPABASE_URL}/rest/v1`,
  headers: {
    apikey: process.env.VITE_SUPABASE_ANON_KEY,
    "Content-Type": "application/json",
  },
});

export default api;