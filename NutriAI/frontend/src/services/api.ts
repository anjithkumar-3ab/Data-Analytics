import axios from "axios";
import { API_BASE_URL, API_TIMEOUT } from "../constants";

/** Pre-configured Axios instance pointing at the NutriAI backend. */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: { "Content-Type": "application/json" },
});

export default api;
