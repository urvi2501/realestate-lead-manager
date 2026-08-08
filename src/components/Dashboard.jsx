import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard({
  totalLeads,
  newLeads,
  interestedLeads,
  convertedLeads,
  leads,
  onAddLead,
  onViewLeads,
}) {

  const chartData = [
  { status: "New", count: newLeads },
  { status: "Interested", count: interestedLeads },
  { status: "Converted", count: convertedLeads },
];
  return (
    <>

      <div className="row text-center">

        <div className="col-md-3 mb-3">
          <div className="card shadow border-primary">
            <div className="card-body">
              <h5>Total Leads</h5>
              <h2>{totalLeads}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow border-success">
            <div className="card-body">
              <h5>New Leads</h5>
              <h2>{newLeads}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow border-warning">
            <div className="card-body">
              <h5>Interested</h5>
              <h2>{interestedLeads}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card shadow border-danger">
            <div className="card-body">
              <h5>Converted</h5>
              <h2>{convertedLeads}</h2>
            </div>
          </div>
        </div>

      </div>
<div className="card shadow mt-4">
  <div className="card-body">
    <h5 className="card-title">Lead Summary</h5>

    <div className="progress" style={{ height: "30px" }}>
      <div
        className="progress-bar bg-success"
        role="progressbar"
        style={{
          width: totalLeads
            ? `${(newLeads / totalLeads) * 100}%`
            : "0%",
        }}
      >
        New
      </div>

      <div
        className="progress-bar bg-warning"
        role="progressbar"
        style={{
          width: totalLeads
            ? `${(interestedLeads / totalLeads) * 100}%`
            : "0%",
        }}
      >
        Interested
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
        Converted
      </div>
    </div>
  </div>
</div>
<div className="card shadow mt-4">
  <div className="card-body">
    <h5 className="card-title">📊 Lead Status Overview</h5>

    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis allowDecimals={false} />
          <Tooltip />

          <Bar
            dataKey="count"
            name="Leads"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>
<div className="card shadow mt-4">
  <div className="card-body">
    <h5 className="card-title">📅 Upcoming Follow-ups</h5>

    {leads
      .filter((lead) => lead.followUpDate)
      .sort(
        (a, b) =>
          new Date(a.followUpDate) - new Date(b.followUpDate)
      )
      .slice(0, 5)
      .map((lead) => (
        <div
          key={lead.id}
          className="d-flex justify-content-between align-items-center border-bottom py-2"
        >
          <div>
            <strong>{lead.name}</strong>
            <br />
            <small>{lead.phone}</small>
          </div>

          <span className="badge bg-primary">
            {lead.followUpDate}
          </span>
        </div>
      ))}

    {leads.filter((lead) => lead.followUpDate).length === 0 && (
      <p className="text-muted mb-0">
        No upcoming follow-ups.
      </p>
    )}
  </div>
</div>
      <div className="text-center mt-4">

        <button
          className="btn btn-primary me-3"
          onClick={onAddLead}
        >
          ➕ Add New Lead
        </button>

        <button
          className="btn btn-success"
          onClick={onViewLeads}
        >
          📋 View Leads
        </button>

      </div>

    </>
  );
}

export default Dashboard;