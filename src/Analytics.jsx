import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
function Analytics({ onBack }) {

  const [overview, setOverview] = useState({});
  const [status, setStatus] = useState({});
  const [propertyType, setPropertyType] = useState({});
  const [source, setSource] = useState({});
  const [budget, setBudget] = useState({});
  const [conversion, setConversion] = useState({});
  const [followUps, setFollowUps] = useState({});

  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Session expired. Please login again.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      const [
        overviewResponse,
        statusResponse,
        propertyResponse,
        sourceResponse,
        budgetResponse,
        conversionResponse,
        followUpResponse
      ] = await Promise.all([

        axios.get(
          "http://localhost:8080/api/analytics/overview",
          config
        ),

        axios.get(
          "http://localhost:8080/api/analytics/status",
          config
        ),

        axios.get(
          "http://localhost:8080/api/analytics/property-type",
          config
        ),

        axios.get(
          "http://localhost:8080/api/analytics/source",
          config
        ),

        axios.get(
          "http://localhost:8080/api/analytics/budget",
          config
        ),

        axios.get(
          "http://localhost:8080/api/analytics/conversion-rate",
          config
        ),

        axios.get(
          "http://localhost:8080/api/analytics/follow-ups",
          config
        )

      ]);

      setOverview(overviewResponse.data);
      setStatus(statusResponse.data);
      setPropertyType(propertyResponse.data);
      setSource(sourceResponse.data);
      setBudget(budgetResponse.data);
      setConversion(conversionResponse.data);
      setFollowUps(followUpResponse.data);

    } catch (error) {

      console.error(
        "Analytics API Error:",
        error
      );

      if (error.response?.status === 403) {

        alert(
          "Session expired or access denied. Please login again."
        );

      } else {

        alert(
          "Failed to load analytics."
        );

      }

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    loadAnalytics();

  }, []);

  const toChartData = (data) => {
  return Object.entries(data).map(([name, value]) => ({
    name,
    value: Number(value) || 0
  }));
};
  if (loading) {

    return (
      <div className="container mt-4">

        <h4 className="text-center">
          Loading Analytics...
        </h4>

      </div>
    );

  }

  return (

    <div className="container mt-4">

      {/* HEADER */}

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h3>
            📈 Analytics
          </h3>

          <p className="text-muted mb-0">
            Real Estate Lead Performance Analytics
          </p>

        </div>

        <button
          className="btn btn-secondary"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

      </div>



      {/* OVERVIEW */}

<h5 className="mb-3">
  📊 Overview
</h5>

<div className="row mb-4">

  {/* TOTAL LEADS */}

  <div className="col-md-4 mb-3">

    <div className="card shadow-sm border-0 h-100">

      <div className="card-body text-center">

        <div className="fs-1 mb-2">
          👤
        </div>

        <h6 className="text-muted">
          Total Leads
        </h6>

        <h2 className="fw-bold">
          {overview.totalLeads ?? 0}
        </h2>

        <p className="text-muted mb-0">
          All registered leads
        </p>

      </div>

    </div>

  </div>


  {/* TOTAL CUSTOMERS */}

  <div className="col-md-4 mb-3">

    <div className="card shadow-sm border-0 h-100">

      <div className="card-body text-center">

        <div className="fs-1 mb-2">
          👥
        </div>

        <h6 className="text-muted">
          Total Customers
        </h6>

        <h2 className="fw-bold">
          {overview.totalCustomers ?? 0}
        </h2>

        <p className="text-muted mb-0">
          Registered customers
        </p>

      </div>

    </div>

  </div>


  {/* TOTAL FOLLOW-UPS */}

  <div className="col-md-4 mb-3">

    <div className="card shadow-sm border-0 h-100">

      <div className="card-body text-center">

        <div className="fs-1 mb-2">
          📅
        </div>

        <h6 className="text-muted">
          Total Follow-ups
        </h6>

        <h2 className="fw-bold">
          {overview.totalFollowUps ?? 0}
        </h2>

        <p className="text-muted mb-0">
          Scheduled follow-ups
        </p>

      </div>

    </div>

  </div>

</div>

{/* CONVERSION */}

<h5 className="mb-3">
  🎯 Conversion Performance
</h5>

<div className="row mb-4">

  {/* CONVERTED LEADS */}

  <div className="col-md-4 mb-3">

    <div className="card shadow-sm border-0 h-100">

      <div className="card-body text-center">

        <div className="fs-1 mb-2">
          ✅
        </div>

        <h6 className="text-muted">
          Converted Leads
        </h6>

        <h2 className="fw-bold">
          {conversion.convertedLeads ?? 0}
        </h2>

        <p className="text-muted mb-0">
          Successfully converted
        </p>

      </div>

    </div>

  </div>


  {/* CONVERSION RATE */}

  <div className="col-md-4 mb-3">

    <div className="card shadow-sm border-0 h-100">

      <div className="card-body text-center">

        <div className="fs-1 mb-2">
          🎯
        </div>

        <h6 className="text-muted">
          Conversion Rate
        </h6>

        <h2 className="fw-bold">
          {Number(
            conversion.conversionRate ?? 0
          ).toFixed(2)}%
        </h2>

        {/* PROGRESS BAR */}

        <div className="progress mt-3">

          <div
            className="progress-bar"
            role="progressbar"
            style={{
              width: `${Math.min(
                Number(conversion.conversionRate) || 0,
                100
              )}%`
            }}
            aria-valuenow={
              Number(conversion.conversionRate) || 0
            }
            aria-valuemin="0"
            aria-valuemax="100"
          >
          </div>

        </div>

      </div>

    </div>

  </div>


  {/* TOTAL LEADS */}

  <div className="col-md-4 mb-3">

    <div className="card shadow-sm border-0 h-100">

      <div className="card-body text-center">

        <div className="fs-1 mb-2">
          📊
        </div>

        <h6 className="text-muted">
          Total Leads
        </h6>

        <h2 className="fw-bold">
          {conversion.totalLeads ?? 0}
        </h2>

        <p className="text-muted mb-0">
          Leads considered for conversion
        </p>

      </div>

    </div>

  </div>

</div>


      {/* LEAD STATUS */}

<div className="card shadow-sm mb-4">

  <div className="card-body">

    <h5 className="mb-4">
      📌 Lead Status Analytics
    </h5>

    <div className="row">

      {/* STATUS CARDS */}

      <div className="col-md-6">

        <div className="row">

          {Object.entries(status).map(
            ([key, value]) => (

              <div
                className="col-md-6 mb-3"
                key={key}
              >

                <div className="border rounded p-3 text-center">

                  <strong>
                    {key}
                  </strong>

                  <h4 className="mt-2">
                    {value}
                  </h4>

                </div>

              </div>

            )
          )}

        </div>

      </div>


      {/* BAR CHART */}

      <div className="col-md-6">

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <BarChart
            data={toChartData(status)}
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#0d6efd"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  </div>

</div>


     {/* PROPERTY TYPE */}

<div className="card shadow-sm mb-4">

  <div className="card-body">

    <h5 className="mb-4">
      🏠 Property Type Analytics
    </h5>

    <div className="row">

      {/* PROPERTY TYPE CARDS */}

      <div className="col-md-6">

        <div className="row">

          {Object.entries(propertyType).map(
            ([key, value]) => (

              <div
                className="col-md-6 mb-3"
                key={key}
              >

                <div className="border rounded p-3 text-center">

                  <strong>
                    {key}
                  </strong>

                  <h4 className="mt-2">
                    {value}
                  </h4>

                </div>

              </div>

            )
          )}

        </div>

      </div>


      {/* PIE CHART */}

      <div className="col-md-6">

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <PieChart>

            <Pie
              data={toChartData(propertyType)}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >

              {toChartData(propertyType).map(
                (entry, index) => (

                  <Cell
  key={`cell-${index}`}
  fill={
    [
      "#0d6efd",
      "#198754",
      "#ffc107",
      "#dc3545",
      "#6f42c1",
      "#fd7e14"
    ][index % 6]
  }
/>

                )
              )}

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>

  </div>

</div>

     {/* LEAD SOURCE */}

<div className="card shadow-sm mb-4">

  <div className="card-body">

    <h5 className="mb-4">
      📣 Lead Source Analytics
    </h5>

    <div className="row">

      {/* SOURCE CARDS */}

      <div className="col-md-6">

        <div className="row">

          {Object.entries(source).map(
            ([key, value]) => (

              <div
                className="col-md-6 mb-3"
                key={key}
              >

                <div className="border rounded p-3 text-center">

                  <strong>
                    {key}
                  </strong>

                  <h4 className="mt-2">
                    {value}
                  </h4>

                </div>

              </div>

            )
          )}

        </div>

      </div>


      {/* SOURCE BAR CHART */}

      <div className="col-md-6">

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <BarChart
            data={toChartData(source)}
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="value"
            >

              {toChartData(source).map(
                (entry, index) => (

                  <Cell
                    key={`source-${index}`}
                    fill={
                      [
                        "#0d6efd",
                        "#198754",
                        "#ffc107",
                        "#dc3545",
                        "#6f42c1",
                        "#fd7e14"
                      ][index % 6]
                    }
                  />

                )
              )}

            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  </div>

</div>


     {/* BUDGET */}

<div className="card shadow-sm mb-4">

  <div className="card-body">

    <h5 className="mb-4">
      💰 Budget Analytics
    </h5>

    <div className="row">

      {/* BUDGET CARDS */}

      <div className="col-md-6">

        <div className="row">

          {Object.entries(budget).map(
            ([key, value]) => (

              <div
                className="col-md-6 mb-3"
                key={key}
              >

                <div className="border rounded p-3 text-center">

                  <strong>
                    {key}
                  </strong>

                  <h4 className="mt-2">
                    {value}
                  </h4>

                </div>

              </div>

            )
          )}

        </div>

      </div>


      {/* BUDGET BAR CHART */}

      <div className="col-md-6">

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <BarChart
            data={toChartData(budget)}
          >

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Bar dataKey="value">

              {toChartData(budget).map(
                (entry, index) => (

                  <Cell
                    key={`budget-${index}`}
                    fill={
                      [
                        "#6610f2",
                        "#20c997",
                        "#fd7e14",
                        "#e83e8c",
                        "#0dcaf0",
                        "#198754"
                      ][index % 6]
                    }
                  />

                )
              )}

            </Bar>

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  </div>

</div>


    {/* FOLLOW-UP */}

<div className="card shadow-sm mb-4">

  <div className="card-body">

    <h5 className="mb-4">
      📅 Follow-up Analytics
    </h5>

    <div className="row">

      {/* FOLLOW-UP CARDS */}

      <div className="col-md-6">

        <div className="row">

          <div className="col-md-6 mb-3">

            <div className="border rounded p-3 text-center">

              <strong>Total</strong>

              <h4 className="mt-2">
                {followUps.totalFollowUps ?? 0}
              </h4>

            </div>

          </div>


          <div className="col-md-6 mb-3">

            <div className="border rounded p-3 text-center">

              <strong>Pending</strong>

              <h4 className="mt-2">
                {followUps.pending ?? 0}
              </h4>

            </div>

          </div>


          <div className="col-md-6 mb-3">

            <div className="border rounded p-3 text-center">

              <strong>Completed</strong>

              <h4 className="mt-2">
                {followUps.completed ?? 0}
              </h4>

            </div>

          </div>


          <div className="col-md-6 mb-3">

            <div className="border rounded p-3 text-center">

              <strong>Cancelled</strong>

              <h4 className="mt-2">
                {followUps.cancelled ?? 0}
              </h4>

            </div>

          </div>

        </div>

      </div>


      {/* FOLLOW-UP PIE CHART */}

      <div className="col-md-6">

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <PieChart>

            <Pie
              data={[
                {
                  name: "Pending",
                  value: Number(followUps.pending) || 0
                },
                {
                  name: "Completed",
                  value: Number(followUps.completed) || 0
                },
                {
                  name: "Cancelled",
                  value: Number(followUps.cancelled) || 0
                }
              ]}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >

              {[
                "#ffc107",
                "#198754",
                "#dc3545"
              ].map((color, index) => (

                <Cell
                  key={`followup-${index}`}
                  fill={color}
                />

              ))}

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>

  </div>

</div>

    </div>

  );
}

export default Analytics;