
import { useEffect, useState } from "react";
import axios from "axios";

function FollowUpList({ onBack, onEditLead }) {

  const [followUps, setFollowUps] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and filter
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  const API_URL =
    "https://realestate-lead-manager-backend-production.up.railway.app";

  // =========================================================
  // LOAD FOLLOW-UPS + LEADS
  // =========================================================

  const loadFollowUps = async () => {

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Session expired. Please login again.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [followUpResponse, leadResponse] =
        await Promise.all([
          axios.get(
            `${API_URL}/api/followups`,
            config
          ),

          axios.get(
            `${API_URL}/api/leads`,
            config
          ),
        ]);

      setFollowUps(followUpResponse.data);
      setLeads(leadResponse.data);

    } catch (error) {

      console.error(
        "Follow-up API Error:",
        error
      );

      if (error.response?.status === 403) {

        alert(
          "Access denied. Please login again."
        );

      } else {

        alert(
          "Failed to load follow-ups."
        );

      }

    } finally {

      setLoading(false);

    }
  };

  // =========================================================
  // COMPLETE FOLLOW-UP
  // =========================================================

  const completeFollowUp = async (id) => {

    if (
      !window.confirm(
        "Are you sure you want to mark this follow-up as completed?"
      )
    ) {
      return;
    }

    try {

      const token = localStorage.getItem("token");

      if (!token) {

        alert(
          "Session expired. Please login again."
        );

        return;
      }

      await axios.put(
        `${API_URL}/api/followups/${id}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      await loadFollowUps();

      alert(
        "Follow-up marked as completed."
      );

    } catch (error) {

      console.error(
        "Complete Follow-up Error:",
        error
      );

      if (error.response?.status === 403) {

        alert(
          "Access denied. Please login again."
        );

      } else {

        alert(
          "Failed to complete follow-up."
        );

      }

    }
  };

  // =========================================================
  // LOAD DATA
  // =========================================================

  useEffect(() => {

    loadFollowUps();

  }, []);

  // =========================================================
  // COMBINE FOLLOW-UP + LEAD DATA
  // =========================================================

  const combinedFollowUps = followUps.map(
    (followUp) => {

      const lead = leads.find(
        (item) =>
          item.id === followUp.leadId
      );

      return {

        id: followUp.id,

        leadId: followUp.leadId,

        name:
          lead?.name || "-",

        phone:
          lead?.phone || "-",

        email:
          lead?.email || "-",

        propertyType:
          lead?.propertyType || "-",

        budget:
          lead?.budget || "-",

        location:
          lead?.location || "-",

        followUpDate:
          followUp.followUpDate,

        notes:
          followUp.notes || "-",

        status:
          followUp.status || "PENDING",

      };

    }
  );

  // =========================================================
  // FOLLOW-UP TYPE
  // =========================================================

  const getFollowUpType = (date) => {

    if (!date) {
      return "";
    }

    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    const followUpDate =
      new Date(date);

    followUpDate.setHours(
      0,
      0,
      0,
      0
    );

    if (followUpDate < today) {
      return "Overdue";
    }

    if (
      followUpDate.getTime() ===
      today.getTime()
    ) {
      return "Today";
    }

    return "Upcoming";
  };

  // =========================================================
  // SEARCH + FILTER
  // =========================================================

  const filteredFollowUps =
    combinedFollowUps.filter(
      (followUp) => {

        const searchText =
          search.toLowerCase();

        const matchesSearch =
          (followUp.name || "")
            .toLowerCase()
            .includes(searchText) ||

          (followUp.phone || "")
            .toLowerCase()
            .includes(searchText);

        const followUpType =
          getFollowUpType(
            followUp.followUpDate
          );

        const matchesFilter =
          filterType === "ALL" ||
          followUpType === filterType;

        return (
          matchesSearch &&
          matchesFilter
        );

      }
    );

  // =========================================================
  // SORT
  // =========================================================

  const sortedFollowUps =
    [...filteredFollowUps].sort(
      (a, b) =>
        new Date(a.followUpDate) -
        new Date(b.followUpDate)
    );

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages =
    Math.ceil(
      sortedFollowUps.length /
        recordsPerPage
    );

  const startIndex =
    (currentPage - 1) *
    recordsPerPage;

  const currentFollowUps =
    sortedFollowUps.slice(
      startIndex,
      startIndex + recordsPerPage
    );

  // =========================================================
  // SEARCH / FILTER HANDLERS
  // =========================================================

  const handleSearchChange = (e) => {

    setSearch(
      e.target.value
    );

    setCurrentPage(1);

  };

  const handleFilterChange = (e) => {

    setFilterType(
      e.target.value
    );

    setCurrentPage(1);

  };

  const clearFilters = () => {

    setSearch("");
    setFilterType("ALL");
    setCurrentPage(1);

  };

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    const dateObject =
      new Date(date);

    if (
      isNaN(
        dateObject.getTime()
      )
    ) {
      return date;
    }

    return dateObject.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <p className="text-center mt-4">

        Loading follow-ups...

      </p>

    );

  }

  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="container mt-4">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="d-flex justify-content-between align-items-center mb-3">

        <h3>
          📅 Follow-ups
        </h3>

        <button
          className="btn btn-secondary"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

      </div>


      {/* =====================================================
          SEARCH + FILTER
      ===================================================== */}

      <div className="card shadow-sm mb-4">

        <div className="card-body">

          <div className="row g-3">

            {/* SEARCH */}

            <div className="col-md-5">

              <label className="form-label fw-bold">
                🔍 Search Lead
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Search by name or phone"
                value={search}
                onChange={handleSearchChange}
              />

            </div>


            {/* FOLLOW-UP FILTER */}

            <div className="col-md-5">

              <label className="form-label fw-bold">
                🎯 Follow-up Type
              </label>

              <select
                className="form-select"
                value={filterType}
                onChange={handleFilterChange}
              >

                <option value="ALL">
                  All Follow-ups
                </option>

                <option value="Overdue">
                  🔴 Overdue
                </option>

                <option value="Today">
                  🟡 Today
                </option>

                <option value="Upcoming">
                  🔵 Upcoming
                </option>

              </select>

            </div>


            {/* CLEAR */}

            <div className="col-md-2 d-flex align-items-end">

              <button
                className="btn btn-outline-secondary w-100"
                onClick={clearFilters}
                title="Clear filters"
              >
                ✖ Clear
              </button>

            </div>

          </div>

        </div>

      </div>


      {/* =====================================================
          RESULT COUNT
      ===================================================== */}

      <div className="mb-2">

        <small className="text-muted">

          Showing{" "}

          {sortedFollowUps.length === 0
            ? 0
            : startIndex + 1}

          {" - "}

          {Math.min(
            startIndex +
              recordsPerPage,
            sortedFollowUps.length
          )}

          {" of "}

          {sortedFollowUps.length}

          {" follow-ups"}

        </small>

      </div>


      {/* =====================================================
          TABLE
      ===================================================== */}

      {sortedFollowUps.length === 0 ? (

        <div className="alert alert-info">

          No follow-ups found matching your search/filter.

        </div>

      ) : (

        <div className="table-responsive">

          <table className="table table-bordered table-hover">

            <thead className="table-dark">

              <tr>
                <th>ID</th>
                <th>Lead Name</th>
                <th>Phone</th>
                <th>Property</th>
                <th>Follow-up Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {currentFollowUps.map(
                (followUp) => {

                  const type =
                    getFollowUpType(
                      followUp.followUpDate
                    );

                  return (

                    <tr
                      key={followUp.id}
                    >

                      {/* ID */}

                      <td>
                        {followUp.id}
                      </td>


                      {/* NAME */}

                      <td>
                        {followUp.name}
                      </td>


                      {/* PHONE */}

                      <td>
                        {followUp.phone}
                      </td>


                      {/* PROPERTY */}

                      <td>
                        {followUp.propertyType}
                      </td>


                      {/* DATE */}

                      <td>

                        <span
                          className={
                            type === "Overdue"
                              ? "badge bg-danger"
                              : type === "Today"
                              ? "badge bg-warning text-dark"
                              : "badge bg-primary"
                          }
                        >

                          {formatDate(
                            followUp.followUpDate
                          )}

                        </span>

                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={
                            followUp.status ===
                            "COMPLETED"
                              ? "badge bg-success"
                              : followUp.status ===
                                "CANCELLED"
                              ? "badge bg-secondary"
                              : "badge bg-warning text-dark"
                          }
                        >

                          {followUp.status}

                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td>


                            <button
  className="btn btn-sm btn-success me-2"
  onClick={() => completeFollowUp(followUp.id)}
  disabled={followUp.status === "COMPLETED"}
>
  Complete
</button>

                          


                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => {

                            const lead =
                              leads.find(
                                (item) =>
                                  item.id ===
                                  followUp.leadId
                              );

                            if (lead) {

                              onEditLead(
                                lead
                              );

                            }

                          }}
                        >
                          Edit
                        </button>

                      </td>

                    </tr>

                  );

                }
              )}

            </tbody>

          </table>

        </div>

      )}


      {/* =====================================================
          PAGINATION
      ===================================================== */}

      {totalPages > 1 && (

        <div className="d-flex justify-content-center align-items-center mt-4 gap-2">

          <button
            className="btn btn-outline-primary"
            disabled={
              currentPage === 1
            }
            onClick={() =>
              setCurrentPage(
                currentPage - 1
              )
            }
          >
            ← Previous
          </button>


          <span className="fw-bold">

            Page{" "}
            {currentPage}
            {" "}
            of{" "}
            {totalPages}

          </span>


          <button
            className="btn btn-outline-primary"
            disabled={
              currentPage ===
              totalPages
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

  );
}

export default FollowUpList;

