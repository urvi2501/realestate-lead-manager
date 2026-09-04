import axios from "axios";

const API_URL = "https://realestate-lead-manager-backend-production.up.railway.app/api/templates";

export const getAllTemplates = async () => {
  const token = localStorage.getItem("token");

  return await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addTemplate = async (template) => {
  const token = localStorage.getItem("token");

  return await axios.post(API_URL, template, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateTemplate = async (id, template) => {
  const token = localStorage.getItem("token");

  return await axios.put(`${API_URL}/${id}`, template, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteTemplate = async (id) => {
  const token = localStorage.getItem("token");

  return await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
