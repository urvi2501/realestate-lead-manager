import { useEffect, useState } from "react";
import axios from "axios";

function MessageTemplate({ onBack }) {

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [type, setType] = useState("EMAIL");
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState(null);

  const loadTemplates = async () => {

    try {

      const token = localStorage.getItem("token");

      const response = await axios.get(
        "https://realestate-lead-manager-backend-production.up.railway.app/api/templates",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      console.log("Message Templates API:", response.data);


      setTemplates(response.data);

    } catch (error) {
console.error("Template API Error:", error);

  console.log("Status:", error.response?.status);

  console.log("Response:", error.response?.data);

  console.log("Request URL:", error.config?.url);

  alert(
    `Template API failed: ${error.response?.status || "No response"}`
  );


    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    loadTemplates();

  }, []);


  const handleSave = async (e) => {

    e.preventDefault();

    if (!name.trim() || !message.trim()) {

      alert("Please enter template name and message.");

      return;

    }

    try {

      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const templateData = {
        name,
        type,
        message
      };


      if (editingId) {

        await axios.put(
          `https://realestate-lead-manager-backend-production.up.railway.app/api/templates/${editingId}`,
          templateData,
          config
        );

        alert("Template updated successfully.");

      } else {

        await axios.post(
          "https://realestate-lead-manager-backend-production.up.railway.app/api/templates",
          templateData,
          config
        );

        alert("Template created successfully.");

      }

      setName("");
      setType("EMAIL");
      setMessage("");
      setEditingId(null);

      loadTemplates();

    } catch (error) {

      console.error("Save Template Error:", error);

      alert("Failed to save template.");

    }

  };


  const handleEdit = (template) => {

    setEditingId(template.id);
    setName(template.name);
    setType(template.type);
    setMessage(template.message);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };


  const handleDelete = async (id) => {

    if (!window.confirm("Are you sure you want to delete this template?")) {
      return;
    }

    try {

      const token = localStorage.getItem("token");

      await axios.delete(
        `https://realestate-lead-manager-backend-production.up.railway.app/api/templates/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Template deleted successfully.");

      loadTemplates();

    } catch (error) {

      console.error("Delete Template Error:", error);

      alert("Failed to delete template.");

    }

  };


  const handleCancelEdit = () => {

    setEditingId(null);
    setName("");
    setType("EMAIL");
    setMessage("");

  };


  if (loading) {

    return (

      <div className="container mt-4">

        <p className="text-center">
          Loading templates...
        </p>

      </div>

    );

  }


  return (

    <div className="container mt-4">

      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h3>
            📝 Message Templates
          </h3>

          <p className="text-muted mb-0">
            Create and manage reusable email and WhatsApp messages.
          </p>

        </div>

        <button
          className="btn btn-secondary"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

      </div>


      {/* CREATE / EDIT FORM */}

      <div className="card shadow-sm mb-4">

        <div className="card-header">

          <h5 className="mb-0">

            {editingId
              ? "✏️ Edit Template"
              : "➕ Create Template"}

          </h5>

        </div>

        <div className="card-body">

          <form onSubmit={handleSave}>

            <div className="row">

              {/* NAME */}

              <div className="col-md-5 mb-3">

                <label className="form-label">
                  Template Name
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Example: New Lead Welcome"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />

              </div>


              {/* TYPE */}

              <div className="col-md-3 mb-3">

                <label className="form-label">
                  Message Type
                </label>

                <select
                  className="form-select"
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value)
                  }
                >

                  <option value="EMAIL">
                    Email
                  </option>

                  <option value="WHATSAPP">
                    WhatsApp
                  </option>

                </select>

              </div>

            </div>


            {/* MESSAGE */}

            <div className="mb-3">

              <label className="form-label">
                Message
              </label>

              <textarea
                className="form-control"
                rows="5"
                placeholder="Write your message here..."
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
              />

              <small className="text-muted">
                You can use placeholders such as {"{{name}}"}.
              </small>

            </div>


            <button
              type="submit"
              className="btn btn-primary me-2"
            >

              {editingId
                ? "Update Template"
                : "Save Template"}

            </button>


            {editingId && (

              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>

            )}

          </form>

        </div>

      </div>


      {/* TEMPLATE LIST */}

      <div className="card shadow-sm">

        <div className="card-header">

          <h5 className="mb-0">
            📋 Saved Templates
          </h5>

        </div>

        <div className="card-body">

          {templates.length === 0 ? (

            <p className="text-muted mb-0">
              No templates available.
            </p>

          ) : (

            <div className="row">

              {templates.map((template) => (

                <div
                  className="col-md-6 mb-4"
                  key={template.id}
                >

                  <div className="border rounded p-3 h-100">

                    <div className="d-flex justify-content-between align-items-start">

                      <div>

                        <h5>
                          {template.name}
                        </h5>

                        <span className="badge bg-primary">
                          {template.type}
                        </span>

                      </div>

                    </div>


                    <p className="mt-3 mb-3">
                      {template.message}
                    </p>


                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() =>
                        handleEdit(template)
                      }
                    >
                      ✏️ Edit
                    </button>


                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() =>
                        handleDelete(template.id)
                      }
                    >
                      🗑️ Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>

  );

}

export default MessageTemplate;
