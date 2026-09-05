import { useState } from "react";
import { addTemplate } from "../services/MessageTemplateService";

function AddMessageTemplate({ onSaved, onCancel }) {

  const [template, setTemplate] = useState({
    name: "",
    type: "EMAIL",
    message: "",
    status: "ACTIVE",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setTemplate((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setSaving(true);

      await addTemplate(template);

      alert("Message template created successfully.");

      if (onSaved) {
        onSaved();
      }

    } catch (error) {

      console.error("Create Template Error:", error);

      alert("Failed to create message template.");

    } finally {

      setSaving(false);

    }
  };

  return (

    <div className="card shadow-sm border-0">

      <div className="card-body">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h3 className="fw-bold mb-1">
              ➕ Add Message Template
            </h3>

            <p className="text-muted mb-0">
              Create a reusable Email or WhatsApp message
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            ← Back
          </button>

        </div>


        <form onSubmit={handleSubmit}>

          {/* TEMPLATE NAME */}

          <div className="mb-3">

            <label className="form-label fw-semibold">
              Template Name
            </label>

            <input
              type="text"
              className="form-control"
              name="name"
              value={template.name}
              onChange={handleChange}
              placeholder="Example: New Lead Welcome"
              required
            />

          </div>


          {/* TYPE */}

          <div className="mb-3">

            <label className="form-label fw-semibold">
              Template Type
            </label>

            <select
              className="form-select"
              name="type"
              value={template.type}
              onChange={handleChange}
              required
            >

              <option value="EMAIL">
                Email
              </option>

              <option value="WHATSAPP">
                WhatsApp
              </option>

            </select>

          </div>


          {/* MESSAGE */}

          <div className="mb-3">

            <label className="form-label fw-semibold">
              Message
            </label>

            <textarea
              className="form-control"
              name="message"
              rows="5"
              value={template.message}
              onChange={handleChange}
              placeholder="Enter your message..."
              required
            />

          </div>


          {/* STATUS */}

          <div className="mb-4">

            <label className="form-label fw-semibold">
              Status
            </label>

            <select
              className="form-select"
              name="status"
              value={template.status}
              onChange={handleChange}
            >

              <option value="ACTIVE">
                Active
              </option>

              <option value="INACTIVE">
                Inactive
              </option>

            </select>

          </div>


          {/* BUTTONS */}

          <button
            type="submit"
            className="btn btn-success me-2"
            disabled={saving}
          >
            {saving ? "Saving..." : "💾 Save Template"}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>

        </form>

      </div>

    </div>

  );
}

export default AddMessageTemplate;
