import React, { useEffect, useMemo, useState } from "react";
import {
  getAllCustomers,
  deleteCustomer,
} from "../services/CustomerService";
import AddCustomer from "./AddCustomer";

function CustomerList({ onBackToDashboard }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [purposeFilter, setPurposeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [currentCustomerPage, setCurrentCustomerPage] = useState(1);

  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  const customersPerPage = 5;

  // =========================================================
  // LOAD CUSTOMERS
  // =========================================================

 const loadCustomers = async () => {
  try {
    setLoading(true);

    const response = await getAllCustomers();

    const data = response.data || [];

    console.log("Customer List API:", data);

    setCustomers(Array.isArray(data) ? data : []);

  } catch (error) {
    console.error("Error loading customers:", error);

    alert(
      error?.response?.data?.message ||
        "Failed to load customers."
    );
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  const timer = setTimeout(() => {
    loadCustomers();
  }, 0);

  return () => clearTimeout(timer);
}, []);

  // =========================================================
  // DELETE CUSTOMER
  // =========================================================

  const handleDeleteCustomer = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCustomer(id);

      alert("Customer deleted successfully.");

      await loadCustomers();

    } catch (error) {
      console.error(
        "Error deleting customer:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to delete customer."
      );
    }
  };

  // =========================================================
  // EDIT CUSTOMER
  // =========================================================

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setShowCustomerForm(true);
  };

  // =========================================================
  // ADD CUSTOMER
  // =========================================================

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setShowCustomerForm(true);
  };

  // =========================================================
  // AFTER SAVE / UPDATE
  // =========================================================

  const handleCustomerSaved = async () => {
    setShowCustomerForm(false);
    setEditingCustomer(null);

    await loadCustomers();
  };

  // =========================================================
  // CANCEL FORM
  // =========================================================

  const handleCustomerCancel = () => {
    setShowCustomerForm(false);
    setEditingCustomer(null);
  };

  // =========================================================
  // FILTER CUSTOMERS
  // =========================================================

  const filteredCustomers = useMemo(() => {
    const searchValue = search
      .trim()
      .toLowerCase();

    return customers.filter((customer) => {

      const matchesSearch =
        !searchValue ||
        customer.name
          ?.toLowerCase()
          .includes(searchValue) ||
        customer.phone
          ?.toLowerCase()
          .includes(searchValue) ||
        customer.email
          ?.toLowerCase()
          .includes(searchValue) ||
        customer.location
          ?.toLowerCase()
          .includes(searchValue);

      const matchesPurpose =
        !purposeFilter ||
        customer.purpose === purposeFilter;

      const matchesCategory =
        !categoryFilter ||
        customer.category === categoryFilter;

      const matchesStatus =
        !statusFilter ||
        customer.status === statusFilter;

      return (
        matchesSearch &&
        matchesPurpose &&
        matchesCategory &&
        matchesStatus
      );
    });

  }, [
    customers,
    search,
    purposeFilter,
    categoryFilter,
    statusFilter,
  ]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalCustomerPages = Math.max(
    1,
    Math.ceil(
      filteredCustomers.length /
        customersPerPage
    )
  );

  const startIndex =
    (currentCustomerPage - 1) *
    customersPerPage;

  const currentCustomers =
    filteredCustomers.slice(
      startIndex,
      startIndex + customersPerPage
    );

  // Reset page when filters change
  useEffect(() => {
    setCurrentCustomerPage(1);
  }, [
    search,
    purposeFilter,
    categoryFilter,
    statusFilter,
  ]);

  // =========================================================
  // DOWNLOAD CUSTOMERS
  // =========================================================

  const handleDownloadCustomers = () => {

    if (filteredCustomers.length === 0) {
      alert("No customer data available to download.");
      return;
    }

    const headers = [
      "ID",
      "Name",
      "Phone",
      "Email",
      "Purpose",
      "Category",
      "Property Type",
      "Other Property Type",
      "Location",
      "Budget",
      "Carpet Area",
      "Built-up Area",
      "Super Built-up Area",
      "Lead Source",
      "Status",
      "Enquiry Date & Time",
      "Address",
      "Additional Information",
    ];

    const rows = filteredCustomers.map(
      (customer) => [
        customer.id ?? "",
        customer.name ?? "",
        customer.phone ?? "",
        customer.email ?? "",
        customer.purpose ?? "",
        customer.category ?? "",
        customer.propertyType ?? "",
        customer.otherPropertyType ?? "",
        customer.location ?? "",
        customer.budget ?? "",
        customer.carpetArea ?? "",
        customer.builtUpArea ?? "",
        customer.superBuiltUpArea ?? "",
        customer.leadSource ?? "",
        customer.status ?? "",
        customer.enquiryDateTime ?? "",
        customer.address ?? "",
        customer.additionalInformation ?? "",
      ]
    );

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) => {
            const text = String(value);
            return `"${text.replace(/"/g, '""')}"`;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "customers.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =========================================================
  // CUSTOMER FORM
  // =========================================================

  if (showCustomerForm) {
    return (
      <AddCustomer
        editingCustomer={editingCustomer}
        onSaved={handleCustomerSaved}
        onCancel={handleCustomerCancel}
      />
    );
  }

  // =========================================================
  // MAIN CUSTOMER LIST
  // =========================================================

  return (
    <div className="card shadow-sm border-0">

      <div className="card-body">

        {/* PAGE HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h3 className="fw-bold mb-1">
              📋 Customer Management
            </h3>

            <small className="text-muted">
              Manage and track all your converted customers
            </small>
          </div>

          <div className="d-flex gap-2">

            <button
              className="btn btn-primary"
              onClick={handleAddCustomer}
            >
              ➕ Add Customer
            </button>

            <button
              className="btn btn-outline-secondary"
              onClick={onBackToDashboard}
            >
              ← Dashboard
            </button>

          </div>

        </div>

        {/* SEARCH + FILTER */}
        <div className="row g-3 mb-4 align-items-end">

          {/* SEARCH */}
          <div className="col-md-3">

            <label className="form-label fw-semibold">
              🔎 Search Customer
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Name, phone, location..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentCustomerPage(1);
              }}
            />

          </div>

          {/* PURPOSE */}
          <div className="col-md-2">

            <label className="form-label fw-semibold">
              🏠 Purpose
            </label>

            <select
              className="form-select"
              value={purposeFilter}
              onChange={(e) => {
                setPurposeFilter(e.target.value);
                setCurrentCustomerPage(1);
              }}
            >
              <option value="">
                All
              </option>

              <option value="Rent">
                Rent
              </option>

              <option value="Sell">
                Sell
              </option>
            </select>

          </div>

          {/* CATEGORY */}
          <div className="col-md-2">

            <label className="form-label fw-semibold">
              🏢 Category
            </label>

            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentCustomerPage(1);
              }}
            >
              <option value="">
                All
              </option>

              <option value="Residential">
                Residential
              </option>

              <option value="Commercial">
                Commercial
              </option>

            </select>

          </div>

          {/* STATUS */}
          <div className="col-md-2">

            <label className="form-label fw-semibold">
              📌 Status
            </label>

            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentCustomerPage(1);
              }}
            >
              <option value="">
                All
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

          {/* DOWNLOAD */}
          <div className="col-md-2">

            <button
              type="button"
              className="btn btn-success w-80"
              onClick={handleDownloadCustomers}
            >
              📥 Download
            </button>

          </div>

        </div>

        {/* LOADING */}
        {loading ? (

          <div className="alert alert-info">
            Loading customers...
          </div>

        ) : currentCustomers.length === 0 ? (

          <div className="alert alert-info">
            No customers found.
          </div>

        ) : (

          /* CUSTOMER TABLE */
          <div className="table-responsive">

            <table className="table table-bordered table-hover align-middle">

              <thead className="table-dark">

                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Purpose</th>
                  <th>Category</th>
                  <th>Property Type</th>
                  <th>Location</th>
                  <th>Budget</th>
                  <th>Lead Source</th>
                  <th>Status</th>

                  <th style={{ minWidth: "190px" }}>
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {currentCustomers.map(
                  (item) => (

                    <tr key={item.id}>

                      <td>
                        {item.id}
                      </td>

                      <td>
                        <strong>
                          {item.name || "-"}
                        </strong>
                      </td>

                      <td>
                        {item.phone || "-"}
                      </td>

                      <td>
                        {item.email || "-"}
                      </td>

                      <td>

                        {item.purpose ? (

                          <span
                            className={
                              item.purpose ===
                              "Sell"
                                ? "badge bg-success"
                                : "badge bg-info text-dark"
                            }
                          >
                            {item.purpose}
                          </span>

                        ) : (
                          "-"
                        )}

                      </td>

                      <td>
                        {item.category || "-"}
                      </td>

                      <td>
                        {item.otherPropertyType ||
                          item.propertyType ||
                          "-"}
                      </td>

                      <td>
                        {item.location || "-"}
                      </td>

                      <td>

                        {item.budget !== null &&
                        item.budget !== undefined &&
                        item.budget !== "" ? (

                          `₹${Number(
                            item.budget
                          ).toLocaleString(
                            "en-IN"
                          )}`

                        ) : (
                          "-"
                        )}

                      </td>

                      <td>
                        {item.leadSource || "-"}
                      </td>

                      <td>

                        <span
                          className={
                            item.status ===
                            "Deal Finalized"
                              ? "badge bg-success"
                              : item.status ===
                                "Interested"
                              ? "badge bg-warning text-dark"
                              : item.status ===
                                "Deal In Progress"
                              ? "badge bg-info text-dark"
                              : item.status ===
                                "Inactive"
                              ? "badge bg-danger"
                              : "badge bg-primary"
                          }
                        >
                          {item.status || "Active"}
                        </span>

                      </td>

                      <td>

                        <div className="d-flex gap-2 flex-nowrap">

                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() =>
                              handleEditCustomer(
                                item
                              )
                            }
                          >
                            ✏️ Edit
                          </button>

                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              handleDeleteCustomer(
                                item.id
                              )
                            }
                          >
                            🗑️ Delete
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>
        )}

        {/* PAGINATION */}
        {filteredCustomers.length > 0 && (

          <div className="d-flex justify-content-between align-items-center mt-4">

            <button
              className="btn btn-outline-secondary"
              disabled={
                currentCustomerPage === 1
              }
              onClick={() =>
                setCurrentCustomerPage(
                  currentCustomerPage - 1
                )
              }
            >
              ← Previous
            </button>

            <span className="fw-semibold">
              Page {currentCustomerPage} of{" "}
              {totalCustomerPages}
            </span>

            <button
              className="btn btn-primary"
              disabled={
                currentCustomerPage >=
                totalCustomerPages
              }
              onClick={() =>
                setCurrentCustomerPage(
                  currentCustomerPage + 1
                )
              }
            >
              Next →
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default CustomerList;