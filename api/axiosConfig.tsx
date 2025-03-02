import axios from "axios";

const jwtToken = localStorage.getItem("jwtToken");

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
    // include cookies
    withCredentials: true,
    Authorization: `Bearer ${jwtToken}`,
  },
});

export default api;
