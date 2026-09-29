import React, { useEffect, useState } from "react";
import {
  addCustomer,
  updateCustomer,
} from "../services/CustomerService";

const emptyCustomer = {
  name: "",
  phone: "",
  email: "",
  address: "",
  enquiryDateTime: "",
  purpose: "",
  category: "",
  propertyType: "",
  otherPropertyType: "",
  carpetArea: "",
  builtUpArea: "",
  superBuiltUpArea: "",
  budget: "",
  location: "",
  leadSource: "",
  status: "",
  additionalInformation: "",
};

function AddCustomer({
  editingCustomer,
  onSaved,
  onCancel,
}) {
  const [customer, setCustomer] = useState({
    ...emptyCustomer,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingCustomer) {
      setCustomer({
        ...emptyCustomer,
        ...editingCustomer,
      });
    } else {
      setCustomer({
        ...emptyCustomer,
      });
    }
  }, [editingCustomer]);

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;

    setCustomer((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;

    setCustomer((previous) => ({
      ...previous,
      category: value,
      propertyType: "",
      otherPropertyType: "",
    }));
  };

  const handleSubmitCustomer = async (e) => {
    e.preventDefault();

    if (!customer.name.trim()) {
      alert("Please enter customer name.");
      return;
    }

    if (!customer.phone.trim()) {
      alert("Please enter customer phone.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...customer,

        budget:
          customer.budget === ""
            ? null
            : Number(customer.budget),

        carpetArea:
          customer.carpetArea === ""
            ? null
            : Number(customer.carpetArea),

        builtUpArea:
          customer.builtUpArea === ""
            ? null
            : Number(customer.builtUpArea),

        superBuiltUpArea:
          customer.superBuiltUpArea === ""
            ? null
            : Number(customer.superBuiltUpArea),
      };

      if (editingCustomer?.id) {
        await updateCustomer(
          editingCustomer.id,
          payload
        );

        alert("Customer updated successfully.");
      } else {
        await addCustomer(payload);

        alert("Customer added successfully.");
      }

      if (onSaved) {
        onSaved();
      }

    } catch (error) {
      console.error(
        "Customer save error:",
        error
      );

      alert(
        error?.response?.data?.message ||
        "Failed to save customer."
      );

    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setCustomer({
      ...emptyCustomer,
    });

    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h3 className="fw-bold mb-1">
              {editingCustomer
                ? "✏️ Update Customer"
                : "➕ Add New Customer"}
            </h3>

            <small className="text-muted">
              Manage customer details and property requirements
            </small>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            ← Back to Customers
          </button>

        </div>

        <form onSubmit={handleSubmitCustomer}>

          {/* CUSTOMER INFORMATION */}
          <h5 className="fw-bold mb-3">
            👤 Customer Information
          </h5>

          <div className="row">

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Name
              </label>

              <input
                type="text"
                className="form-control"
                name="name"
                value={customer.name}
                onChange={handleCustomerChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Phone
              </label>

              <input
                type="text"
                className="form-control"
                name="phone"
                value={customer.phone}
                onChange={handleCustomerChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Email
              </label>

              <input
                type="email"
                className="form-control"
                name="email"
                value={customer.email}
                onChange={handleCustomerChange}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">
                Enquiry Date & Time
              </label>

              <input
                type="datetime-local"
                className="form-control"
                name="enquiryDateTime"
                value={customer.enquiryDateTime}
                onChange={handleCustomerChange}
              />
            </div>

            <div className="col-md-12 mb-3">
              <label className="form-label">
                Address
              </label>

              <input
                type="text"
                className="form-control"
                name="address"
                value={customer.address}
                onChange={handleCustomerChange}
                placeholder="Enter customer address"
              />
            </div>

          </div>

          <hr />

          {/* PROPERTY REQUIREMENT */}
          <h5 className="fw-bold mb-3">
            🏠 Property Requirement
          </h5>

          <div className="row">

            {/* PURPOSE */}
            <div className="col-md-6 mb-3">

              <label className="form-label">
                Property Purpose
              </label>

              <select
                className="form-select"
                name="purpose"
                value={customer.purpose}
                onChange={handleCustomerChange}
              >
                <option value="">
                  Select
                </option>

                <option value="Sell">
                  Sell
                </option>

                <option value="Rent">
                  Rent
                </option>
              </select>

            </div>

            {/* CATEGORY */}
            <div className="col-md-6 mb-3">

              <label className="form-label">
                Property Category
              </label>

              <select
                className="form-select"
                name="category"
                value={customer.category}
                onChange={handleCategoryChange}
              >
                <option value="">
                  Select
                </option>

                <option value="Residential">
                  Residential
                </option>

                <option value="Commercial">
                  Commercial
                </option>
              </select>

            </div>

            {/* RESIDENTIAL TYPE */}
            {customer.category === "Residential" && (
              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Residential Property Type
                </label>

                <select
                  className="form-select"
                  name="propertyType"
                  value={customer.propertyType}
                  onChange={handleCustomerChange}
                >
                  <option value="">
                    Select
                  </option>

                  <option value="Flat / Apartment">
                    Flat / Apartment
                  </option>

                  <option value="Bungalow / House">
                    Bungalow / House
                  </option>

                  <option value="Villa">
                    Villa
                  </option>

                  <option value="Builder Floor">
                    Builder Floor
                  </option>

                  <option value="1 RK / Studio">
                    1 RK / Studio
                  </option>

                  <option value="Plot">
                    Plot
                  </option>

                  <option value="Farmhouse">
                    Farmhouse
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>
            )}

            {/* COMMERCIAL TYPE */}
            {customer.category === "Commercial" && (
              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Commercial Property Type
                </label>

                <select
                  className="form-select"
                  name="propertyType"
                  value={customer.propertyType}
                  onChange={handleCustomerChange}
                >
                  <option value="">
                    Select
                  </option>

                  <option value="Shop / Showroom">
                    Shop / Showroom
                  </option>

                  <option value="Hotel / Restaurant">
                    Hotel / Restaurant
                  </option>

                  <option value="Office">
                    Office
                  </option>

                  <option value="Warehouse / Storage">
                    Warehouse / Storage
                  </option>

                  <option value="Industrial">
                    Industrial
                  </option>

                  <option value="Plot">
                    Plot
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>
            )}

            {/* OTHER PROPERTY TYPE */}
            {customer.propertyType === "Other" && (
              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Specify Property Type
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="otherPropertyType"
                  value={customer.otherPropertyType}
                  onChange={handleCustomerChange}
                  placeholder="Enter property type"
                />

              </div>
            )}

          </div>

          <hr />

          {/* AREA + BUDGET */}
          <h5 className="fw-bold mb-3">
            📐 Area & Budget
          </h5>

          <div className="row">

            <div className="col-md-4 mb-3">

              <label className="form-label">
                Carpet Area (sq.ft)
              </label>

              <input
                type="number"
                className="form-control"
                name="carpetArea"
                value={customer.carpetArea}
                onChange={handleCustomerChange}
              />

            </div>

            <div className="col-md-4 mb-3">

              <label className="form-label">
                Built-up Area (sq.ft)
              </label>

              <input
                type="number"
                className="form-control"
                name="builtUpArea"
                value={customer.builtUpArea}
                onChange={handleCustomerChange}
              />

            </div>

            <div className="col-md-4 mb-3">

              <label className="form-label">
                Super Built-up Area (sq.ft)
              </label>

              <input
                type="number"
                className="form-control"
                name="superBuiltUpArea"
                value={customer.superBuiltUpArea}
                onChange={handleCustomerChange}
              />

            </div>

            <div className="col-md-6 mb-3">

              <label className="form-label">
                Budget
              </label>

              <input
                type="number"
                className="form-control"
                name="budget"
                value={customer.budget}
                onChange={handleCustomerChange}
              />

            </div>

            <div className="col-md-6 mb-3">

              <label className="form-label">
                Location
              </label>

              <input
                type="text"
                className="form-control"
                name="location"
                value={customer.location}
                onChange={handleCustomerChange}
                placeholder="Enter location"
              />

            </div>

          </div>

          <hr />

          {/* CUSTOMER TRACKING */}
          <h5 className="fw-bold mb-3">
            📌 Customer Tracking
          </h5>

          <div className="row">

            <div className="col-md-6 mb-3">

              <label className="form-label">
                Lead Source
              </label>

              <select
                className="form-select"
                name="leadSource"
                value={customer.leadSource}
                onChange={handleCustomerChange}
              >
                <option value="">
                  Select
                </option>

                <option value="Website">
                  Website
                </option>

                <option value="Facebook">
                  Facebook
                </option>

                <option value="Instagram">
                  Instagram
                </option>

                <option value="99acres">
                  99acres
                </option>

                <option value="Referral">
                  Referral
                </option>

                <option value="Walk-in">
                  Walk-in
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

            <div className="col-md-6 mb-3">

              <label className="form-label">
                Customer Status
              </label>

              <select
                className="form-select"
                name="status"
                value={customer.status}
                onChange={handleCustomerChange}
              >
                <option value="">
                  Select
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Interested">
                  Interested
                </option>

                <option value="Deal In Progress">
                  Deal In Progress
                </option>

                <option value="Deal Finalized">
                  Deal Finalized
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>

          </div>

          <hr />

          {/* ADDITIONAL INFORMATION */}
          <h5 className="fw-bold mb-3">
            📝 Additional Information
          </h5>

          <div className="mb-3">

            <label className="form-label">
              Additional Information
            </label>

            <textarea
              className="form-control"
              rows="4"
              name="additionalInformation"
              value={customer.additionalInformation}
              onChange={handleCustomerChange}
              placeholder="Add any additional requirements, preferences or notes..."
            />

          </div>

          {/* BUTTONS */}
          <div className="mt-4">

            <button
              type="submit"
              className="btn btn-success me-2"
              disabled={saving}
            >
              💾{" "}
              {saving
                ? "Saving..."
                : editingCustomer
                ? "Update Customer"
                : "Save Customer"}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default AddCustomer;