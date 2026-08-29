function Dashboard({
  totalLeads,
  newLeads,
  interestedLeads,
  convertedLeads,
  totalCustomers,
  interestedCustomers,
  convertedCustomers,
  leads,
  onAddLead,
  onViewLeads,
  onViewCustomers,
  onViewProperties,
  onViewFollowUps,
  onViewReports,
  onAnalytics,
  onViewMessageTemplates,
    onViewEmail,

}) {


const today = new Date();
today.setHours(0, 0, 0, 0);

const followUps = leads
  .filter((lead) => {
    if (!lead.followUpDate) return false;

    const followUpDate = new Date(lead.followUpDate);
    followUpDate.setHours(0, 0, 0, 0);

    return followUpDate >= today;
  })
  .sort(
    (a, b) =>
      new Date(a.followUpDate) - new Date(b.followUpDate)
  )
  .slice(0, 5);


  const leadPercentage = (count) => {
    if (!totalLeads) return 0;
    return Math.round((count / totalLeads) * 100);
  };

  return (
    <div>

     {/* =====================================================
    HEADER
===================================================== */}

<div className="card shadow-sm border-0 mb-4">

  <div className="card-body p-4">

    <div className="row align-items-center">

      {/* LEFT SIDE */}
      <div className="col-md-8">

        <div className="d-flex align-items-center">

          <div
            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
            style={{
              width: "58px",
              height: "58px",
              fontSize: "28px",
            }}
          >
            🏠
          </div>

          <div>

            <h2 className="fw-bold mb-1">
              Real Estate Dashboard
            </h2>

            <p className="text-muted mb-0">
              Manage your leads, customers, properties and follow-ups
              from one place.
            </p>

          </div>

        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="col-md-4 text-md-end mt-3 mt-md-0">

        <button
          className="btn btn-primary btn-lg shadow-sm"
          onClick={onAddLead}
        >
          ➕ Add New Lead
        </button>

      </div>

    </div>

  </div>

</div>


      {/* =====================================================
          LEAD STATISTICS
      ===================================================== */}

     
<div className="row g-3">

  {/* Total Leads */}
  <div className="col-12 col-sm-6 col-xl-3">
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body p-4">

        <div className="d-flex justify-content-between align-items-start">

          <div>
            <small className="text-muted fw-semibold">
              TOTAL LEADS
            </small>

            <h2 className="fw-bold text-primary mt-2 mb-1">
              {totalLeads}
            </h2>

            <small className="text-muted">
              All registered leads
            </small>
          </div>

          <div
            className="rounded-circle bg-primary bg-opacity-10 p-3"
            style={{ fontSize: "1.4rem" }}
          >
            📊
          </div>

        </div>

      </div>
    </div>
  </div>


  {/* New Leads */}
  <div className="col-12 col-sm-6 col-xl-3">
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body p-4">

        <div className="d-flex justify-content-between align-items-start">

          <div>
            <small className="text-muted fw-semibold">
              NEW LEADS
            </small>

            <h2 className="fw-bold text-success mt-2 mb-1">
              {newLeads}
            </h2>

            <small className="text-muted">
              Newly received
            </small>
          </div>

          <div
            className="rounded-circle bg-success bg-opacity-10 p-3"
            style={{ fontSize: "1.4rem" }}
          >
            🆕
          </div>

        </div>

      </div>
    </div>
  </div>


  {/* Interested Leads */}
  <div className="col-12 col-sm-6 col-xl-3">
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body p-4">

        <div className="d-flex justify-content-between align-items-start">

          <div>
            <small className="text-muted fw-semibold">
              INTERESTED
            </small>

            <h2 className="fw-bold text-warning mt-2 mb-1">
              {interestedLeads}
            </h2>

            <small className="text-muted">
              Interested prospects
            </small>
          </div>

          <div
            className="rounded-circle bg-warning bg-opacity-10 p-3"
            style={{ fontSize: "1.4rem" }}
          >
            ❤️
          </div>

        </div>

      </div>
    </div>
  </div>


  {/* Converted Leads */}
  <div className="col-12 col-sm-6 col-xl-3">
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body p-4">

        <div className="d-flex justify-content-between align-items-start">

          <div>
            <small className="text-muted fw-semibold">
              CONVERTED
            </small>

            <h2 className="fw-bold text-danger mt-2 mb-1">
              {convertedLeads}
            </h2>

            <small className="text-muted">
              Successful conversions
            </small>
          </div>

          <div
            className="rounded-circle bg-danger bg-opacity-10 p-3"
            style={{ fontSize: "1.4rem" }}
          >
            🏆
          </div>

        </div>

      </div>
    </div>
  </div>

</div>

   {/* =====================================================
    LEAD PROGRESS
===================================================== */}

<div className="card border-0 shadow-sm mt-4">

  <div className="card-body p-4">

    <div className="d-flex justify-content-between align-items-center mb-3">

      <div>
        <h5 className="fw-bold mb-1">
          📈 Lead Progress
        </h5>

        <small className="text-muted">
          Current lead status distribution
        </small>
      </div>

      <span className="badge bg-primary px-3 py-2">
        {totalLeads} Total
      </span>

    </div>

    <div
      className="progress"
      style={{
        height: "32px",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >

      <div
        className="progress-bar bg-success"
        role="progressbar"
        style={{
          width: totalLeads
            ? `${(newLeads / totalLeads) * 100}%`
            : "0%",
        }}
      >
        {newLeads > 0 &&
          `${Math.round((newLeads / totalLeads) * 100)}% New`}
      </div>

      <div
        className="progress-bar bg-warning text-dark"
        role="progressbar"
        style={{
          width: totalLeads
            ? `${(interestedLeads / totalLeads) * 100}%`
            : "0%",
        }}
      >
        {interestedLeads > 0 &&
          `${Math.round((interestedLeads / totalLeads) * 100)}% Interested`}
      </div>

      <div
        className="progress-bar bg-danger"
        role="progressbar"
        style={{
          width: totalLeads
            ? `${(convertedLeads / totalLeads) * 100}%`
            : "0%",
        }}
      >
        {convertedLeads > 0 &&
          `${Math.round((convertedLeads / totalLeads) * 100)}% Converted`}
      </div>

    </div>

    {/* Status legend */}

    <div className="d-flex flex-wrap gap-4 mt-3">

      <small className="text-muted">
        🟢 New: <strong>{newLeads}</strong>
      </small>

      <small className="text-muted">
        🟡 Interested: <strong>{interestedLeads}</strong>
      </small>

      <small className="text-muted">
        🔴 Converted: <strong>{convertedLeads}</strong>
      </small>

    </div>

  </div>

</div>


    {/* =====================================================
    CUSTOMER OVERVIEW
===================================================== */}

<div className="mt-4 mb-3">
  <h5 className="fw-bold">
    👥 Customer Overview
  </h5>

  <small className="text-muted">
    Current customer statistics
  </small>
</div>

<div className="row g-3">

  {/* TOTAL CUSTOMERS */}
  <div className="col-md-4">
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">

        <div className="d-flex justify-content-between align-items-center">

          <div>
            <small className="text-muted">
              TOTAL CUSTOMERS
            </small>

            <h2 className="fw-bold text-primary mt-2">
              {totalCustomers}
            </h2>

            <small className="text-muted">
              All registered customers
            </small>
          </div>

          <div className="fs-1">
            👥
          </div>

        </div>

      </div>
    </div>
  </div>


  {/* INTERESTED CUSTOMERS */}
  <div className="col-md-4">
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">

        <div className="d-flex justify-content-between align-items-center">

          <div>
            <small className="text-muted">
              INTERESTED CUSTOMERS
            </small>

            <h2 className="fw-bold text-warning mt-2">
              {interestedCustomers}
            </h2>

            <small className="text-muted">
              Interested prospects
            </small>
          </div>

          <div className="fs-1">
            ⭐
          </div>

        </div>

      </div>
    </div>
  </div>


  {/* CONVERTED CUSTOMERS */}
  <div className="col-md-4">
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body">

        <div className="d-flex justify-content-between align-items-center">

          <div>
            <small className="text-muted">
              CONVERTED CUSTOMERS
            </small>

            <h2 className="fw-bold text-success mt-2">
              {convertedCustomers}
            </h2>

            <small className="text-muted">
              Successful conversions
            </small>
          </div>

          <div className="fs-1">
            ✅
          </div>

        </div>

      </div>
    </div>
  </div>

</div>


      <div className="row g-3">

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">

              <div className="fs-1">
                👥
              </div>

              <h6 className="text-muted mt-2">
                Total Customers
              </h6>

              <h2 className="fw-bold text-primary">
                {totalCustomers}
              </h2>

            </div>
          </div>
        </div>


        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">

              <div className="fs-1">
                ⭐
              </div>

              <h6 className="text-muted mt-2">
                Interested Customers
              </h6>

              <h2 className="fw-bold text-warning">
                {interestedCustomers}
              </h2>

            </div>
          </div>
        </div>


        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">

              <div className="fs-1">
                ✅
              </div>

              <h6 className="text-muted mt-2">
                Converted Customers
              </h6>

              <h2 className="fw-bold text-success">
                {convertedCustomers}
              </h2>

            </div>
          </div>
        </div>

      </div>


     {/* =====================================================
    UPCOMING FOLLOW-UPS
===================================================== */}

<div className="card shadow-sm border-0 mt-4">

  <div className="card-body">

    <div className="d-flex justify-content-between align-items-center mb-3">

      <div>
        <h5 className="fw-bold mb-1">
          📅 Upcoming Follow-ups
        </h5>

        <small className="text-muted">
          Your next customer/lead follow-ups
        </small>
      </div>

      <button
        className="btn btn-outline-primary btn-sm"
        onClick={onViewFollowUps}
      >
        View All →
      </button>

    </div>


    {followUps.length === 0 ? (

      <div className="text-center py-4">

        <div className="fs-1 mb-2">
          📅
        </div>

        <h6 className="text-muted">
          No upcoming follow-ups
        </h6>

        <small className="text-muted">
          Follow-ups will appear here when scheduled.
        </small>

      </div>

    ) : (

      <div className="list-group list-group-flush">

        {followUps.map((lead) => (

          <div
            key={lead.id}
            className="list-group-item px-0 py-3"
          >

            <div className="d-flex justify-content-between align-items-center">

              <div className="d-flex align-items-center">

                <div
                  className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{
                    width: "42px",
                    height: "42px",
                  }}
                >
                  📅
                </div>

                <div>

                  <strong>
                    {lead.name}
                  </strong>

                  <div>
                    <small className="text-muted">
                      📞 {lead.phone}
                    </small>
                  </div>

                </div>

              </div>


              <div className="text-end">

                <span className="badge bg-primary mb-1">
                  {lead.followUpDate}
                </span>

                <div>
                  <small className="text-muted">
                    Follow-up
                  </small>
                </div>

              </div>

            </div>

          </div>

        ))}

      </div>

    )}

  </div>

</div>


  {/* =====================================================
    QUICK ACTIONS
===================================================== */}

<div className="mt-4">

  <div className="mb-3">
    <h5 className="fw-bold mb-1">
      ⚡ Quick Actions
    </h5>

    <small className="text-muted">
      Quickly access the most-used modules
    </small>
  </div>


  <div className="row g-3 justify-content-center">

    {/* ADD LEAD */}
    <div className="col-md-4 col-lg-3">
      <button
        className="btn btn-primary w-100 py-3 shadow-sm"
        onClick={onAddLead}
      >
        <div className="fs-4">➕</div>
        <div className="fw-bold mt-1">
          Add Lead
        </div>
        <small>
          Create a new lead
        </small>
      </button>
    </div>


    {/* VIEW LEADS */}
    <div className="col-md-4 col-lg-3">
      <button
        className="btn btn-info w-100 py-3 shadow-sm"
        onClick={onViewLeads}
      >
        <div className="fs-4">📋</div>
        <div className="fw-bold mt-1">
          View Leads
        </div>
        <small>
          Manage all leads
        </small>
      </button>
    </div>


    {/* CUSTOMERS */}
    <div className="col-md-4 col-lg-3">
      <button
        className="btn btn-success w-100 py-3 shadow-sm"
        onClick={onViewCustomers}
      >
        <div className="fs-4">👥</div>
        <div className="fw-bold mt-1">
          Customers
        </div>
        <small>
          Manage customers
        </small>
      </button>
    </div>


    {/* PROPERTIES */}
    <div className="col-md-4 col-lg-3">
      <button
        className="btn btn-warning w-100 py-3 shadow-sm"
        onClick={onViewProperties}
      >
        <div className="fs-4">🏠</div>
        <div className="fw-bold mt-1">
          Properties
        </div>
        <small>
          Manage properties
        </small>
      </button>
    </div>


    {/* FOLLOW-UPS */}
    <div className="col-md-4 col-lg-3">
      <button
        className="btn btn-secondary w-100 py-3 shadow-sm"
        onClick={onViewFollowUps}
      >
        <div className="fs-4">📅</div>
        <div className="fw-bold mt-1">
          Follow-ups
        </div>
        <small>
          View reminders
        </small>
      </button>
    </div>


    {/* REPORTS */}
    <div className="col-md-4 col-lg-3">
      <button
        className="btn btn-dark w-100 py-3 shadow-sm"
        onClick={onViewReports}
      >
        <div className="fs-4">📊</div>
        <div className="fw-bold mt-1">
          Reports
        </div>
        <small>
          View reports
        </small>
      </button>
    </div>


    {/* ANALYTICS */}
    <div className="col-md-4 col-lg-3">
      <button
        className="btn btn-primary w-100 py-3 shadow-sm"
        onClick={onAnalytics}
      >
        <div className="fs-4">📈</div>
        <div className="fw-bold mt-1">
          Analytics
        </div>
        <small>
          View analytics
        </small>
      </button>
    </div>

 {/*  Message Templates */}
    <div className="col-md-4 col-lg-3">
      <button
        className="btn btn-primary w-100 py-3 shadow-sm"
        onClick={onViewMessageTemplates}
      >
        <div className="fs-4">📈</div>
        <div className="fw-bold mt-1">
           Message Templates
        </div>
        <small>
            View Message
        </small>
      </button>
    </div>

{/* SEND EMAIL */}
<div className="col-md-4 col-lg-3">
  <button
    className="btn btn-danger w-100 py-3 shadow-sm"
    onClick={onViewEmail}
  >
    <div className="fs-4">📧</div>

    <div className="fw-bold mt-1">
      Send Email
    </div>

    <small>
      Send email to leads
    </small>
  </button>
</div>
  </div>

</div>

    </div>
  );
}

export default Dashboard;