import { useEffect, useState } from "react";
import {
  addCustomer,
  updateCustomer,
} from "../services/CustomerService";

function AddCustomer({ editingCustomer, onSave, onCancel }) {

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    propertyType: "",
    budget: "",
    status: "",
  });

  useEffect(() => {

    if (editingCustomer) {
      setCustomer({
        name: editingCustomer.name || "",
        phone: editingCustomer.phone || "",
        email: editingCustomer.email || "",
        address: editingCustomer.address || "",
        propertyType: editingCustomer.propertyType || "",
        budget: editingCustomer.budget || "",
        status: editingCustomer.status || "",
      });
    }

  }, [editingCustomer]);

  const handleChange = (e) => {

    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      if (editingCustomer) {

        await updateCustomer(
          editingCustomer.id,
          customer
        );

        alert("Customer updated successfully.");

      } else {

        await addCustomer(customer);

        alert("Customer added successfully.");

      }

      onSave();

    } catch (error) {

      console.error("Customer Save Error:", error);

      alert("Failed to save customer.");

    }
  };

  return (
    <div className="container mt-4">

      <h3 className="mb-4">
        {editingCustomer
          ? "✏️ Update Customer"
          : "➕ Add Customer"}
      </h3>

      <form onSubmit={handleSubmit}>

        <div className="row">

          {/* Name */}
          <div className="col-md-6 mb-3">

            <label className="form-label">
              Name
            </label>

            <input
              type="text"
              className="form-control"
              name="name"
              value={customer.name}
              onChange={handleChange}
              required
            />

          </div>

          {/* Phone */}
          <div className="col-md-6 mb-3">

            <label className="form-label">
              Phone
            </label>

            <input
              type="text"
              className="form-control"
              name="phone"
              value={customer.phone}
              onChange={handleChange}
              required
            />

          </div>

          {/* Email */}
          <div className="col-md-6 mb-3">

            <label className="form-label">
              Email
            </label>

            <input
              type="email"
              className="form-control"
              name="email"
              value={customer.email}
              onChange={handleChange}
            />

          </div>

          {/* Address */}
          <div className="col-md-6 mb-3">

            <label className="form-label">
              Address
            </label>

            <input
              type="text"
              className="form-control"
              name="address"
              value={customer.address}
              onChange={handleChange}
            />

          </div>

          {/* Property Type */}
          <div className="col-md-6 mb-3">

            <label className="form-label">
              Property Type
            </label>

            <select
              className="form-select"
              name="propertyType"
              value={customer.propertyType}
              onChange={handleChange}
            >

              <option value="">Select</option>
              <option value="Flat">Flat</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Commercial">Commercial</option>

            </select>

          </div>

          {/* Budget */}
          <div className="col-md-6 mb-3">

            <label className="form-label">
              Budget
            </label>

            <input
              type="number"
              className="form-control"
              name="budget"
              value={customer.budget}
              onChange={handleChange}
            />

          </div>

          {/* Status */}
          <div className="col-md-6 mb-3">

            <label className="form-label">
              Status
            </label>

            <select
              className="form-select"
              name="status"
              value={customer.status}
              onChange={handleChange}
            >

              <option value="">Select</option>
              <option value="Active">Active</option>
              <option value="Interested">Interested</option>
              <option value="Converted">Converted</option>
              <option value="Inactive">Inactive</option>

            </select>

          </div>

        </div>

        <button
          type="submit"
          className="btn btn-primary me-2"
        >
          {editingCustomer
            ? "Update Customer"
            : "Save Customer"}
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>

      </form>

    </div>
  );
}

export default AddCustomer;