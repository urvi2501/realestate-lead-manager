import axios from "axios";

const API = "http://localhost:8080/api/leads";

export const getAllLeads = () => axios.get(API);

export const getLeadById = (id) => axios.get(`${API}/${id}`);

export const addLead = (lead) => axios.post(API, lead);

export const updateLead = (id, lead) =>
  axios.put(`${API}/${id}`, lead);

export const deleteLead = (id) =>
  axios.delete(`${API}/${id}`);