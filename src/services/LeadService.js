import axios from "axios";

const API = "http://localhost:8080/api/leads";

const authHeader = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`
  };
};

export const getAllLeads = () =>
  axios.get(API, {
    headers: authHeader()
  });

export const getLeadById = (id) =>
  axios.get(`${API}/${id}`, {
    headers: authHeader()
  });

export const addLead = (lead) =>
  axios.post(API, lead, {
    headers: authHeader()
  });

export const updateLead = (id, lead) =>
  axios.put(`${API}/${id}`, lead, {
    headers: authHeader()
  });

export const deleteLead = (id) =>
  axios.delete(`${API}/${id}`, {
    headers: authHeader()
  });

  export const convertLeadToCustomer = (id) => {
  return axios.post(`${API_URL}/${id}/convert`);
};