import axios from "axios";

const API = "http://localhost:8080/api/customers";

export const getAllCustomers = () => {
  const token = localStorage.getItem("token");

  return axios.get(API, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCustomerById = (id) => {
  const token = localStorage.getItem("token");

  return axios.get(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addCustomer = (customer) => {
  const token = localStorage.getItem("token");

  return axios.post(API, customer, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateCustomer = (id, customer) => {
  const token = localStorage.getItem("token");

  return axios.put(`${API}/${id}`, customer, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteCustomer = (id) => {
  const token = localStorage.getItem("token");

  return axios.delete(`${API}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};