
import { useEffect, useState } from "react";
import AddMessageTemplate from "./AddMessageTemplate";
import {
  getAllTemplates,
  updateTemplate,
  deleteTemplate,
} from "../services/MessageTemplateService";

function MessageTemplateList({ onBack }) {

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  // =====================================================
  // EDIT STATE
  // =====================================================

  const [editingTemplate, setEditingTemplate] = useState(null);

  // =====================================================
  // LOAD TEMPLATES
  // =====================================================

  const loadTemplates = async () => {

    try {

      setLoading(true);

      const response = await getAllTemplates();

      console.log("Message Templates API:", response.data);

      setTemplates(response.data || []);

    } catch (error) {

      console.error(
        "Message Template Error:",
        error
      );

      alert("Failed to load message templates.");

    } finally {

      setLoading(false);

    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    loadTemplates();

  }, []);

  // =====================================================
  // DELETE TEMPLATE
  // =====================================================

  const handleDeleteTemplate = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this template?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      await deleteTemplate(id);

      alert("Template deleted successfully.");

      await loadTemplates();

    } catch (error) {

      console.error(
        "Delete Template Error:",
        error
      );

      alert("Failed to delete template.");

    }
  };

  // =====================================================
  // EDIT TEMPLATE
  // =====================================================

  const handleEditTemplate = (template) => {

    setEditingTemplate({
      id: template.id,
      name: template.name || "",
      type: template.type || "EMAIL",
      message: template.message || "",
      status: template.status || "ACTIVE",
    });

  };

  // =====================================================
  // EDIT INPUT CHANGE
  // =====================================================

  const handleEditChange = (e) => {

    const { name, value } = e.target;

    setEditingTemplate((previous) => ({
      ...previous,
      [name]: value,
    }));

  };

  // =====================================================
  // UPDATE TEMPLATE
  // =====================================================

  const handleUpdateTemplate = async (e) => {

    e.preventDefault();

    try {

      await updateTemplate(
        editingTemplate.id,
        {
          name: editingTemplate.name,
          type: editingTemplate.type,
          message: editingTemplate.message,
          status: editingTemplate.status,
        }
      );

      alert("Message template updated successfully.");

      setEditingTemplate(null);

      await loadTemplates();

    } catch (error) {

      console.error(
        "Update Template Error:",
        error
      );

      alert("Failed to update message template.");

    }
  };

  // =====================================================
  // ADD TEMPLATE FORM
  // =====================================================

  if (showAddForm) {

    return (

      <AddMessageTemplate

        onSaved={async () => {

          setShowAddForm(false);

          await loadTemplates();

        }}

        onCancel={() => {

          setShowAddForm(false);

        }}

      />

    );

  }

  // =====================================================
  // EDIT TEMPLATE FORM
  // =====================================================

  if (editingTemplate) {

    return (

      <div className="card shadow-sm border-0">

        <div className="card-body">

          <div className="d-flex justify-content-between align-items-center mb-4">

            <div>

              <h3 className="fw-bold mb-1">
                ✏️ Edit Message Template
              </h3>

              <p className="text-muted mb-0">
                Update your reusable Email or WhatsApp message
              </p>

            </div>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditingTemplate(null)}
            >
              ← Back
            </button>

          </div>

          <form onSubmit={handleUpdateTemplate}>

            {/* TEMPLATE NAME */}

            <div className="mb-3">

              <label className="form-label fw-semibold">
                Template Name
              </label>

              <input
                type="text"
                className="form-control"
                name="name"
                value={editingTemplate.name}
                onChange={handleEditChange}
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
                value={editingTemplate.type}
                onChange={handleEditChange}
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
                value={editingTemplate.message}
                onChange={handleEditChange}
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
                value={editingTemplate.status}
                onChange={handleEditChange}
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
            >
              💾 Update Template
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditingTemplate(null)}
            >
              Cancel
            </button>

          </form>

        </div>

      </div>

    );

  }

  // =====================================================
  // TEMPLATE LIST
  // =====================================================

  return (

    <div className="card shadow-sm border-0">

      <div className="card-body">

        {/* HEADER */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>

            <h3 className="fw-bold mb-1">
              💬 Message Templates
            </h3>

            <p className="text-muted mb-0">
              Manage reusable email and WhatsApp message templates
            </p>

          </div>

          <div className="d-flex gap-2">

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowAddForm(true)}
            >
              ➕ Add Template
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={onBack}
            >
              ← Back to Dashboard
            </button>

          </div>

        </div>

        {/* LOADING */}

        {loading && (

          <div className="text-center py-4">

            <h5>
              Loading templates...
            </h5>

          </div>

        )}

        {/* EMPTY */}

        {!loading && templates.length === 0 && (

          <div className="alert alert-info">
            No message templates found.
          </div>

        )}

        {/* TABLE */}

        {!loading && templates.length > 0 && (

          <div className="table-responsive">

            <table className="table table-bordered table-hover align-middle">

              <thead className="table-dark">

                <tr>

                  <th>ID</th>
                  <th>Template Name</th>
                  <th>Type</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Actions</th>

                </tr>

              </thead>

              <tbody>

                {templates.map((template) => (

                  <tr key={template.id}>

                    <td>
                      {template.id}
                    </td>

                    <td>
                      <strong>
                        {template.name}
                      </strong>
                    </td>

                    <td>

                      <span
                        className={
                          template.type === "WHATSAPP"
                            ? "badge bg-success"
                            : "badge bg-primary"
                        }
                      >
                        {template.type}
                      </span>

                    </td>

                    <td>
                      {template.message}
                    </td>

                    <td>

                      <span
                        className={
                          template.status === "ACTIVE"
                            ? "badge bg-success"
                            : "badge bg-secondary"
                        }
                      >
                        {template.status || "ACTIVE"}
                      </span>

                    </td>

                    <td>

                      <div className="d-flex gap-2">

                        <button
                          type="button"
                          className="btn btn-sm btn-warning"
                          onClick={() =>
                            handleEditTemplate(template)
                          }
                        >
                          ✏️ Edit
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            handleDeleteTemplate(template.id)
                          }
                        >
                          🗑️ Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>

  );

}

export default MessageTemplateList;

