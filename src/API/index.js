import axios from "./axios";

export const setToken = () => {
  const token = JSON.parse(localStorage.getItem("auth")) || "";
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export const signUp = () => {
  
}