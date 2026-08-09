

import { useState, useEffect } from "react";
import axios from "axios";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {


  // Page States
  const [showForm, setShowForm] = useState(false);
  const [showLeads, setShowLeads] = useState(false);
const [loggedInUser, setLoggedInUser] = useState(null);
  // Lead List
  const [leads, setLeads] = useState([]);

  // Edit
  const [editingId, setEditingId] = useState(null);

  // Search
  const [search, setSearch] = useState("");

  // Filter
  const [statusFilter, setStatusFilter] = useState("");

  // Dashboard Counts
  const [totalLeads, setTotalLeads] = useState(0);
  const [newLeads, setNewLeads] = useState(0);
  const [interestedLeads, setInterestedLeads] = useState(0);
  const [convertedLeads, setConvertedLeads] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
   const leadsPerPage = 5;

  const handleChange = (e) => {
  setLead({
    ...lead,
    [e.target.name]: e.target.value,
  });
};
  const loadDashboard = async () => {
  try {
    const response = await axios.get("http://localhost:8080/api/leads");

    const data = response.data;
    console.log("Dashboard API:", data);
    setLeads(data);
    setTotalLeads(data.length);

    setNewLeads(
      data.filter((lead) => lead.status === "New").length
    );

    setInterestedLeads(
      data.filter((lead) => lead.status === "Interested").length
    );

    setConvertedLeads(
      data.filter((lead) => lead.status === "Converted").length
    );

  } catch (error) {
    console.error(error);
  }
};

const handleViewLeads = async () => {
  await loadDashboard();
  setShowLeads(true);
  setShowForm(false);
};

const handleEdit = (lead) => {
  setLead({
    name: lead.name || "",
    phone: lead.phone || "",
    email: lead.email || "",
    propertyType: lead.propertyType || "",
    budget: lead.budget || "",
    location: lead.location || "",
    leadSource: lead.leadSource || "",
    status: lead.status || "",
    followUpDate: lead.followUpDate || "",
  });

  setEditingId(lead.id);

  setShowLeads(false);
  setShowForm(true);
};

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this lead?")) {
    return;
  }

  try {
    await axios.delete(`http://localhost:8080/api/leads/${id}`);

    await loadDashboard();

    setShowLeads(true);
    setShowForm(false);

  } catch (error) {
    console.error("Delete failed:", error);
    alert("Failed to delete lead.");
  }
};
const handleSubmit = async (e) => {

e.preventDefault();

try{

if(editingId){

await axios.put(
`http://localhost:8080/api/leads/${editingId}`,
lead
);

}else{

  console.log("Submitting lead:", lead);
await axios.post(
"http://localhost:8080/api/leads",
lead
);

}

await loadDashboard();

setShowForm(false);
setShowLeads(false);
setEditingId(null);

setLead({
name:"",
phone:"",
email:"",
propertyType:"",
budget:"",
location:"",
leadSource:"",
status:"",
followUpDate:""
});

}catch(error){

console.error(error);

}

};
useEffect(() => {
  loadDashboard();
}, []);

  // Lead Form
  const [lead, setLead] = useState({
    name: "",
    phone: "",
    email: "",
    propertyType: "",
    budget: "",
    location: "",
    leadSource: "",
    status: "",
    followUpDate: "",
  });

  const filteredLeads = leads
  .filter((lead) =>
    lead.name?.toLowerCase().includes(search.toLowerCase())
  )
  .filter((lead) =>
    statusFilter === "" || lead.status === statusFilter
  );

const indexOfLastLead = currentPage * leadsPerPage;
const indexOfFirstLead = indexOfLastLead - leadsPerPage;

const currentLeads = filteredLeads.slice(
  indexOfFirstLead,
  indexOfLastLead
);

