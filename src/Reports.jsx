import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";


function Reports({ onBack }) {

  const [basic, setBasic] = useState({});
  const [status, setStatus] = useState({});
  const [source, setSource] = useState({});
  const [propertyType, setPropertyType] = useState({});
  const [location, setLocation] = useState({});
  const [budget, setBudget] = useState({});
  const [followUpStatus, setFollowUpStatus] = useState({});
  const [followUpDate, setFollowUpDate] = useState({});
  const [conversion, setConversion] = useState({});
  const [customerStatus, setCustomerStatus] = useState({});

  const [loading, setLoading] = useState(true);

  const loadReports = async () => {

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
        basicResponse,
        statusResponse,
        sourceResponse,
        propertyResponse,
        locationResponse,
        budgetResponse,
        followUpStatusResponse,
        followUpDateResponse,
        conversionResponse,
        customerStatusResponse
      ] = await Promise.all([

        axios.get(
          "http://localhost:8080/api/reports",
          config
        ),

        axios.get(
          "http://localhost:8080/api/reports/status",
          config
        ),

        axios.get(
          "http://localhost:8080/api/reports/source",
          config
        ),

        axios.get(
          "http://localhost:8080/api/reports/property-type",
          config
        ),

        axios.get(
          "http://localhost:8080/api/reports/location",
          config
        ),

        axios.get(
          "http://localhost:8080/api/reports/budget",
          config
        ),

        axios.get(
          "http://localhost:8080/api/reports/followup-status",
          config
        ),

        axios.get(
          "http://localhost:8080/api/reports/followup-date",
          config
        ),

        axios.get(
          "http://localhost:8080/api/reports/conversion",
          config
        ),

        axios.get(
          "http://localhost:8080/api/reports/customer-status",
          config
        )

      ]);

      setBasic(basicResponse.data);
      setStatus(statusResponse.data);
      setSource(sourceResponse.data);
      setPropertyType(propertyResponse.data);
      setLocation(locationResponse.data);
      setBudget(budgetResponse.data);
      setFollowUpStatus(followUpStatusResponse.data);
      setFollowUpDate(followUpDateResponse.data);
      setConversion(conversionResponse.data);
      setCustomerStatus(customerStatusResponse.data);

    } catch (error) {

      console.error("Reports API Error:", error);

      if (error.response?.status === 403) {

        alert(
          "Access denied. Please login again."
        );

      } else {

        alert(
          "Failed to load reports."
        );

      }

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {

    loadReports();

  }, []);

  const exportPDF = () => {

  const doc = new jsPDF();

  let y = 20;

  doc.setFontSize(18);
  doc.text("Real Estate Lead Manager Report", 20, y);

  y += 15;

  const reports = [
    ["Basic Summary", basic],
    ["Lead Status", status],
    ["Lead Source", source],
    ["Property Type", propertyType],
    ["Lead Location", location],
    ["Budget Range", budget],
    ["Follow-up Status", followUpStatus],
    ["Follow-up Date", followUpDate],
    ["Lead Conversion", conversion],
    ["Customer Status", customerStatus]
  ];

  reports.forEach(([title, data]) => {

    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.text(title, 20, y);

    y += 8;

    doc.setFontSize(10);

    Object.entries(data).forEach(([key, value]) => {

      if (y > 280) {
        doc.addPage();
        y = 20;
      }

      doc.text(`${key}: ${value}`, 25, y);

      y += 6;

    });

    y += 5;

  });

  doc.save("real-estate-report.pdf");
};

const exportExcel = () => {

  const reports = [
    ["Basic Summary", basic],
    ["Lead Status", status],
    ["Lead Source", source],
    ["Property Type", propertyType],
    ["Lead Location", location],
    ["Budget Range", budget],
    ["Follow-up Status", followUpStatus],
    ["Follow-up Date", followUpDate],
    ["Lead Conversion", conversion],
    ["Customer Status", customerStatus]
  ];

  const excelData = [];

  reports.forEach(([title, data]) => {

    excelData.push({
      Report: title,
      Field: "",
      Value: ""
    });

    Object.entries(data).forEach(([key, value]) => {

      excelData.push({
        Report: "",
        Field: key,
        Value: value
      });

    });

    excelData.push({
      Report: "",
      Field: "",
      Value: ""
    });

  });

  const worksheet = XLSX.utils.json_to_sheet(excelData);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Reports"
  );

  XLSX.writeFile(
    workbook,
    "real-estate-report.xlsx"
  );
};
  const renderReport = (title, data) => {

    return (

      <div className="card shadow-sm mb-4">

        <div className="card-header">

          <h5 className="mb-0">
            {title}
          </h5>

        </div>

        <div className="card-body">

          {Object.keys(data).length === 0 ? (

            <p className="text-muted">
              No data available.
            </p>

          ) : (

            <div className="row">

              {Object.entries(data).map(
                ([key, value]) => (

                  <div
                    className="col-md-4 mb-3"
                    key={key}
                  >

                    <div className="border rounded p-3">

                      <div className="text-muted">
                        {key}
                      </div>

                      <h4 className="mb-0">
                        {value}
                      </h4>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

    );
  };


  if (loading) {

    return (

      <div className="container mt-4">

        <p className="text-center">
          Loading reports...
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
            📊 Reports
          </h3>

          <p className="text-muted mb-0">
            Real Estate Lead Manager Reports
          </p>

        </div>

       <div className="d-flex gap-2">

  <button
    className="btn btn-danger"
    onClick={exportPDF}
  >
    📄 Export PDF
  </button>

 <button
    className="btn btn-success"
    onClick={exportExcel}
  >
    📊 Export Excel
  </button>
  <button
    className="btn btn-secondary"
    onClick={onBack}
  >
    ← Back to Dashboard
  </button>

</div>

      </div>


      {/* BASIC REPORT */}

      {renderReport(
        "📌 Basic Summary",
        basic
      )}


      {/* LEAD REPORTS */}

      {renderReport(
        "📊 Lead Status",
        status
      )}

      {renderReport(
        "📢 Lead Source",
        source
      )}

      {renderReport(
        "🏠 Property Type",
        propertyType
      )}

      {renderReport(
        "📍 Lead Location",
        location
      )}

      {renderReport(
        "💰 Budget Range",
        budget
      )}


      {/* FOLLOW-UP REPORTS */}

      {renderReport(
        "📅 Follow-up Status",
        followUpStatus
      )}

      {renderReport(
        "⏰ Follow-up Date",
        followUpDate
      )}


      {/* CONVERSION */}

      {renderReport(
        "🔄 Lead Conversion",
        conversion
      )}


      {/* CUSTOMER */}

      {renderReport(
        "👥 Customer Status",
        customerStatus
      )}

    </div>

  );
}

export default Reports;