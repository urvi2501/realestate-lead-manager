import { useEffect, useState } from "react";
import axios from "axios";

function PropertyList({ onAddProperty, onEditProperty, goToDashboard }) {

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search + Filter
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 5;

  const loadProperties = async () => {
    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://https://realestate-lead-manager-backend-production.up.railway.app/api/properties",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Properties API:", response.data);

      setProperties(response.data);

    } catch (error) {

      console.error("Property API Error:", error);
      alert("Failed to load properties.");

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredProperties = properties.filter((property) => {

    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      property.title?.toLowerCase().includes(searchText) ||
      property.location?.toLowerCase().includes(searchText);

    const matchesType =
      typeFilter === "" ||
      property.propertyType?.toLowerCase() ===
        typeFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "" ||
      property.status?.toLowerCase() ===
        statusFilter.toLowerCase();

    return matchesSearch && matchesType && matchesStatus;
  });

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProperties.length / propertiesPerPage)
  );

  const indexOfLastProperty =
    currentPage * propertiesPerPage;

  const indexOfFirstProperty =
    indexOfLastProperty - propertiesPerPage;

  const currentProperties =
    filteredProperties.slice(
      indexOfFirstProperty,
      indexOfLastProperty
    );

  // Reset to page 1 when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter, statusFilter]);

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {

    if (!window.confirm("Are you sure you want to delete this property?")) {
      return;
    }

    try {

      const token = localStorage.getItem("token");

      await axios.delete(
        `http://https://realestate-lead-manager-backend-production.up.railway.app/api/properties/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      await loadProperties();

      alert("Property deleted successfully.");

    } catch (error) {

      console.error("Delete Property Error:", error);
      alert("Failed to delete property.");

    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <p className="text-center mt-4">
        Loading properties...
      </p>
    );
  }

  return (
    <div className="container mt-4">

    <div className="d-flex justify-content-between align-items-center mb-3">

  <h3>🏠 Properties</h3>

  <div className="d-flex gap-2">

    <button
      className="btn btn-secondary"
      onClick={goToDashboard}
    >
      ← Back to Dashboard
    </button>

    <button
      className="btn btn-primary"
      onClick={onAddProperty}
    >
      ➕ Add Property
    </button>

  </div>

</div>

      {/* =====================================================
          PROPERTY SEARCH + FILTER
      ===================================================== */}

      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <div className="row g-3">

            {/* SEARCH */}

            <div className="col-md-5">

              <label className="form-label fw-bold">
                🔍 Search Property
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Search by title or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

            {/* PROPERTY TYPE */}

            <div className="col-md-3">

              <label className="form-label fw-bold">
                🏠 Property Type
              </label>

              <select
                className="form-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >

                <option value="">
                  All Types
                </option>

                <option value="Flat">
                  Flat
                </option>

                <option value="House">
                  House
                </option>

                <option value="Villa">
                  Villa
                </option>

                <option value="Commercial">
                  Commercial
                </option>

              </select>

            </div>

            {/* STATUS */}

            <div className="col-md-3">

              <label className="form-label fw-bold">
                📌 Status
              </label>

              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >

                <option value="">
                  All Status
                </option>

                <option value="Available">
                  Available
                </option>

                <option value="Sold">
                  Sold
                </option>

                <option value="Rented">
                  Rented
                </option>

                <option value="Reserved">
                  Reserved
                </option>
              </select>

            </div>

            {/* CLEAR */}

            <div className="col-md-1 d-flex align-items-end">

              <button
                className="btn btn-outline-secondary w-100"
                onClick={() => {
                  setSearch("");
                  setTypeFilter("");
                  setStatusFilter("");
                }}
              >
                ✕
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* RESULT COUNT */}

      <div className="mb-2">
        <strong>
          Showing {filteredProperties.length} propert
          {filteredProperties.length === 1 ? "y" : "ies"}
        </strong>
      </div>

      {/* =====================================================
          PROPERTY TABLE
      ===================================================== */}

      {filteredProperties.length === 0 ? (

        <div className="alert alert-info">
          No properties found matching your search/filter.
        </div>

      ) : (

        <div className="table-responsive">

          <table className="table table-bordered table-hover">

            <thead className="table-dark">

              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Type</th>
                <th>Location</th>
                <th>Price</th>
                <th>Bedrooms</th>
                <th>Bathrooms</th>
                <th>Area</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {currentProperties.map((property) => (

                <tr key={property.id}>

                  <td>{property.id}</td>

                  <td>{property.title}</td>

                  <td>{property.propertyType}</td>

                  <td>{property.location}</td>

                  <td>
                    ₹{property.price}
                  </td>

                  <td>{property.bedrooms}</td>

                  <td>{property.bathrooms}</td>

                  <td>
                    {property.area} sq.ft
                  </td>

                  <td>
                    <span className="badge bg-success">
                      {property.status}
                    </span>
                  </td>

                  <td>

                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() =>
                        onEditProperty(property)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() =>
                        handleDelete(property.id)
                      }
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {/* =====================================================
              PAGINATION
          ===================================================== */}

          {totalPages > 1 && (

            <div className="d-flex justify-content-between align-items-center mt-3">

              <button
                className="btn btn-secondary"
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
                className="btn btn-primary"
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

      )}

    </div>
  );
}

export default PropertyList;