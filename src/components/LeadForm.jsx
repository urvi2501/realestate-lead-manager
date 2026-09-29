
import { useState } from "react";
import { createLead, updateLead } from "../services/LeadService";

function LeadForm({ lead, onSuccess, onCancel }) {

  const [formData, setFormData] = useState({
    name: lead?.name || "",
    phone: lead?.phone || "",
    email: lead?.email || "",

    // New requirement fields
    purpose: lead?.purpose || "",
    category: lead?.category || "",
    propertyType: lead?.propertyType || "",
    otherPropertyType: lead?.otherPropertyType || "",

    carpetArea: lead?.carpetArea || "",
    builtUpArea: lead?.builtUpArea || "",
    superBuiltUpArea: lead?.superBuiltUpArea || "",

    budget: lead?.budget || "",
    location: lead?.location || "",
    leadSource: lead?.leadSource || "",
    status: lead?.status || "New",
    followUpDate: lead?.followUpDate || "",

    additionalInformation: lead?.additionalInformation || "",
  });

  const [loading, setLoading] = useState(false);

  // Automatic enquiry date and time
  const [enquiryDateTime] = useState(
    lead?.createdAt
      ? new Date(lead.createdAt).toLocaleString("en-IN")
      : new Date().toLocaleString("en-IN")
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear property type when category changes
    if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        category: value,
        propertyType: "",
        otherPropertyType: "",
      }));
    }

    // Clear "Other" textbox when normal property type selected
    if (name === "propertyType" && value !== "Other") {
      setFormData((prev) => ({
        ...prev,
        propertyType: value,
        otherPropertyType: "",
      }));
    }
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

        carpetArea: formData.carpetArea
          ? Number(formData.carpetArea)
          : null,

        builtUpArea: formData.builtUpArea
          ? Number(formData.builtUpArea)
          : null,

        superBuiltUpArea: formData.superBuiltUpArea
          ? Number(formData.superBuiltUpArea)
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

            {/* ========================= */}
            {/* LEAD INFORMATION */}
            {/* ========================= */}

            <h5 className="mb-3">Lead Information</h5>

            <div className="row">

              {/* Enquiry Date & Time */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Enquiry Date & Time
                </label>

                <input
                  type="text"
                  className="form-control"
                  value={enquiryDateTime}
                  readOnly
                />
              </div>

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

              {/* Location - UNCHANGED */}
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

              {/* Status - OPTIONAL */}
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
                  <option value="">Select Status</option>
                  <option value="New">New</option>
                  <option value="Interested">Interested</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Converted">Converted</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

            </div>


            {/* ========================= */}
            {/* PROPERTY REQUIREMENT */}
            {/* ========================= */}

            <h5 className="mt-4 mb-3">
              Property Requirement
            </h5>

            <div className="row">

              {/* Purpose */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Property Requirement
                </label>

                <select
                  name="purpose"
                  className="form-select"
                  value={formData.purpose}
                  onChange={handleChange}
                >
                  <option value="">Select Requirement</option>
                  <option value="Sell">Sell</option>
                  <option value="Rent">Rent</option>
                </select>
              </div>

              {/* Category */}
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  Property Category
                </label>

                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">
                    Select Category
                  </option>

                  <option value="Residential">
                    Residential
                  </option>

                  <option value="Commercial">
                    Commercial
                  </option>
                </select>
              </div>


              {/* ========================= */}
              {/* RESIDENTIAL */}
              {/* ========================= */}

              {formData.category === "Residential" && (
                <>
                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Residential Property Type
                    </label>

                    <select
                      name="propertyType"
                      className="form-select"
                      value={formData.propertyType}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select Property Type
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

                      <option value="Serviced Apartment">
                        Serviced Apartment
                      </option>

                      <option value="Farmhouse">
                        Farmhouse
                      </option>

                      <option value="Other">
                        Other
                      </option>

                    </select>

                  </div>

                  {/* Other Residential */}
                  {formData.propertyType === "Other" && (
                    <div className="col-md-6 mb-3">

                      <label className="form-label">
                        Other Residential Property Type
                      </label>

                      <input
                        type="text"
                        name="otherPropertyType"
                        className="form-control"
                        value={formData.otherPropertyType}
                        onChange={handleChange}
                        placeholder="Enter property type"
                      />

                    </div>
                  )}
                </>
              )}


              {/* ========================= */}
              {/* COMMERCIAL */}
              {/* ========================= */}

              {formData.category === "Commercial" && (
                <>
                  <div className="col-md-6 mb-3">

                    <label className="form-label">
                      Commercial Property Type
                    </label>

                    <select
                      name="propertyType"
                      className="form-select"
                      value={formData.propertyType}
                      onChange={handleChange}
                    >

                      <option value="">
                        Select Property Type
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

                      <option value="Hospitality">
                        Hospitality
                      </option>

                      <option value="Other">
                        Other
                      </option>

                    </select>

                  </div>

                  {/* Other Commercial */}
                  {formData.propertyType === "Other" && (
                    <div className="col-md-6 mb-3">

                      <label className="form-label">
                        Other Commercial Property Type
                      </label>

                      <input
                        type="text"
                        name="otherPropertyType"
                        className="form-control"
                        value={formData.otherPropertyType}
                        onChange={handleChange}
                        placeholder="Enter property type"
                      />

                    </div>
                  )}
                </>
              )}

            </div>


            {/* ========================= */}
            {/* AREA REQUIREMENT */}
            {/* ========================= */}

            <h5 className="mt-4 mb-3">
              Area Requirement
            </h5>

            <div className="row">

              {/* Carpet Area */}
              <div className="col-md-4 mb-3">

                <label className="form-label">
                  Carpet Area (sq.ft.)
                </label>

                <input
                  type="number"
                  name="carpetArea"
                  className="form-control"
                  value={formData.carpetArea}
                  onChange={handleChange}
                  placeholder="Optional"
                />

              </div>

              {/* Built-up Area */}
              <div className="col-md-4 mb-3">

                <label className="form-label">
                  Built-up Area (sq.ft.)
                </label>

                <input
                  type="number"
                  name="builtUpArea"
                  className="form-control"
                  value={formData.builtUpArea}
                  onChange={handleChange}
                  placeholder="Optional"
                />

              </div>

              {/* Super Built-up Area */}
              <div className="col-md-4 mb-3">

                <label className="form-label">
                  Super Built-up Area (sq.ft.)
                </label>

                <input
                  type="number"
                  name="superBuiltUpArea"
                  className="form-control"
                  value={formData.superBuiltUpArea}
                  onChange={handleChange}
                  placeholder="Optional"
                />

              </div>

            </div>


            {/* ========================= */}
            {/* ADDITIONAL INFORMATION */}
            {/* ========================= */}

            <h5 className="mt-4 mb-3">
              Additional Information
            </h5>

            <div className="mb-3">

              <textarea
                name="additionalInformation"
                className="form-control"
                rows="4"
                value={formData.additionalInformation}
                onChange={handleChange}
                placeholder="Enter any additional requirement or information (optional)"
              />

            </div>


            {/* ========================= */}
            {/* BUTTONS */}
            {/* ========================= */}

            <div className="mt-4">

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

