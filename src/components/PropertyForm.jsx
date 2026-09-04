import { useEffect, useState } from "react";
import axios from "axios";

function PropertyForm({
  selectedProperty,
  onSave,
  onCancel
}) {

  const [property, setProperty] = useState({
    title: "",
    propertyType: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    status: "Available"
  });

  useEffect(() => {

    if (selectedProperty) {
      setProperty({
        title: selectedProperty.title || "",
        propertyType: selectedProperty.propertyType || "",
        location: selectedProperty.location || "",
        price: selectedProperty.price || "",
        bedrooms: selectedProperty.bedrooms || "",
        bathrooms: selectedProperty.bathrooms || "",
        area: selectedProperty.area || "",
        status: selectedProperty.status || "Available"
      });
    }

  }, [selectedProperty]);

  const handleChange = (e) => {

    const { name, value } = e.target;

    setProperty({
      ...property,
      [name]: value
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    console.log("TOKEN:", token);
    console.log("PROPERTY DATA:", property);

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    };

    let response;

    if (selectedProperty) {

      response = await axios.put(
        `https://realestate-lead-manager-backend-production.up.railway.app/api/properties/${selectedProperty.id}`,
        property,
        config
      );

      alert("Property updated successfully.");

    } else {

      response = await axios.post(
        "https://realestate-lead-manager-backend-production.up.railway.app/api/properties",
        property,
        config
      );

      console.log("CREATE PROPERTY RESPONSE:", response.data);

      alert("Property added successfully.");
    }

    onSave();

  } catch (error) {

    console.error("PROPERTY SAVE ERROR:", error);

    if (error.response) {
      console.error("STATUS:", error.response.status);
      console.error("DATA:", error.response.data);
    }

    alert(
      "Failed to save property. Status: " +
      (error.response?.status || "Unknown")
    );
  }
};
  return (
    <div className="container mt-4">

      <div className="card shadow">

        <div className="card-body">

          <h3 className="mb-4">
            {selectedProperty
              ? "✏️ Edit Property"
              : "🏠 Add New Property"}
          </h3>

          <form onSubmit={handleSubmit}>

            <div className="row">

              {/* TITLE */}
              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Property Title
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={property.title}
                  onChange={handleChange}
                  placeholder="Enter property title"
                  required
                />

              </div>

              {/* PROPERTY TYPE */}
              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Property Type
                </label>

                <select
                  className="form-select"
                  name="propertyType"
                  value={property.propertyType}
                  onChange={handleChange}
                  required
                >

                  <option value="">
                    Select Type
                  </option>

                  <option value="Flat">
                    Flat
                  </option>

                  <option value="Villa">
                    Villa
                  </option>

                  <option value="Plot">
                    Plot
                  </option>

                  <option value="Commercial">
                    Commercial
                  </option>

                  <option value="Office">
                    Office
                  </option>

                </select>

              </div>

              {/* LOCATION */}
              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Location
                </label>

                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={property.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                  required
                />

              </div>

              {/* PRICE */}
              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Price
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={property.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  required
                />

              </div>

              {/* BEDROOMS */}
              <div className="col-md-4 mb-3">

                <label className="form-label">
                  Bedrooms
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="bedrooms"
                  value={property.bedrooms}
                  onChange={handleChange}
                />

              </div>

              {/* BATHROOMS */}
              <div className="col-md-4 mb-3">

                <label className="form-label">
                  Bathrooms
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="bathrooms"
                  value={property.bathrooms}
                  onChange={handleChange}
                />

              </div>

              {/* AREA */}
              <div className="col-md-4 mb-3">

                <label className="form-label">
                  Area (sq.ft)
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="area"
                  value={property.area}
                  onChange={handleChange}
                />

              </div>

              {/* STATUS */}
              <div className="col-md-6 mb-3">

                <label className="form-label">
                  Status
                </label>

                <select
                  className="form-select"
                  name="status"
                  value={property.status}
                  onChange={handleChange}
                >

                  <option value="Available">
                    Available
                  </option>

                  <option value="Sold">
                    Sold
                  </option>

                  <option value="Reserved">
                    Reserved
                  </option>

                </select>

              </div>

            </div>

            <div className="mt-3">

              <button
                type="submit"
                className="btn btn-success me-2"
              >
                💾 {selectedProperty ? "Update" : "Save"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
              >
                ← Back
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default PropertyForm;
