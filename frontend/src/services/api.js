import axios from "axios";

const API = "http://localhost:5000/api";

export const sendContactMessage = async (formData) => {
  return axios.post(`${API}/contact`, formData);
};