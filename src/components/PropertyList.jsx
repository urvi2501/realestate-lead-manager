import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { API_URL as BASE_API_URL } from "../config";
const API_URL = `${BASE_API_URL}/api/properties`;

function PropertyList({
  onAddProperty,
  onEditProperty,
  goToDashboard,
}) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================================
  // SEARCH + FILTERS
  // =========================================================

  const [search, setSearch] = useState("");
  const [purposeFilter, setPurposeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // =========================================================
  // PAGINATION
  // =========================================================

  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 5;

  // =========================================================
  // LOAD PROPERTIES
  // =========================================================

  const loadProperties = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = Array.isArray(response.data)
        ? response.data
        : [];

      console.log("Properties API:", data);

      setProperties(data);
    } catch (error) {
      console.error("Property API Error:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to load properties."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  // =========================================================
  // HELPER FUNCTIONS
  // =========================================================

  const getPurpose = (property) => {
    return (
      property?.purpose ||
      property?.listingPurpose ||
      property?.transactionType ||
      ""
    );
  };

  const getCategory = (property) => {
    return property?.category || "";
  };

  const getPropertyType = (property) => {
    return (
      property?.otherPropertyType ||
      property?.propertyType ||
      ""
    );
  };

  const getStatus = (property) => {
    return (
      property?.availabilityStatus ||
      property?.status ||
      ""
    );
  };

  const getExpectedPrice = (property) => {
    return (
      property?.expectedPrice ??
      property?.price ??
      property?.budget ??
      ""
    );
  };

  const formatPrice = (price) => {
    if (
      price === null ||
      price === undefined ||
      price === ""
    ) {
      return "-";
    }

    const numericPrice = Number(price);

    if (Number.isNaN(numericPrice)) {
      return price;
    }

    return `₹${numericPrice.toLocaleString("en-IN")}`;
  };

  const normalize = (value) => {
    return String(value ?? "")
      .trim()
      .toLowerCase();
  };

  // =========================================================
  // SEARCH + FILTER
  // =========================================================

  const filteredProperties = useMemo(() => {
    const searchText = normalize(search);

    return properties.filter((property) => {
      const searchableText = [
        property.id,
        property.title,
        property.name,
        property.propertyName,
        property.propertyType,
        property.otherPropertyType,
        property.category,
        property.purpose,
        property.listingPurpose,
        property.transactionType,
        property.city,
        property.locality,
        property.location,
        property.address,
        property.area,
        property.carpetArea,
        property.builtUpArea,
        property.superBuiltUpArea,
        property.expectedPrice,
        property.price,
        property.pricePerUnit,
        property.availabilityStatus,
        property.status,
        property.parking,
        property.parkingType,
        property.officeType,
        property.description,
      ]
        .map(normalize)
        .join(" ");

      const matchesSearch =
        !searchText ||
        searchableText.includes(searchText);

      const purpose = normalize(getPurpose(property));

      const matchesPurpose =
        !purposeFilter ||
        purpose === normalize(purposeFilter);

      const category = normalize(getCategory(property));

      const matchesCategory =
        !categoryFilter ||
        category === normalize(categoryFilter);

      const propertyType =
        normalize(property.propertyType);

      const otherPropertyType =
        normalize(property.otherPropertyType);

      const matchesType =
        !typeFilter ||
        propertyType === normalize(typeFilter) ||
        otherPropertyType === normalize(typeFilter);

      const status = normalize(getStatus(property));

      const matchesStatus =
        !statusFilter ||
        status === normalize(statusFilter);

      return (
        matchesSearch &&
        matchesPurpose &&
        matchesCategory &&
        matchesType &&
        matchesStatus
      );
    });
  }, [
    properties,
    search,
    purposeFilter,
    categoryFilter,
    typeFilter,
    statusFilter,
  ]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProperties.length /
        propertiesPerPage
    )
  );

  const startIndex =
    (currentPage - 1) *
    propertiesPerPage;

  const currentProperties =
    filteredProperties.slice(
      startIndex,
      startIndex + propertiesPerPage
    );

  // =========================================================
  // RESET PAGE WHEN FILTER CHANGES
  // =========================================================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    purposeFilter,
    categoryFilter,
    typeFilter,
    statusFilter,
  ]);

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const handleClearFilters = () => {
    setSearch("");
    setPurposeFilter("");
    setCategoryFilter("");
    setTypeFilter("");
    setStatusFilter("");
    setCurrentPage(1);
  };

  // =========================================================
  // DELETE PROPERTY
  // =========================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${API_URL}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProperties((previous) =>
        previous.filter(
          (property) => property.id !== id
        )
      );

      alert("Property deleted successfully.");
    } catch (error) {
      console.error(
        "Delete Property Error:",
        error
      );

      alert(
        error?.response?.data?.message ||
          "Failed to delete property."
      );
    }
  };

  // =========================================================
  // DOWNLOAD PROPERTIES
  // =========================================================

  const handleDownloadProperties = () => {
    if (filteredProperties.length === 0) {
      alert(
        "No property data available to download."
      );
      return;
    }

    const headers = [
      "ID",
      "Purpose",
      "Category",
      "Property Type",
      "Other Property Type",
      "Title",
      "City",
      "Locality",
      "Location",
      "Address",
      "Expected Price",
      "Price Per Unit",
      "Carpet Area",
      "Built-up Area",
      "Super Built-up Area",
      "Bedrooms",
      "Bathrooms",
      "Parking",
      "Parking Type",
      "Availability Status",
      "Office Type",
      "Meeting Rooms",
      "Description",
    ];

    const rows = filteredProperties.map(
      (property) => [
        property.id ?? "",
        getPurpose(property),
        property.category ?? "",
        property.propertyType ?? "",
        property.otherPropertyType ?? "",
        property.title ??
          property.name ??
          property.propertyName ??
          "",
        property.city ?? "",
        property.locality ?? "",
        property.location ?? "",
        property.address ?? "",
        getExpectedPrice(property),
        property.pricePerUnit ?? "",
        property.carpetArea ?? "",
        property.builtUpArea ?? "",
        property.superBuiltUpArea ?? "",
        property.bedrooms ?? "",
        property.bathrooms ?? "",
        property.parking ?? "",
        property.parkingType ?? "",
        getStatus(property),
        property.officeType ?? "",
        property.meetingRooms ?? "",
        property.description ?? "",
      ]
    );

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) => {
            const text = String(value ?? "");
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
      "properties.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =========================================================
  // STATUS BADGE
  // =========================================================

  const getStatusBadgeClass = (status) => {
    const normalizedStatus =
      normalize(status);

    if (
      normalizedStatus === "available"
    ) {
      return "badge bg-success";
    }

    if (
      normalizedStatus === "reserved"
    ) {
      return "badge bg-warning text-dark";
    }

    if (
      normalizedStatus === "sold"
    ) {
      return "badge bg-danger";
    }

    if (
      normalizedStatus === "leased"
    ) {
      return "badge bg-info text-dark";
    }

    if (
      normalizedStatus === "rented"
    ) {
      return "badge bg-info text-dark";
    }

    return "badge bg-secondary";
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="card shadow-sm border-0">
        <div className="card-body text-center py-5">
          <div
            className="spinner-border text-primary"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>

          <p className="text-muted mt-3 mb-0">
            Loading properties...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="card shadow-sm border-0">

      <div className="card-body">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h3 className="fw-bold mb-1">
              🏠 Property Management
            </h3>

            <small className="text-muted">
              Manage and track all your properties
            </small>
          </div>

          <div className="d-flex gap-2">

            <button
              type="button"
              className="btn btn-primary"
              onClick={onAddProperty}
            >
              ➕ Add Property
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={goToDashboard}
            >
              ← Dashboard
            </button>

          </div>

        </div>

        {/* =================================================
            SEARCH + FILTERS
        ================================================= */}

        <div className="card bg-light border-0 mb-4">

          <div className="card-body">

            <div className="row g-3 align-items-end">

              {/* SEARCH */}

              <div className="col-md-3">

                <label className="form-label fw-semibold">
                  🔎 Search Property
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="City, locality, type..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
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
                  onChange={(e) =>
                    setPurposeFilter(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    All
                  </option>

                  <option value="Sell">
                    Sell
                  </option>

                  <option value="Rent">
                    Rent
                  </option>

                  <option value="Lease">
                    Lease
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
                  onChange={(e) =>
                    setCategoryFilter(
                      e.target.value
                    )
                  }
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

              {/* PROPERTY TYPE */}

              <div className="col-md-2">

                <label className="form-label fw-semibold">
                  🏘️ Property Type
                </label>

                <select
                  className="form-select"
                  value={typeFilter}
                  onChange={(e) =>
                    setTypeFilter(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    All Types
                  </option>

                  <option value="Flat / Apartment">
                    Flat / Apartment
                  </option>

                  <option value="Independent House / Villa">
                    Independent House / Villa
                  </option>

                  <option value="Builder Floor">
                    Builder Floor
                  </option>

                  <option value="1 RK / Studio">
                    1 RK / Studio
                  </option>

                  <option value="Serviced Apartment">
                    Serviced Apartment
                  </option>

                  <option value="Farmhouse">
                    Farmhouse
                  </option>

                  <option value="Shop / Showroom">
                    Shop / Showroom
                  </option>

                  <option value="Office">
                    Office
                  </option>

                  <option value="Plot">
                    Plot
                  </option>

                  <option value="Storage">
                    Storage
                  </option>

                  <option value="Industrial">
                    Industrial
                  </option>

                  <option value="Hospitality">
                    Hospitality
                  </option>

                </select>

              </div>

              {/* STATUS */}

              <div className="col-md-2">

                <label className="form-label fw-semibold">
                  📌 Availability
                </label>

                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    All
                  </option>

                  <option value="Available">
                    Available
                  </option>

                  <option value="Reserved">
                    Reserved
                  </option>

                  <option value="Sold">
                    Sold
                  </option>

                  <option value="Leased">
                    Leased
                  </option>

                  <option value="Rented">
                    Rented
                  </option>

                </select>

              </div>

              {/* CLEAR */}

              <div className="col-md-1">

                <button
                  type="button"
                  className="btn btn-outline-secondary w-100"
                  title="Clear filters"
                  onClick={
                    handleClearFilters
                  }
                >
                  ✕
                </button>

              </div>

            </div>

            {/* DOWNLOAD */}

            <div className="d-flex justify-content-between align-items-center mt-3">

              <small className="text-muted">
                Showing{" "}
                <strong>
                  {filteredProperties.length}
                </strong>{" "}
                {filteredProperties.length === 1
                  ? "property"
                  : "properties"}
              </small>

              <button
                type="button"
                className="btn btn-success btn-sm px-3"
                onClick={
                  handleDownloadProperties
                }
              >
                📥 Download
              </button>

            </div>

          </div>

        </div>

        {/* =================================================
            PROPERTY LIST
        ================================================= */}

        {filteredProperties.length === 0 ? (

          <div className="alert alert-info">
            No properties found matching
            your search or filters.
          </div>

        ) : (

          <div>

            {currentProperties.map(
              (property) => {

                const purpose =
                  getPurpose(property);

                const category =
                  getCategory(property);

                const propertyType =
                  getPropertyType(property);

                const status =
                  getStatus(property);

                return (

                  <div
                    key={property.id}
                    className="card shadow-sm border mb-3"
                  >

                    <div className="card-body">

                      <div className="row">

                        {/* =================================
                            PROPERTY DETAILS
                        ================================= */}

                        <div className="col-md-8">

                          <div className="d-flex align-items-center gap-2 mb-2">

                            <h5 className="fw-bold mb-0">
                              {property.title ||
                                property.name ||
                                property.propertyName ||
                                propertyType ||
                                "Property"}
                            </h5>

                            {purpose && (
                              <span
                                className={
                                  purpose ===
                                  "Sell"
                                    ? "badge bg-success"
                                    : purpose ===
                                      "Rent"
                                    ? "badge bg-info text-dark"
                                    : purpose ===
                                      "Lease"
                                    ? "badge bg-primary"
                                    : "badge bg-secondary"
                                }
                              >
                                {purpose}
                              </span>
                            )}

                          </div>

                          <p className="mb-2 text-muted">
                            📍{" "}
                            {property.locality ||
                              "-"}
                            {property.city
                              ? `, ${property.city}`
                              : ""}
                          </p>

                          <div className="row">

                            <div className="col-md-6">

                              <p className="mb-2">
                                <strong>
                                  Category:
                                </strong>{" "}
                                {category || "-"}
                              </p>

                              <p className="mb-2">
                                <strong>
                                  Property Type:
                                </strong>{" "}
                                {propertyType ||
                                  "-"}
                              </p>

                              <p className="mb-2">
                                <strong>
                                  Carpet Area:
                                </strong>{" "}
                                {property.carpetArea
                                  ? `${property.carpetArea} sq.ft`
                                  : "-"}
                              </p>

                              <p className="mb-2">
                                <strong>
                                  Built-up Area:
                                </strong>{" "}
                                {property.builtUpArea
                                  ? `${property.builtUpArea} sq.ft`
                                  : "-"}
                              </p>

                            </div>

                            <div className="col-md-6">

                              {category ===
                                "Residential" && (
                                <p className="mb-2">
                                  🛏️{" "}
                                  <strong>
                                    Bedrooms:
                                  </strong>{" "}
                                  {property.bedrooms ??
                                    "-"}
                                </p>
                              )}

                              {category ===
                                "Residential" && (
                                <p className="mb-2">
                                  🚿{" "}
                                  <strong>
                                    Bathrooms:
                                  </strong>{" "}
                                  {property.bathrooms ??
                                    "-"}
                                </p>
                              )}

                              <p className="mb-2">
                                <strong>
                                  Parking:
                                </strong>{" "}
                                {property.parking ||
                                  "-"}
                                {property.parkingType
                                  ? ` (${property.parkingType})`
                                  : ""}
                              </p>

                              {category ===
                                "Commercial" &&
                                property.propertyType ===
                                  "Office" && (
                                  <p className="mb-2">
                                    <strong>
                                      Office:
                                    </strong>{" "}
                                    {property.officeType ||
                                      "-"}
                                  </p>
                                )}

                            </div>

                          </div>

                        </div>

                        {/* =================================
                            PRICE + STATUS + ACTIONS
                        ================================= */}

                        <div className="col-md-4 border-start">

                          <div className="ps-3">

                            <small className="text-muted">
                              Expected Price
                            </small>

                            <h4 className="fw-bold mb-1">
                              {formatPrice(
                                getExpectedPrice(
                                  property
                                )
                              )}
                            </h4>

                            {property.pricePerUnit && (
                              <p className="text-muted mb-2">
                                ₹
                                {Number(
                                  property.pricePerUnit
                                ).toLocaleString(
                                  "en-IN"
                                )}
                                {" / sq.ft"}
                              </p>
                            )}

                            <div className="mb-3">

                              <span
                                className={
                                  getStatusBadgeClass(
                                    status
                                  )
                                }
                              >
                                {status || "Not Available"}
                              </span>

                            </div>

                            <div className="d-flex gap-2">

                              <button
                                type="button"
                                className="btn btn-sm btn-warning"
                                onClick={() =>
                                  onEditProperty(
                                    property
                                  )
                                }
                              >
                                ✏️ Edit
                              </button>

                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() =>
                                  handleDelete(
                                    property.id
                                  )
                                }
                              >
                                🗑️ Delete
                              </button>

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                );
              }
            )}

          </div>

        )}

        {/* =================================================
            PAGINATION
        ================================================= */}

        {filteredProperties.length > 0 && (
          <div className="d-flex justify-content-between align-items-center mt-4">

            <button
              type="button"
              className="btn btn-outline-secondary"
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage(
                  currentPage - 1
                )
              }
            >
              ← Previous
            </button>

            <span className="fw-semibold">
              Page {currentPage} of{" "}
              {totalPages}
            </span>

            <button
              type="button"
              className="btn btn-primary"
              disabled={
                currentPage >= totalPages
              }
              onClick={() =>
                setCurrentPage(
                  currentPage + 1
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

export default PropertyList;
