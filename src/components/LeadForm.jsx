import { useState } from "react";
import { createLead, updateLead } from "../services/LeadService";

function LeadForm({ lead, onSuccess, onCancel }) {

  const [formData, setFormData] = useState({
    name: lead?.name || "",
    phone: lead?.phone || "",
    email: lead?.email || "",
    propertyType: lead?.propertyType || "",
    budget: lead?.budget || "",
    location: lead?.location || "",
    leadSource: lead?.leadSource || "",
    status: lead?.status || "New",
    followUpDate: lead?.followUpDate || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = {
        ...formData,
        budget: formData.budget
          ? Number(formData.budget)
          : null,
      };

      if (lead?.id) {
        await updateLead(lead.id, data);
        alert("Lead updated successfully!");
      } else {
        await createLead(data);
        alert("Lead created successfully!");
      }

      onSuccess();

    } catch (error) {

      console.error("Lead Save Error:", error);
      alert("Failed to save lead.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">

      <div className="card shadow">

        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">
            {lead ? "✏️ Edit Lead" : "➕ Add New Lead"}
          </h4>
        </div>

        <div className="card-body">

          <form onSubmit={handleSubmit}>

            <div className="row">

              {/* Name */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
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
                  name="phone"
                  className="form-control"
                  value={formData.phone}
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
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Property Type */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Property Type
                </label>

                <select
                  name="propertyType"
                  className="form-select"
                  value={formData.propertyType}
                  onChange={handleChange}
                >
                  <option value="">Select Property</option>
                  <option value="Flat">Flat</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Plot">Plot</option>
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
                  name="budget"
                  className="form-control"
                  value={formData.budget}
                  onChange={handleChange}
                />
              </div>

              {/* Location */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Location
                </label>

                <input
                  type="text"
                  name="location"
                  className="form-control"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              {/* Lead Source */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Lead Source
                </label>

                <select
                  name="leadSource"
                  className="form-select"
                  value={formData.leadSource}
                  onChange={handleChange}
                >
                  <option value="">Select Source</option>
                  <option value="Website">Website</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Google">Google</option>
                  <option value="Referral">Referral</option>
                  <option value="Walk-in">Walk-in</option>
                </select>
              </div>

              {/* Status */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Status
                </label>

                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="New">New</option>
                  <option value="Interested">Interested</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Converted">Converted</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              {/* Follow-up Date */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Follow-up Date
                </label>

                <input
                  type="date"
                  name="followUpDate"
                  className="form-control"
                  value={formData.followUpDate}
                  onChange={handleChange}
                />
              </div>

            </div>

            {/* Buttons */}
            <div className="mt-3">

              <button
                type="submit"
                className="btn btn-primary me-2"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : lead
                    ? "Update Lead"
                    : "Save Lead"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      </div>

    </div>
  );
}

export default LeadForm;
