
import { useState } from "react";
import axios from "axios";

function Email({ onBack }) {

  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendEmail = async (e) => {

    e.preventDefault();

    try {

      setSending(true);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "https://realestate-lead-manager-backend-production.up.railway.app/api/email/send",
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

      console.log("Email Response:", response.data);

      alert("Email sent successfully! 📧");

      setTo("");
      setSubject("");
      setMessage("");

    } catch (error) {

      console.error("Email Error:", error);

      alert(
        error.response?.data ||
        "Failed to send email."
      );

    } finally {

      setSending(false);

    }
  };

  return (

    <div className="card shadow-sm border-0">

      <div className="card-body p-4">

        {/* HEADER */}

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>

            <h3 className="fw-bold mb-1">
              📧 Send Email
            </h3>

            <p className="text-muted mb-0">
              Send an email to your lead or customer
            </p>

          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onBack}
          >
            ← Back to Dashboard
          </button>

        </div>


        {/* EMAIL FORM */}

        <form onSubmit={handleSendEmail}>

          {/* TO */}

          <div className="mb-3">

            <label className="form-label fw-semibold">
              To Email
            </label>

            <input
              type="email"
              className="form-control"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="customer@example.com"
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
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject"
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
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your email message..."
              required
            />

          </div>


          {/* SEND BUTTON */}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={sending}
          >

            {sending
              ? "Sending..."
              : "📧 Send Email"}

          </button>

        </form>

      </div>

    </div>

  );
}

export default Email;

