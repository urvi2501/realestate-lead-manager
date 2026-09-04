import { useEffect, useState } from "react";
import axios from "axios";

function FollowUpList({ onBack, onEditLead }) {

  const [followUps, setFollowUps] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
const [searchTerm, setSearchTerm] = useState("");
const [filterType, setFilterType] = useState("All");
const [currentPage, setCurrentPage] = useState(1);

const recordsPerPage = 5;
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
          Authorization: `Bearer ${token}`
        }
      };

      // Get follow-ups
      const followUpResponse = await axios.get(
        "http://https://realestate-lead-manager-backend-production.up.railway.app/api/followups",
        config
      );

      // Get leads
      const leadResponse = await axios.get(
        "http://https://realestate-lead-manager-backend-production.up.railway.app/api/leads",
        config
      );

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


  useEffect(() => {

    loadFollowUps();

  }, []);


  // =========================================================
  // COMBINE FOLLOW-UP + LEAD DATA
  // =========================================================

 // =========================================================
// USE LEAD FOLLOW-UP DATES
// =========================================================

const combinedFollowUps = leads
  .filter((lead) => lead.followUpDate)
  .map((lead) => ({
    id: lead.id,
    leadId: lead.id,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    propertyType: lead.propertyType,
    budget: lead.budget,
    location: lead.location,
    followUpDate: lead.followUpDate,
    notes: lead.followUpNotes || "-",
    status: lead.followUpStatus || "PENDING",
  }));

  // =========================================================
  // FOLLOW-UP CATEGORY
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
  // SORT
  // =========================================================

  const sortedFollowUps =
    [...combinedFollowUps].sort(
      (a, b) =>
        new Date(a.followUpDate) -
        new Date(b.followUpDate)
    );

    // =========================================================
// SEARCH + FILTER
// =========================================================

const filteredFollowUps = sortedFollowUps.filter((item) => {

  const search = searchTerm.toLowerCase();

  const matchesSearch =
    item.name?.toLowerCase().includes(search) ||
    item.phone?.toLowerCase().includes(search);

  const matchesFilter =
    filterType === "All" ||
    getFollowUpType(item.followUpDate) === filterType;

  return matchesSearch && matchesFilter;
});


// =========================================================
// PAGINATION
// =========================================================

const totalPages = Math.ceil(
  filteredFollowUps.length / recordsPerPage
);

const startIndex =
  (currentPage - 1) * recordsPerPage;

const paginatedFollowUps =
  filteredFollowUps.slice(
    startIndex,
    startIndex + recordsPerPage
  );

  // =========================================================
  // COUNTS
  // =========================================================

  const overdueCount =
    combinedFollowUps.filter(
      (item) =>
        getFollowUpType(
          item.followUpDate
        ) === "Overdue"
    ).length;


  const todayCount =
    combinedFollowUps.filter(
      (item) =>
        getFollowUpType(
          item.followUpDate
        ) === "Today"
    ).length;


  const upcomingCount =
    combinedFollowUps.filter(
      (item) =>
        getFollowUpType(
          item.followUpDate
        ) === "Upcoming"
    ).length;


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <div className="container mt-4">

        <p className="text-center">

          Loading follow-ups...

        </p>

      </div>

    );

  }


  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="container mt-4">


      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h3>
            📅 Follow-up Reminders
          </h3>

          <p className="text-muted mb-0">
            Manage your lead follow-ups
          </p>

        </div>


        <button
          className="btn btn-secondary"
          onClick={onBack}
        >

          ← Back to Dashboard

        </button>

      </div>


      {/* SUMMARY CARDS */}

      <div className="row mb-4">


        {/* OVERDUE */}

        <div className="col-md-4 mb-3">

          <div className="card shadow-sm border-danger">

            <div className="card-body">

              <h6 className="text-danger">

                🔴 Overdue

              </h6>

              <h3>

                {overdueCount}

              </h3>

            </div>

          </div>

        </div>


        {/* TODAY */}

        <div className="col-md-4 mb-3">

          <div className="card shadow-sm border-warning">

            <div className="card-body">

              <h6 className="text-warning">

                🟡 Today

              </h6>

              <h3>

                {todayCount}

              </h3>

            </div>

          </div>

        </div>


        {/* UPCOMING */}

        <div className="col-md-4 mb-3">

          <div className="card shadow-sm border-primary">

            <div className="card-body">

              <h6 className="text-primary">

                🔵 Upcoming

              </h6>

              <h3>

                {upcomingCount}

              </h3>

            </div>

          </div>

        </div>

      </div>


{/* =========================================================
    SEARCH + FILTER
========================================================= */}

<div className="card shadow-sm mb-4">
  <div className="card-body">

    <div className="row">

      {/* SEARCH */}

      <div className="col-md-7 mb-2">

        <label className="form-label fw-bold">
          🔍 Search Lead
        </label>

        <input
          type="text"
          className="form-control"
          placeholder="Search by lead name or phone..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

      </div>


      {/* FILTER */}

      <div className="col-md-5 mb-2">

        <label className="form-label fw-bold">
          🎯 Filter
        </label>

        <select
          className="form-select"
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setCurrentPage(1);
          }}
        >

          <option value="All">
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

    </div>

  </div>
</div>
      {/* TABLE */}

      {filteredFollowUps.length === 0 ? (

        <div className="alert alert-info">

          No follow-ups scheduled.

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

                <th>Notes</th>

                <th>Status</th>

                <th>Action</th>

              </tr>

            </thead>


            <tbody>

              {paginatedFollowUps.map(
                (followUp) => {

                  const type =
                    getFollowUpType(
                      followUp.followUpDate
                    );


                  return (

                    <tr
                      key={followUp.id}
                    >

                      <td>
                        {followUp.id}
                      </td>


                      <td>

                        <strong>
                          {followUp.name}
                        </strong>

                      </td>


                      <td>
                        {followUp.phone}
                      </td>


                      <td>
                        {followUp.propertyType}
                      </td>


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

                          {followUp.followUpDate}

                        </span>

                      </td>


                      <td>

                        {followUp.notes || "-"}

                      </td>


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


                      <td>

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

                          ✏️ Edit Lead

                        </button>

                      </td>

                    </tr>

                  );

                }
              )}

            </tbody>

          </table>

{/* =========================================================
    PAGINATION
========================================================= */}

{totalPages > 1 && (
  <div className="d-flex justify-content-center align-items-center mt-4">

    <button
      className="btn btn-outline-primary me-2"
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
      className="btn btn-outline-primary ms-2"
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

export default FollowUpList;