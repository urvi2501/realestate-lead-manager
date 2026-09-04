
import { useEffect, useState } from "react";
import axios from "axios";

function EmailSender({ onBack }) {

  const [templates, setTemplates] = useState([]);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  // =====================================================
  // LOAD EMAIL TEMPLATES
  // =====================================================

  useEffect(() => {

    const loadTemplates = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await axios.get(
          "http://https://realestate-lead-manager-backend-production.up.railway.app/api/templates",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const emailTemplates = (response.data || []).filter(
          (template) => template.type === "EMAIL"
        );

        setTemplates(emailTemplates);

      } catch (error) {

        console.error(
          "Email Template Error:",
          error
        );

        alert("Failed to load email templates.");

      } finally {

        setLoadingTemplates(false);

      }
    };

    loadTemplates();

  }, []);


  // =====================================================
  // SELECT TEMPLATE
  // =====================================================

  const handleTemplateChange = (e) => {

    const templateId = e.target.value;

    setSelectedTemplate(templateId);

    if (!templateId) {
      setMessage("");
      return;
    }

    const selected = templates.find(
      (template) =>
        String(template.id) === String(templateId)
    );

    if (selected) {
      setMessage(selected.message || "");
    }

  };


  // =====================================================
  // SEND EMAIL
  // =====================================================

  const handleSendEmail = async (e) => {

    e.preventDefault();

    if (!to || !subject || !message) {
      alert("Please fill all required fields.");
      return;
    }

    try {

      setSending(true);

      const token = localStorage.getItem("token");

      await axios.post(
        "http://https://realestate-lead-manager-backend-production.up.railway.app/api/email/send",
        null,
        {
          params: {
            to: to,
            subject: subject,
            message: message
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Email sent successfully! 📧");

      setTo("");
      setSubject("");
      setMessage("");
      setSelectedTemplate("");

    } catch (error) {

      console.error(
        "Send Email Error:",
        error
      );

      alert(
        error.response?.data ||
        "Failed to send email."
      );

    } finally {

      setSending(false);

    }

  };


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="card shadow-sm border-0">

      <div className="card-body">

        {/* HEADER */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>

            <h3 className="fw-bold mb-1">
              📧 Send Email
            </h3>

            <p className="text-muted mb-0">
              Send an email using your message templates
            </p>

          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onBack}
          >
            ← Back
          </button>

        </div>


        <form onSubmit={handleSendEmail}>

          {/* TEMPLATE */}

          <div className="mb-3">

            <label className="form-label fw-semibold">
              Select Email Template
            </label>

            <select
              className="form-select"
              value={selectedTemplate}
              onChange={handleTemplateChange}
            >

              <option value="">
                -- Select Template --
              </option>

              {loadingTemplates ? (

                <option disabled>
                  Loading templates...
                </option>

              ) : (

                templates.map((template) => (

                  <option
                    key={template.id}
                    value={template.id}
                  >
                    {template.name}
                  </option>

                ))

              )}

            </select>

          </div>


          {/* TO */}

          <div className="mb-3">

            <label className="form-label fw-semibold">
              Recipient Email
            </label>

            <input
              type="email"
              className="form-control"
              placeholder="example@gmail.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
            />

          </div>


          {/* SUBJECT */}

          <div className="mb-3">

            <label className="form-label fw-semibold">
              Subject
            </label>

            <input
              type="text"
              className="form-control"
              placeholder="Enter email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />

          </div>


          {/* MESSAGE */}

          <div className="mb-4">

            <label className="form-label fw-semibold">
              Message
            </label>

            <textarea
              className="form-control"
              rows="7"
              placeholder="Enter your message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />

          </div>


          {/* BUTTONS */}

          <button
            type="submit"
            className="btn btn-success me-2"
            disabled={sending}
          >
            {sending
              ? "Sending..."
              : "📧 Send Email"}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onBack}
          >
            Cancel
          </button>

        </form>

      </div>

    </div>

  );

}

export default EmailSender;

