import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import FollowUpList from "./components/FollowUpList";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import CustomerList from "./components/CustomerList";
import AddCustomer from "./components/AddCustomer";
import PropertyList from "./components/PropertyList";
import PropertyForm from "./components/PropertyForm";
import Reports from "./Reports";
import Analytics from "./Analytics";
import EmailSender from "./components/EmailSender";

import MessageTemplateList from "./components/MessageTemplateList";
import {
  getAllCustomers,
} from "./services/CustomerService";

import {
  getAllLeads,
  addLead,
  updateLead,
  deleteLead,
   convertLeadToCustomer,
} from "./services/LeadService";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {

  // =========================================================
  // 1. LOGIN
  // =========================================================

  const [loggedInUser, setLoggedInUser] = useState( !!localStorage.getItem("token"));


  // =========================================================
  // 2. MAIN NAVIGATION
  // One page is visible at a time.
  // =========================================================

  const [currentPage, setCurrentPage] = useState("dashboard");


  // =========================================================
  // 3. CUSTOMER STATE
  // =========================================================

  const [editingCustomer, setEditingCustomer] = useState(null);

  const [totalCustomers, setTotalCustomers] = useState(0);
  const [interestedCustomers, setInterestedCustomers] = useState(0);
  const [convertedCustomers, setConvertedCustomers] = useState(0);


  // =========================================================
  // 4. PROPERTY STATE
  // =========================================================

  

  const [editingProperty, setEditingProperty] = useState(null);


  // =========================================================
  // 5. LEAD STATE
  // =========================================================

 const emptyLead = {
  name: "",
  phone: "",
  email: "",
  enquiryDateTime: "",
  purpose: "",
  category: "",
  propertyType: "",
  otherPropertyType: "",
  budget: "",
  location: "",
  carpetArea: "",
  builtUpArea: "",
  superBuiltUpArea: "",
  leadSource: "",
  status: "",
  followUpDate: "",
  additionalInformation: "",
};

  const [lead, setLead] = useState(emptyLead);
  const [editingId, setEditingId] = useState(null);
  const [leads, setLeads] = useState([]);


  // =========================================================
  // 6. LEAD SEARCH / FILTER / PAGINATION
  // =========================================================


  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
const [purposeFilter, setPurposeFilter] = useState("");
const [categoryFilter, setCategoryFilter] = useState("");
const [currentLeadPage, setCurrentLeadPage] = useState(1);
  const leadsPerPage = 5;


  // =========================================================
  // 7. DASHBOARD COUNTS
  // =========================================================

  const [totalLeads, setTotalLeads] = useState(0);
  const [newLeads, setNewLeads] = useState(0);
  const [interestedLeads, setInterestedLeads] = useState(0);
  const [convertedLeads, setConvertedLeads] = useState(0);


  // =========================================================
  // 8. LOAD LEADS + DASHBOARD
  // =========================================================

  const loadDashboard = async () => {
    try {
      const response = await getAllLeads();
      const data = response.data || [];

      console.log("Dashboard API:", data);

      setLeads(data);

      setTotalLeads(data.length);

     setNewLeads(
  data.filter(
    (item) => item.status?.toUpperCase() === "NEW"
  ).length
);

setInterestedLeads(
  data.filter(
    (item) => item.status?.toUpperCase() === "INTERESTED"
  ).length
);

setConvertedLeads(
  data.filter(
    (item) => item.status?.toUpperCase() === "CONVERTED"
  ).length
);


    } catch (error) {
      console.error("Dashboard API Error:", error);
    }
  };

  const handleDownloadLeads = () => {
  if (filteredLeads.length === 0) {
    alert("No lead data available to download.");
    return;
  }

  const excelData = filteredLeads.map((lead) => ({
    ID: lead.id || "",
    Name: lead.name || "",
    Phone: lead.phone || "",
    Email: lead.email || "",
    Purpose: lead.purpose || "",
    Category: lead.category || "",
    "Property Type": lead.propertyType || "",
    Location: lead.location || "",
    Budget: lead.budget || "",
    "Lead Source": lead.leadSource || "",
    "Follow-up Date": lead.followUpDate || "",
    Status: lead.status || "",
    "Additional Information":
      lead.additionalInformation || ""
  }));

  const worksheet =
    XLSX.utils.json_to_sheet(excelData);

  const workbook =
    XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Leads"
  );

  XLSX.writeFile(
    workbook,
    "PropertyInnConsultancy_Leads.xlsx"
  );
};

  // =========================================================
  // 9. LOAD CUSTOMER DASHBOARD
  // =========================================================

  const loadCustomerDashboard = async () => {
    try {
      const response = await getAllCustomers();
      const data = response.data || [];

      console.log("Customer Dashboard API:", data);

      setTotalCustomers(data.length);

      setInterestedCustomers(
        data.filter(
          (customer) => customer.status === "Interested"
        ).length
      );

      setConvertedCustomers(
        data.filter(
          (customer) => customer.status === "Converted"
        ).length
      );

    } catch (error) {
      console.error("Customer Dashboard Error:", error);
    }
  };


  // =========================================================
  // 10. INITIAL DATA AFTER LOGIN
  // =========================================================

  useEffect(() => {
    if (loggedInUser) {
      loadDashboard();
      loadCustomerDashboard();
    }
   
  
  }, [loggedInUser]);


  // =========================================================
  // 11. REFRESH DASHBOARD
  // =========================================================

  const refreshDashboard = async () => {
    await loadDashboard();
    await loadCustomerDashboard();
  };


  // =========================================================
  // 12. LEAD FORM INPUT
  // =========================================================

  const handleLeadChange = (e) => {
    const { name, value } = e.target;

    setLead((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // =========================================================
  // 13. OPEN ADD LEAD
  // =========================================================

  const handleAddLead = () => {
    setLead(emptyLead);
    setEditingId(null);
    setCurrentLeadPage(1);
    setCurrentPage("lead-form");
  };


  // =========================================================
  // 14. OPEN LEAD LIST
  // =========================================================

  const handleViewLeads = async () => {
    await loadDashboard();
    setCurrentPage("leads");
  };


  // =========================================================
  // 15. EDIT LEAD
  // =========================================================
const handleEditLead = (selectedLead) => {
  setLead({
    name: selectedLead.name || "",
    phone: selectedLead.phone || "",
    email: selectedLead.email || "",
    enquiryDateTime: selectedLead.enquiryDateTime || "",
    purpose: selectedLead.purpose || "",
    category: selectedLead.category || "",
    propertyType: selectedLead.propertyType || "",
    otherPropertyType: selectedLead.otherPropertyType || "",
    budget: selectedLead.budget ?? "",
    location: selectedLead.location || "",
    carpetArea: selectedLead.carpetArea ?? "",
    builtUpArea: selectedLead.builtUpArea ?? "",
    superBuiltUpArea: selectedLead.superBuiltUpArea ?? "",
    leadSource: selectedLead.leadSource || "",
    status: selectedLead.status || "",
    followUpDate: selectedLead.followUpDate || "",
    additionalInformation:
      selectedLead.additionalInformation || "",
  });

  setEditingId(selectedLead.id);
  setCurrentPage("lead-form");
};

  // =========================================================
  // 16. SAVE / UPDATE LEAD
  // =========================================================

 const handleSubmitLead = async (e) => {
  e.preventDefault();

  try {
    const data = {
      ...lead,
      budget:
        lead.budget === ""
          ? null
          : Number(lead.budget),

      carpetArea:
        lead.carpetArea === ""
          ? null
          : Number(lead.carpetArea),

      builtUpArea:
        lead.builtUpArea === ""
          ? null
          : Number(lead.builtUpArea),

      superBuiltUpArea:
        lead.superBuiltUpArea === ""
          ? null
          : Number(lead.superBuiltUpArea),
    };

    if (editingId) {
      await updateLead(editingId, data);
      alert("Lead updated successfully.");
    } else {
      await addLead(data);
      alert("Lead added successfully.");
    }

    await refreshDashboard();

    setLead({
      ...emptyLead
    });

    setEditingId(null);
    setCurrentPage("leads");

  } catch (error) {
    console.error("Save Lead Error:", error);
    console.error("Server Response:", error.response?.data);

    alert(
      error.response?.data ||
      "Failed to save lead."
    );
  }
};

  // =========================================================
  // 17. DELETE LEAD
  // =========================================================

  const handleDeleteLead = async (id) => {

    if (!window.confirm("Are you sure you want to delete this lead?")) {
      return;
    }

    try {

      await deleteLead(id);
      await refreshDashboard();

      alert("Lead deleted successfully.");

    } catch (error) {
      console.error("Delete Lead Error:", error);
      alert("Failed to delete lead.");
    }
  };


  // =========================================================
  // 18. CONVERT LEAD -> CUSTOMER
  // =========================================================

 
const handleConvertLead = async (selectedLead) => {

  if (
    !window.confirm(
      `Convert ${selectedLead.name} into a customer?`
    )
  ) {
    return;
  }

  try {

    await convertLeadToCustomer(selectedLead.id);

    alert("Lead converted to customer successfully!");

    // Refresh dashboard
    await refreshDashboard();

    // Refresh customer list
    await fetchCustomers();

    // Open Customer module
    setCurrentPage("customers");

  } catch (error) {

    console.error("Convert Lead Error:", error);

    alert(
      error.response?.data ||
      "Failed to convert lead."
    );
  }
};



  // =========================================================
  // 19. CUSTOMER LIST
  // =========================================================

  const handleViewCustomers = () => {
    setCurrentPage("customers");
  };


  // =========================================================
  // 20. ADD CUSTOMER
  // =========================================================

  const handleAddCustomer = () => {
    setEditingCustomer(null);
    setCurrentPage("customer-form");
  };


  // =========================================================
  // 21. EDIT CUSTOMER
  // =========================================================

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setCurrentPage("customer-form");
  };


  // =========================================================
  // 22. CUSTOMER SAVED
  // =========================================================

  const handleCustomerSaved = async () => {
    setEditingCustomer(null);
    await loadCustomerDashboard();
    setCurrentPage("customers");
  };


  // =========================================================
  // 23. CUSTOMER CANCEL / BACK
  // =========================================================

  const handleCustomerCancel = () => {
    setEditingCustomer(null);
    setCurrentPage("customers");
  };

  

  // =========================================================
  // 24. PROPERTY LIST
  // =========================================================

  const handleViewProperties = () => {
    setCurrentPage("properties");
  };

// =========================================================
// FOLLOW-UP LIST
// =========================================================

const handleViewFollowUps = () => {
  setCurrentPage("followups");
};

const handleViewReports = () => {
  setCurrentPage("reports");
};

const handleViewAnalytics = () => {
  setCurrentPage("analytics");
};
  // =========================================================
  // 25. ADD PROPERTY
  // =========================================================

  const handleAddProperty = () => {
    setEditingProperty(null);
    setCurrentPage("property-form");
  };


  // =========================================================
  // 26. EDIT PROPERTY
  // =========================================================

  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setCurrentPage("property-form");
  };


  // =========================================================
  // 27. PROPERTY SAVED
  // =========================================================

  const handlePropertySaved = () => {
    setEditingProperty(null);
    setCurrentPage("properties");
  };


  // =========================================================
  // 28. PROPERTY CANCEL / BACK
  // =========================================================

  const handlePropertyCancel = () => {
    setEditingProperty(null);
    setCurrentPage("properties");
  };

const handleViewMessageTemplates = () => {
  setCurrentPage("message-templates");
};

const handleViewEmail = () => {
  setCurrentPage("email");
};
  // =========================================================
  // 29. FILTER LEADS
  // =========================================================

const filteredLeads = leads.filter((lead) => {
  const searchText = search.toLowerCase().trim();

  const matchesSearch =
    lead.name?.toLowerCase().includes(searchText) ||
    lead.phone?.toLowerCase().includes(searchText) ||
    lead.email?.toLowerCase().includes(searchText) ||
    lead.location?.toLowerCase().includes(searchText) ||
    lead.propertyType?.toLowerCase().includes(searchText);

  const matchesPurpose =
    purposeFilter === "" ||
    lead.purpose?.toLowerCase() ===
      purposeFilter.toLowerCase();

  const matchesCategory =
    categoryFilter === "" ||
    lead.category?.toLowerCase() ===
      categoryFilter.toLowerCase();

  const matchesStatus =
    statusFilter === "" ||
    lead.status?.toLowerCase() ===
      statusFilter.toLowerCase();

  return (
    matchesSearch &&
    matchesPurpose &&
    matchesCategory &&
    matchesStatus
  );
});

  // =========================================================
  // 30. LEAD PAGINATION
  // =========================================================

  const indexOfLastLead =
    currentLeadPage * leadsPerPage;

  const indexOfFirstLead =
    indexOfLastLead - leadsPerPage;

  const currentLeads =
    filteredLeads.slice(
      indexOfFirstLead,
      indexOfLastLead
    );

  const totalLeadPages =
    Math.max(
      1,
      Math.ceil(filteredLeads.length / leadsPerPage)
    );


  // =========================================================
  // 31. LOGIN PAGE
  // =========================================================

  if (!loggedInUser) {
    return (
      <Login
        onLogin={(user) => setLoggedInUser(user)}
      />
    );
  }



  // =========================================================
  // 32. COMMON BACK TO DASHBOARD
  // =========================================================

  const goToDashboard = async () => {
    await refreshDashboard();

    setEditingCustomer(null);
    setEditingProperty(null);
    setEditingId(null);

    setCurrentPage("dashboard");
  };


  // =========================================================
  // 33. MAIN APPLICATION UI
  // =========================================================

  return (
    <div className="min-vh-100 bg-light">

      {/* =====================================================
          TOP NAVBAR
          ===================================================== */}
<nav className="navbar navbar-expand-lg bg-white shadow-sm border-bottom sticky-top">

  <div className="container-fluid px-4">

    {/* Brand */}
    <button
      className="navbar-brand btn btn-link text-decoration-none fw-bold p-0 text-primary"
      onClick={goToDashboard}
      style={{ fontSize: "1.25rem" }}
    >
      🏠  PrimeNest Realty
    </button>

    {/* Right Side */}
    <div className="d-flex align-items-center gap-3">

      <span className="text-secondary d-none d-md-inline">
        👋 Welcome
      </span>

      <button
        className="btn btn-outline-danger btn-sm px-3"
        onClick={() => {
          localStorage.removeItem("token");
          setLoggedInUser(null);
          setCurrentPage("dashboard");
        }}
      >
        🚪 Logout
      </button>

    </div>

  </div>

</nav>

      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <main className="container py-4">

        {/* ===================================================
            DASHBOARD MODULE
            =================================================== */}


        {currentPage === "dashboard" && (

          
          <Dashboard
            totalLeads={totalLeads}
            newLeads={newLeads}
            interestedLeads={interestedLeads}
            convertedLeads={convertedLeads}

            totalCustomers={totalCustomers}
            interestedCustomers={interestedCustomers}
            convertedCustomers={convertedCustomers}

            leads={leads}

            onAddLead={handleAddLead}
            onViewLeads={handleViewLeads}
            onViewCustomers={handleViewCustomers}
            onViewProperties={handleViewProperties}
            onViewFollowUps={handleViewFollowUps}
            onViewReports={handleViewReports}
            onAnalytics={handleViewAnalytics}
            onViewMessageTemplates={handleViewMessageTemplates}
            onViewEmail={handleViewEmail}
          />
        )}

{/* ===================================================
    FOLLOW-UP REMINDERS MODULE
    =================================================== */}

{currentPage === "followups" && (

  <div>

    <FollowUpList
      onBack={goToDashboard}
      onEditLead={handleEditLead}
    />

  </div>

)}

{currentPage === "reports" && (
  <Reports
    onBack={() => setCurrentPage("dashboard")}
  />
)}

{currentPage === "analytics" && (
  <Analytics
    onBack={() => setCurrentPage("dashboard")}
  />
)}

        {/* ===================================================
            LEAD LIST MODULE
            =================================================== */}
{currentPage === "leads" && (
  <div className="card shadow-sm border-0">
    <div className="card-body">

      {/* PAGE HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h3 className="fw-bold mb-1">
            📋 Lead Management
          </h3>

          <small className="text-muted">
            Manage and track all your real estate leads
          </small>
        </div>

        <div className="d-flex gap-2">

          <button
            className="btn btn-primary"
            onClick={handleAddLead}
          >
            ➕ Add Lead
          </button>

          <button
            className="btn btn-outline-secondary"
            onClick={goToDashboard}
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
            🔎 Search Lead
          </label>

          <input
            type="text"
            className="form-control"
            placeholder="Name, phone, location..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentLeadPage(1);
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
              setCurrentLeadPage(1);
            }}
          >
            <option value="">All</option>
            <option value="Rent">Rent</option>
            <option value="Sell">Sell</option>
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
              setCurrentLeadPage(1);
            }}
          >
            <option value="">All</option>
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
              setCurrentLeadPage(1);
            }}
          >
            <option value="">All</option>
            <option value="New">New</option>
            <option value="Interested">
              Interested
            </option>
            <option value="Follow-up">
              Follow-up
            </option>
            <option value="Converted">
              Converted
            </option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        {/* DOWNLOAD */}
        <div className="col-md-2">
          <button
            type="button"
            className="btn btn-success w-80"
            onClick={handleDownloadLeads}
          >
            📥 Download
          </button>
        </div>

      </div>

      {/* LEAD TABLE */}
      {currentLeads.length === 0 ? (

        <div className="alert alert-info">
          No leads found.
        </div>

      ) : (

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
                <th>Follow-up</th>
                <th>Status</th>
                <th style={{ minWidth: "280px" }}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {currentLeads.map((item) => (

                <tr key={item.id}>

                  <td>{item.id}</td>

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
                          item.purpose === "Sell"
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
                    {item.propertyType || "-"}
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
                      ).toLocaleString("en-IN")}`
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>
                    {item.leadSource || "-"}
                  </td>

                  <td>
                    {item.followUpDate || "-"}
                  </td>

                  <td>
                    <span
                      className={
                        item.status === "Converted"
                          ? "badge bg-success"
                          : item.status === "Interested"
                          ? "badge bg-warning text-dark"
                          : item.status === "Follow-up"
                          ? "badge bg-info text-dark"
                          : item.status === "Lost"
                          ? "badge bg-danger"
                          : "badge bg-primary"
                      }
                    >
                      {item.status || "New"}
                    </span>
                  </td>

                  <td>

                    <div className="d-flex gap-2 flex-nowrap">

                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() =>
                          handleEditLead(item)
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() =>
                          handleDeleteLead(item.id)
                        }
                      >
                        🗑️ Delete
                      </button>

                      {item.status !== "Converted" ? (

                        <button
                          className="btn btn-sm btn-success"
                          onClick={() =>
                            handleConvertLead(item)
                          }
                        >
                          🔄 Convert
                        </button>

                      ) : (

                        <button
                          className="btn btn-sm btn-secondary"
                          disabled
                        >
                          ✅ Converted
                        </button>

                      )}

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

      {/* PAGINATION */}
      {filteredLeads.length > 0 && (

        <div className="d-flex justify-content-between align-items-center mt-4">

          <button
            className="btn btn-outline-secondary"
            disabled={currentLeadPage === 1}
            onClick={() =>
              setCurrentLeadPage(
                currentLeadPage - 1
              )
            }
          >
            ← Previous
          </button>

          <span className="fw-semibold">
            Page {currentLeadPage} of {totalLeadPages}
          </span>

          <button
            className="btn btn-primary"
            disabled={
              currentLeadPage >= totalLeadPages
            }
            onClick={() =>
              setCurrentLeadPage(
                currentLeadPage + 1
              )
            }
          >
            Next →
          </button>

        </div>

      )}

    </div>
  </div>
)}

        {/* ===================================================
            LEAD FORM MODULE
            =================================================== */}

      {currentPage === "lead-form" && (
  <div className="card shadow-sm border-0">
    <div className="card-body">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>
          <h3 className="fw-bold mb-1">
            {editingId
              ? "✏️ Update Lead"
              : "➕ Add New Lead"}
          </h3>

          <small className="text-muted">
            Capture customer enquiry and property requirements
          </small>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setLead({
              ...emptyLead
            });
            setEditingId(null);
            setCurrentPage("leads");
          }}
        >
          ← Back to Leads
        </button>

      </div>

      <form onSubmit={handleSubmitLead}>

        {/* LEAD INFORMATION */}
        <h5 className="fw-bold mb-3">
          👤 Lead Information
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
              value={lead.name}
              onChange={handleLeadChange}
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
              value={lead.phone}
              onChange={handleLeadChange}
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
              value={lead.email}
              onChange={handleLeadChange}
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
              value={lead.enquiryDateTime}
              onChange={handleLeadChange}
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
              value={lead.purpose}
              onChange={handleLeadChange}
            >
              <option value="">Select</option>
              <option value="Sell">Sell</option>
              <option value="Rent">Rent</option>
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
              value={lead.category}
              onChange={(e) => {
                const value = e.target.value;

                setLead((previous) => ({
                  ...previous,
                  category: value,
                  propertyType: "",
                  otherPropertyType: "",
                }));
              }}
            >
              <option value="">Select</option>

              <option value="Residential">
                Residential
              </option>

              <option value="Commercial">
                Commercial
              </option>
            </select>
          </div>

          {/* RESIDENTIAL TYPE */}
          {lead.category === "Residential" && (
            <div className="col-md-6 mb-3">

              <label className="form-label">
                Residential Property Type
              </label>

              <select
                className="form-select"
                name="propertyType"
                value={lead.propertyType}
                onChange={handleLeadChange}
              >
                <option value="">Select</option>
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
          {lead.category === "Commercial" && (
            <div className="col-md-6 mb-3">

              <label className="form-label">
                Commercial Property Type
              </label>

              <select
                className="form-select"
                name="propertyType"
                value={lead.propertyType}
                onChange={handleLeadChange}
              >
                <option value="">Select</option>

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
          {lead.propertyType === "Other" && (
            <div className="col-md-6 mb-3">

              <label className="form-label">
                Specify Property Type
              </label>

              <input
                type="text"
                className="form-control"
                name="otherPropertyType"
                value={lead.otherPropertyType}
                onChange={handleLeadChange}
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
              value={lead.carpetArea}
              onChange={handleLeadChange}
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
              value={lead.builtUpArea}
              onChange={handleLeadChange}
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
              value={lead.superBuiltUpArea}
              onChange={handleLeadChange}
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
              value={lead.budget}
              onChange={handleLeadChange}
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
              value={lead.location}
              onChange={handleLeadChange}
              placeholder="Enter location"
            />
          </div>

        </div>

        <hr />

        {/* LEAD TRACKING */}
        <h5 className="fw-bold mb-3">
          📌 Lead Tracking
        </h5>

        <div className="row">

          <div className="col-md-6 mb-3">

            <label className="form-label">
              Lead Source
            </label>

            <select
              className="form-select"
              name="leadSource"
              value={lead.leadSource}
              onChange={handleLeadChange}
            >
              <option value="">Select</option>
              <option value="Website">Website</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="99acres">99acres</option>
              <option value="Referral">Referral</option>
              <option value="Walk-in">Walk-in</option>
              <option value="Other">Other</option>
            </select>

          </div>

          <div className="col-md-6 mb-3">

            <label className="form-label">
              Status
            </label>

            <select
              className="form-select"
              name="status"
              value={lead.status}
              onChange={handleLeadChange}
            >
              <option value="">Select</option>
              <option value="New">New</option>
              <option value="Interested">
                Interested
              </option>
              <option value="Converted">
                Converted
              </option>
              <option value="Lost">
                Lost
              </option>
            </select>

          </div>

          <div className="col-md-6 mb-3">

            <label className="form-label">
              Follow-up Date
            </label>

            <input
              type="date"
              className="form-control"
              name="followUpDate"
              value={lead.followUpDate}
              onChange={handleLeadChange}
            />

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
            value={lead.additionalInformation}
            onChange={handleLeadChange}
            placeholder="Add any additional requirements, preferences or notes..."
          />

        </div>

        {/* BUTTONS */}
        <div className="mt-4">

          <button
            type="submit"
            className="btn btn-success me-2"
          >
            💾{" "}
            {editingId
              ? "Update Lead"
              : "Save Lead"}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setLead({
                ...emptyLead
              });

              setEditingId(null);
              setCurrentPage("leads");
            }}
          >
            Cancel
          </button>

        </div>

      </form>

    </div>
  </div>
)}
{currentPage === "message-templates" && (
  <MessageTemplateList
    onBack={() => setCurrentPage("dashboard")}
  />
)}
        {/* ===================================================
            CUSTOMER LIST MODULE
            =================================================== */}

        {currentPage === "customers" && (

          <div>

            <CustomerList
              onAddCustomer={handleAddCustomer}
              onEditCustomer={handleEditCustomer}
              onBackToDashboard={() => setCurrentPage("dashboard")}
            />


          </div>
        )}

      {/* ===================================================
    CUSTOMER FORM MODULE
    =================================================== */}

{currentPage === "customer-form" && (
  <div className="card shadow-sm border-0">
    <div className="card-body">

      <AddCustomer
        editingCustomer={editingCustomer}
        onSave={handleCustomerSaved}
        onCancel={handleCustomerCancel}
      />

      <div className="text-center mt-3">

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setEditingCustomer(null);
            setCurrentPage("dashboard");
          }}
        >
          ← Back to Dashboard
        </button>

      </div>

    </div>
  </div>
)}

        {/* ===================================================
            PROPERTY LIST MODULE
            =================================================== */}

        {currentPage === "properties" && (

          <div>

            <PropertyList
              onAddProperty={handleAddProperty}
              onEditProperty={handleEditProperty}
              goToDashboard ={() => setCurrentPage("dashboard")}
            />

            <div className="text-center mt-3">

              

            </div>

          </div>
        )}


        {/* ===================================================
            PROPERTY FORM MODULE
            =================================================== */}

        {currentPage === "property-form" && (

          <div>

            <PropertyForm
              selectedProperty={editingProperty}
              onSave={handlePropertySaved}
              onCancel={handlePropertyCancel}
            />

            <div className="text-center mt-3">

              <button
                className="btn btn-secondary"
                onClick={handlePropertyCancel}
              >
                ← Back to Properties
              </button>

            </div>

          </div>
        )}

{currentPage === "email" && (
  <EmailSender
    onBack={() => setCurrentPage("dashboard")}
  />
)}
      </main>

    </div>
  );
}

export default App;