if (!loggedInUser) {
    return (
      <Login onLogin={(user) => setLoggedInUser(user)} />
    );
  }

  return (
    
  <div className="container mt-4">

    <h2 className="text-center text-primary mb-4">
      🏠 Real Estate Lead Manager
    </h2>

<div className="text-end mb-3">
  <button
    className="btn btn-outline-danger"
    onClick={() => setLoggedInUser(null)}
  >
    🚪 Logout
  </button>
</div>
  {!showForm && !showLeads && (
  <Dashboard
    totalLeads={totalLeads}
    newLeads={newLeads}
    interestedLeads={interestedLeads}
    convertedLeads={convertedLeads}
    leads={leads}
    onAddLead={() => {
      setLead({
        name: "",
        phone: "",
        email: "",
        propertyType: "",
        budget: "",
        location: "",
        leadSource: "",
        status: "",
        followUpDate: "",
      });

      setEditingId(null);
      setShowLeads(false);
      setShowForm(true);
    }}
    onViewLeads={handleViewLeads}
  />
)}










    {showForm && (

<div className="container mt-4">

<h3>{editingId ? "Update Lead" : "Add New Lead"}</h3>

<form onSubmit={handleSubmit}>

<div className="row">

<div className="col-md-6 mb-3">
<label>Name</label>
<input
className="form-control"
type="text"
name="name"
value={lead.name}
onChange={handleChange}
required
/>
</div>

<div className="col-md-6 mb-3">
<label>Phone</label>
<input
className="form-control"
type="text"
name="phone"
value={lead.phone}
onChange={handleChange}
required
/>
</div>

<div className="col-md-6 mb-3">
<label>Email</label>
<input
className="form-control"
type="email"
name="email"
value={lead.email}
onChange={handleChange}
/>
</div>

<div className="col-md-6 mb-3">
<label>Property Type</label>

<select
className="form-select"
name="propertyType"
value={lead.propertyType}
onChange={handleChange}
>

<option value="">Select</option>
<option>Flat</option>
<option>House</option>
<option>Villa</option>
<option>Commercial</option>

</select>

</div>

<div className="col-md-6 mb-3">

<label>Budget</label>

<input
className="form-control"
type="number"
name="budget"
value={lead.budget}
onChange={handleChange}
/>

</div>

<div className="col-md-6 mb-3">

<label>Location</label>

<input
className="form-control"
type="text"
name="location"
value={lead.location}
onChange={handleChange}
/>

</div>

<div className="col-md-6 mb-3">

<label>Lead Source</label>

<select
className="form-select"
name="leadSource"
value={lead.leadSource}
onChange={handleChange}
>

<option value="">Select</option>
<option>Website</option>
<option>Facebook</option>
<option>Instagram</option>
<option>99acres</option>
<option>Referral</option>

</select>

</div>

<div className="col-md-6 mb-3">

<label>Status</label>

<select
className="form-select"
name="status"
value={lead.status}
onChange={handleChange}
>

<option value="">Select</option>
<option>New</option>
<option>Interested</option>
<option>Converted</option>

</select>

</div>

<div className="col-md-6 mb-3">

<label>Follow-up Date</label>

<input
className="form-control"
type="date"
name="followUpDate"
value={lead.followUpDate}
onChange={handleChange}
/>

</div>

</div>

<button className="btn btn-primary me-2">

{editingId ? "Update Lead" : "Save Lead"}

</button>

<button
type="button"
className="btn btn-secondary"
onClick={()=>{
setShowForm(false);
setEditingId(null);
}}
>

Cancel

</button>

</form>

</div>

    )}

     {showLeads && (

<div>


<h3 className="mt-4 mb-3">All Leads</h3>

<div className="mb-3">
  <input
    type="text"
    className="form-control"
    placeholder="Search lead by name..."
    value={search}
    onChange={(e) => {
  setSearch(e.target.value);
  setCurrentPage(1);
}}
  />


<select
  className="form-select mt-2"
  value={statusFilter}
onChange={(e) => {
  setStatusFilter(e.target.value);
  setCurrentPage(1);
}}
>
  <option value="">All Status</option>
  <option value="New">New</option>
  <option value="Contacted">Contacted</option>
  <option value="Interested">Interested</option>
  <option value="Converted">Converted</option>
  <option value="Closed">Closed</option>
</select>

</div>

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
  {currentLeads.map((lead) => (
    <tr key={lead.id}>
      <td>{lead.id}</td>
      <td>{lead.name}</td>
      <td>{lead.phone}</td>
      <td>{lead.email}</td>
      <td>{lead.propertyType}</td>
      <td>{lead.budget}</td>
      <td>{lead.status}</td>

      <td>
        <button
          className="btn btn-sm btn-warning me-2"
          onClick={() => handleEdit(lead)}
        >
          Edit
        </button>

        <button
          className="btn btn-sm btn-danger"
          onClick={() => handleDelete(lead.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>

</table>
<div className="d-flex justify-content-between align-items-center mt-3">

  <button
    className="btn btn-secondary"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
  >
    ← Previous
  </button>

  <span>
    Page {currentPage}
  </span>

  <button
    className="btn btn-primary"
    disabled={indexOfLastLead >= filteredLeads.length}
    onClick={() => setCurrentPage(currentPage + 1)}
  >
    Next →
  </button>

</div>
<button
className="btn btn-secondary"
onClick={() => {
  loadDashboard();
  setShowLeads(false);
  setShowForm(false);
}}
>

⬅ Back to Dashboard

</button>

</div>

)}



  </div>
);
}

export default App;