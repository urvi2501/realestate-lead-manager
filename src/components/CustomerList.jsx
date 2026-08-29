
import { useEffect, useState } from "react";
import {
  getAllCustomers,
  deleteCustomer,
} from "../services/CustomerService";

function CustomerList({
  onAddCustomer,
  onEditCustomer,
  goToDashboard,
}) {

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and filter states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [propertyFilter, setPropertyFilter] = useState("ALL");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const loadCustomers = async () => {
    try {
      const response = await getAllCustomers();

      console.log("Customers API:", response.data);

      setCustomers(response.data);
    } catch (error) {
      console.error("Customer API Error:", error);
      alert("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleDelete = async (id) => {

    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    try {

      await deleteCustomer(id);

      await loadCustomers();

      alert("Customer deleted successfully.");

    } catch (error) {

      console.error("Delete Customer Error:", error);
      alert("Failed to delete customer.");

    }
  };

  // ============================
  // SEARCH + FILTER
  // ============================

  const filteredCustomers = customers.filter((customer) => {

    const searchText = search.toLowerCase();

    const matchesSearch =
      (customer.name || "").toLowerCase().includes(searchText) ||
      (customer.phone || "").toLowerCase().includes(searchText) ||
      (customer.email || "").toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "ALL" ||
      (customer.status || "").toLowerCase() === statusFilter.toLowerCase();

    const matchesProperty =
      propertyFilter === "ALL" ||
      (customer.propertyType || "").toLowerCase() === propertyFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesProperty;
  });

  // ============================
  // PAGINATION
  // ============================

  const totalPages = Math.ceil(
    filteredCustomers.length / recordsPerPage
  );

  const startIndex =
    (currentPage - 1) * recordsPerPage;

  const currentCustomers = filteredCustomers.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePropertyChange = (e) => {
    setPropertyFilter(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setPropertyFilter("ALL");
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <p className="text-center mt-4">
        Loading customers...
      </p>
    );
  }

  return (
    <div className="container mt-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-3">

        <h3>👥 Customers</h3>

        <div className="d-flex gap-2">

          <button
            className="btn btn-secondary"
            onClick={goToDashboard}
          >
            ← Back to Dashboard
          </button>

          <button
            className="btn btn-primary"
            onClick={onAddCustomer}
          >
            ➕ Add Customer
          </button>

        </div>

      </div>


      {/* SEARCH + FILTER SECTION */}
      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <div className="row g-3">

            {/* SEARCH */}
            <div className="col-md-5">

              <label className="form-label fw-bold">
                🔍 Search Customer
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Search by name, phone or email"
                value={search}
                onChange={handleSearchChange}
              />

            </div>


            {/* STATUS FILTER */}
            <div className="col-md-3">

              <label className="form-label fw-bold">
                🎯 Status
              </label>

              <select
                className="form-select"
                value={statusFilter}
                onChange={handleStatusChange}
              >

                <option value="ALL">
                  All Status
                </option>

                <option value="NEW">
                  New
                </option>

                <option value="INTERESTED">
                  Interested
                </option>

                <option value="CONVERTED">
                  Converted
                </option>

              </select>

            </div>


           
{/* PROPERTY FILTER */}
<div className="col-md-3">

  <label className="form-label fw-bold">
    🏠 Property Type
  </label>

  <select
    className="form-select"
    value={propertyFilter}
    onChange={handlePropertyChange}
  >

    <option value="ALL">
      All Properties
    </option>

    <option value="FLAT">
      Flat
    </option>

    <option value="VILLA">
      Villa
    </option>

    <option value="HOUSE">
      House
    </option>

    <option value="COMMERCIAL">
      Commercial
    </option>

  </select>

</div>
```



            {/* CLEAR */}
            <div className="col-md-1 d-flex align-items-end">

              <button
                className="btn btn-outline-secondary w-100"
                onClick={clearFilters}
                title="Clear filters"
              >
                ✖
              </button>

            </div>

          </div>

        </div>

      </div>


      {/* RESULT COUNT */}
      <div className="mb-2">

        <small className="text-muted">

          Showing{" "}
          {filteredCustomers.length === 0
            ? 0
            : startIndex + 1}
          {" - "}
          {Math.min(
            startIndex + recordsPerPage,
            filteredCustomers.length
          )}
          {" of "}
          {filteredCustomers.length} customers

        </small>

      </div>


      {/* TABLE */}

      {filteredCustomers.length === 0 ? (

        <div className="alert alert-info">
          No customers found matching your search/filter.
        </div>

      ) : (

        <div className="table-responsive">

          <table className="table table-bordered table-hover">

            <thead className="table-dark">

              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Property</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {currentCustomers.map((customer) => (

                <tr key={customer.id}>

                  <td>{customer.id}</td>

                  <td>{customer.name}</td>

                  <td>{customer.phone}</td>

                  <td>{customer.email}</td>

                  <td>{customer.propertyType}</td>

                  <td>{customer.budget}</td>

                  <td>

                    <span className="badge bg-success">
                      {customer.status}
                    </span>

                  </td>

                  <td>

                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() =>
                        onEditCustomer(customer)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() =>
                        handleDelete(customer.id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}


      {/* PAGINATION */}

      {totalPages > 1 && (

        <div className="d-flex justify-content-center align-items-center mt-4 gap-2">

          <button
            className="btn btn-outline-primary"
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(currentPage - 1)
            }
          >
            ← Previous
          </button>


          <span className="fw-bold">
            Page {currentPage} of {totalPages}
          </span>


          <button
            className="btn btn-outline-primary"
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage(currentPage + 1)
            }
          >
            Next →
          </button>

        </div>

      )}

    </div>
  );
}

export default CustomerList;
