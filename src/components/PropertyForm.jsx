import React, { useEffect, useState } from "react";
import axios from "axios";

import { API_URL as BASE_API_URL } from "../config";
const API_URL = `${BASE_API_URL}/api/properties`;

const emptyProperty = {
  purpose: "",
  category: "",
  propertyType: "",
  city: "",
  locality: "",

  carpetArea: "",
  builtUpArea: "",
  superBuiltUpArea: "",

  bedrooms: "",
  bathrooms: "",
  balconies: "",

  furnishing: "",
  propertyFloor: "",
  totalFloors: "",

  parking: "",
  parkingType: "",

  expectedPrice: "",
  depositAmount: "",
  pricePerUnit: "",

  priceNegotiable: false,
  taxAndGovtChargesExcluded: false,
  dgUpsPriceIncluded: false,

  availabilityStatus: "",

  officeType: "",
  minSeats: "",
  maxSeats: "",
  cabins: "",
  meetingRooms: "",
  pantryType: "",
  receptionArea: "",
  centralAirConditioning: "",
  conferenceRoom: "",
  washrooms: "",

  propertyLevel: "",
  specifyLevel: "",

  preLeasedOrPreRented: "",

  description: "",
};

function PropertyForm({ selectedProperty, onSave, onCancel }) {
  const [property, setProperty] = useState(emptyProperty);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedProperty) {
      setProperty(emptyProperty);
      setError("");
      return;
    }

    setProperty({
      ...emptyProperty,
      ...selectedProperty,
    });
    setError("");
}, [selectedProperty]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProperty((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const calculatePricePerUnit = () => {
    const price = Number(property.expectedPrice);
    const area = Number(property.carpetArea);

    if (price > 0 && area > 0) {
      setProperty((prev) => ({
        ...prev,
        pricePerUnit: (price / area).toFixed(2),
      }));
    }
  };
const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      const data = {
        ...property,

        carpetArea:
          property.carpetArea === ""
            ? null
            : Number(property.carpetArea),

        builtUpArea:
          property.builtUpArea === ""
            ? null
            : Number(property.builtUpArea),

        superBuiltUpArea:
          property.superBuiltUpArea === ""
            ? null
            : Number(property.superBuiltUpArea),

        bedrooms:
          property.bedrooms === ""
            ? null
            : Number(property.bedrooms),

        bathrooms:
          property.bathrooms === ""
            ? null
            : Number(property.bathrooms),

        balconies:
          property.balconies === ""
            ? null
            : Number(property.balconies),

        propertyFloor:
          property.propertyFloor === ""
            ? null
            : Number(property.propertyFloor),

        totalFloors:
          property.totalFloors === ""
            ? null
            : Number(property.totalFloors),

        expectedPrice:
          property.expectedPrice === ""
            ? null
            : Number(property.expectedPrice),

        depositAmount:
          property.depositAmount === ""
            ? null
            : Number(property.depositAmount),

        pricePerUnit:
          property.pricePerUnit === ""
            ? null
            : Number(property.pricePerUnit),

        minSeats:
          property.minSeats === ""
            ? null
            : Number(property.minSeats),

        maxSeats:
          property.maxSeats === ""
            ? null
            : Number(property.maxSeats),

        cabins:
          property.cabins === ""
            ? null
            : Number(property.cabins),

        meetingRooms:
          property.meetingRooms === ""
            ? null
            : Number(property.meetingRooms),      };

      let savedProperty;

      if (selectedProperty) {
        const response = await axios.put(
          `${API_URL}/${selectedProperty.id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        savedProperty = response.data;
      } else {
        const response = await axios.post(
          API_URL,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        savedProperty = response.data;
      }



      alert(
        selectedProperty
          ? "Property updated successfully."
          : "Property added successfully."
      );

      onSave(savedProperty);

    } catch (err) {
      console.error("Property Save Error:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data ||
        "Failed to save property.";

      setError(
        typeof message === "string"
          ? message
          : "Failed to save property."
      );
    }
  };
return (
    <div className="container mt-4">

      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">

        <h3 className="mb-0">
          {selectedProperty
            ? "✏️ Update Property"
            : "➕ Add Property"}
        </h3>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
        >
          ← Back to Dashboard
        </button>

      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* BASIC DETAILS */}
       
<h5 className="mb-3">Property Details</h5>

<div className="row">
  {/* Purpose */}
  <div className="col-md-6 mb-3">
    <label className="form-label">Purpose</label>
    <select
      name="purpose"
      value={property.purpose}
      onChange={handleChange}
      className="form-select"
    >
      <option value="">Select Purpose</option>
      <option value="Sell">Sell</option>
      <option value="Rent-Lease">Rent / Lease</option>
      <option value="PG">PG</option>
    </select>
  </div>

  {/* Category */}
  <div className="col-md-6 mb-3">
    <label className="form-label">Category</label>
    <select
      name="category"
      value={property.category}
      onChange={handleChange}
      className="form-select"
    >
      <option value="">Select Category</option>
      <option value="Residential">Residential</option>
      <option value="Commercial">Commercial</option>
    </select>
  </div>

  {/* Property Type */}
  <div className="col-md-6 mb-3">
    <label className="form-label">Property Type</label>
    <select
      name="propertyType"
      value={property.propertyType}
      onChange={handleChange}
      className="form-select"
    >
      <option value="">Select Property Type</option>

      {property.category === "Residential" && (
        <>
          <option value="Flat / Apartment">Flat / Apartment</option>
          <option value="Independent House / Villa">
            Independent House / Villa
          </option>
          <option value="Builder Floor">Builder Floor</option>
          <option value="1 RK / Studio">1 RK / Studio</option>
          <option value="Serviced Apartment">Serviced Apartment</option>
          <option value="Farmhouse">Farmhouse</option>
        </>
      )}

      {property.category === "Commercial" && (
        <>
          <option value="Shop / Showroom">Shop / Showroom</option>
          <option value="Office">Office</option>
          <option value="Plot">Plot</option>
          <option value="Storage">Storage</option>
          <option value="Industrial">Industrial</option>
          <option value="Hospitality">Hospitality</option>
        </>
      )}
    </select>
  </div>
</div>

{/* ================= LOCATION DETAILS ================= */}

<h5 className="mt-4 mb-3">Location Details</h5>

<div className="row">
  {/* City */}
  <div className="col-md-6 mb-3">
    <label className="form-label">City</label>
    <input
      type="text"
      name="city"
      value={property.city}
      onChange={handleChange}
      className="form-control"
      placeholder="Enter city"
    />
  </div>

  {/* Locality */}
  <div className="col-md-6 mb-3">
    <label className="form-label">Locality / Apartment</label>
    <input
      type="text"
      name="locality"
      value={property.locality}
      onChange={handleChange}
      className="form-control"
      placeholder="Enter locality / apartment"
    />
  </div>
</div>

       

        {/* AREA */}
        <h5 className="mt-4 mb-3">
          Area Details
        </h5>

        <div className="row">

          <div className="col-md-4 mb-3">
            <label className="form-label">
              Carpet Area *
            </label>

            <input
              type="number"
              className="form-control"
              name="carpetArea"
              value={property.carpetArea}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">
              Built-up Area
            </label>

            <input
              type="number"
              className="form-control"
              name="builtUpArea"
              value={property.builtUpArea}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">
              Super Built-up Area
            </label>

            <input
              type="number"
              className="form-control"
              name="superBuiltUpArea"
              value={property.superBuiltUpArea}
              onChange={handleChange}
            />
          </div>

        </div>

        {/* RESIDENTIAL */}
        {property.category === "Residential" && (
          <>
            <h5 className="mt-4 mb-3">
              Residential Details
            </h5>

            <div className="row">

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

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Balconies
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="balconies"
                  value={property.balconies}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Furnishing
                </label>

                <select
                  className="form-select"
                  name="furnishing"
                  value={property.furnishing}
                  onChange={handleChange}
                >
                  <option value="">
                    Select
                  </option>

                  <option value="Unfurnished">
                    Unfurnished
                  </option>

                  <option value="Semi-Furnished">
                    Semi-Furnished
                  </option>

                  <option value="Fully Furnished">
                    Fully Furnished
                  </option>
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Property Floor
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="propertyFloor"
                  value={property.propertyFloor}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Total Floors
                </label>

                <input
                  type="number"
                  className="form-control"
                  name="totalFloors"
                  value={property.totalFloors}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Parking
                </label>

                <select
                  className="form-select"
                  name="parking"
                  value={property.parking}
                  onChange={handleChange}
                >
                  <option value="">
                    Select
                  </option>
                  <option value="Yes">
                    Yes
                  </option>
                  <option value="No">
                    No
                  </option>
                </select>
              </div>

              {property.parking === "Yes" && (
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Parking Type
                  </label>

                  <select
                    className="form-select"
                    name="parkingType"
                    value={property.parkingType}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select
                    </option>
                    <option value="Open">
                      Open
                    </option>
                    <option value="Covered">
                      Covered
                    </option>
                  </select>
                </div>
              )}

            </div>
          </>
        )}

        {/* COMMERCIAL */}
        {property.category === "Commercial" && (
          <>
            <h5 className="mt-4 mb-3">
              Commercial Details
            </h5>

            <div className="row">

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Parking
                </label>

                <select
                  className="form-select"
                  name="parking"
                  value={property.parking}
                  onChange={handleChange}
                >
                  <option value="">
                    Select
                  </option>
                  <option value="Yes">
                    Yes
                  </option>
                  <option value="No">
                    No
                  </option>
                </select>
              </div>

              {property.parking === "Yes" && (
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Parking Type
                  </label>

                  <select
                    className="form-select"
                    name="parkingType"
                    value={property.parkingType}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select
                    </option>
                    <option value="Open">
                      Open
                    </option>
                    <option value="Covered">
                      Covered
                    </option>
                  </select>
                </div>
              )}

              <div className="col-md-4 mb-3">
                <label className="form-label">
                  Property Level
                </label>

                <select
                  className="form-select"
                  name="propertyLevel"
                  value={property.propertyLevel}
                  onChange={handleChange}
                >
                  <option value="">
                    Select
                  </option>
                  <option value="Basement">
                    Basement
                  </option>
                  <option value="Lower Ground">
                    Lower Ground
                  </option>
                  <option value="Ground">
                    Ground
                  </option>
                  <option value="Upper Ground">
                    Upper Ground
                  </option>
                  <option value="First">
                    First
                  </option>
                  <option value="Second">
                    Second
                  </option>
                  <option value="Third">
                    Third
                  </option>
                  <option value="Fourth">
                    Fourth
                  </option>
                  <option value="Fifth">
                    Fifth
                  </option>
                  <option value="Sixth">
                    Sixth
                  </option>
                  <option value="Seventh">
                    Seventh
                  </option>
                  <option value="Eighth">
                    Eighth
                  </option>
                  <option value="Ninth">
                    Ninth
                  </option>
                  <option value="Tenth">
                    Tenth
                  </option>
                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              {property.propertyLevel === "Other" && (
                <div className="col-md-4 mb-3">
                  <label className="form-label">
                    Specify Level
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="specifyLevel"
                    value={property.specifyLevel}
                    onChange={handleChange}
                  />
                </div>
              )}

            </div>

            {property.propertyType === "Office" && (
              <>
                <h6 className="mt-3 mb-3">
                  Office Details
                </h6>

                <div className="row">

                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      Office Type
                    </label>

                    <select
                      className="form-select"
                      name="officeType"
                      value={property.officeType}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select
                      </option>
                      <option value="Ready-to-move">
                        Ready-to-move
                      </option>
                      <option value="Bare Shell">
                        Bare Shell
                      </option>
                      <option value="Co-working">
                        Co-working
                      </option>
                    </select>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      Minimum Seats
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      name="minSeats"
                      value={property.minSeats}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      Maximum Seats
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      name="maxSeats"
                      value={property.maxSeats}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      Cabins
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      name="cabins"
                      value={property.cabins}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      Meeting Rooms
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      name="meetingRooms"
                      value={property.meetingRooms}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      Pantry Type
                    </label>

                    <select
                      className="form-select"
                      name="pantryType"
                      value={property.pantryType}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select
                      </option>
                      <option value="Wet">
                        Wet
                      </option>
                      <option value="Dry">
                        Dry
                      </option>
                      <option value="Not Available">
                        Not Available
                      </option>
                    </select>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      Reception Area
                    </label>

                    <select
                      className="form-select"
                      name="receptionArea"
                      value={property.receptionArea}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select
                      </option>
                      <option value="Available">
                        Available
                      </option>
                      <option value="Not Available">
                        Not Available
                      </option>
                    </select>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      Central Air Conditioning
                    </label>

                    <select
                      className="form-select"
                      name="centralAirConditioning"
                      value={property.centralAirConditioning}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select
                      </option>
                      <option value="Available">
                        Available
                      </option>
                      <option value="Not Available">
                        Not Available
                      </option>
                    </select>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      Conference Room
                    </label>

                    <select
                      className="form-select"
                      name="conferenceRoom"
                      value={property.conferenceRoom}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select
                      </option>
                      <option value="Available">
                        Available
                      </option>
                      <option value="Not Available">
                        Not Available
                      </option>
                    </select>
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label">
                      Washrooms
                    </label>

                    <select
                      className="form-select"
                      name="washrooms"
                      value={property.washrooms}
                      onChange={handleChange}
                    >
                      <option value="">
                        Select
                      </option>
                      <option value="Available">
                        Available
                      </option>
                      <option value="Not Available">
                        Not Available
                      </option>
                    </select>
                  </div>

                </div>
              </>
            )}
          </>
        )}

        {/* PRICING */}
        <h5 className="mt-4 mb-3">
          Pricing
        </h5>

        <div className="row">

          <div className="col-md-4 mb-3">
            <label className="form-label">
              Expected Price
            </label>

            <input
              type="number"
              className="form-control"
              name="expectedPrice"
              value={property.expectedPrice}
              onChange={handleChange}
              onBlur={calculatePricePerUnit}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">
              Deposit Amount
            </label>

            <input
              type="number"
              className="form-control"
              name="depositAmount"
              value={property.depositAmount}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="form-label">
              Price Per Unit
            </label>

            <input
              type="number"
              className="form-control"
              name="pricePerUnit"
              value={property.pricePerUnit}
              onChange={handleChange}
            />
          </div>

        </div>

        <div className="row">

          <div className="col-md-4 mb-3">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="priceNegotiable"
                checked={property.priceNegotiable}
                onChange={handleChange}
                id="priceNegotiable"
              />

              <label
                className="form-check-label"
                htmlFor="priceNegotiable"
              >
                Price Negotiable
              </label>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="taxAndGovtChargesExcluded"
                checked={property.taxAndGovtChargesExcluded}
                onChange={handleChange}
                id="taxAndGovtChargesExcluded"
              />

              <label
                className="form-check-label"
                htmlFor="taxAndGovtChargesExcluded"
              >
                Tax & Govt Charges Excluded
              </label>
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                name="dgUpsPriceIncluded"
                checked={property.dgUpsPriceIncluded}
                onChange={handleChange}
                id="dgUpsPriceIncluded"
              />

              <label
                className="form-check-label"
                htmlFor="dgUpsPriceIncluded"
              >
                DG / UPS Price Included
              </label>
            </div>
          </div>

        </div>

        {/* AVAILABILITY */}
        <h5 className="mt-4 mb-3">
          Availability
        </h5>

        <div className="row">

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Availability Status
            </label>

            <select
              className="form-select"
              name="availabilityStatus"
              value={property.availabilityStatus}
              onChange={handleChange}
            >
              <option value="">
                Select
              </option>
              <option value="Ready to Move">
                Ready to Move
              </option>
              <option value="Under Construction">
                Under Construction
              </option>
              <option value="Available Soon">
                Available Soon
              </option>
            </select>
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">
              Pre-Leased / Pre-Rented
            </label>

            <select
              className="form-select"
              name="preLeasedOrPreRented"
              value={property.preLeasedOrPreRented}
              onChange={handleChange}
            >
              <option value="">
                Select
              </option>
              <option value="Yes">
                Yes
              </option>
              <option value="No">
                No
              </option>
            </select>
          </div>

        </div>
        {/* DESCRIPTION */}
        <h5 className="mt-4 mb-3">
          Description
        </h5>

        <div className="mb-3">

          <label className="form-label">
            Property Description
          </label>

          <textarea
            className="form-control"
            name="description"
            value={property.description}
            onChange={handleChange}
            rows="5"
            placeholder="Enter property description"
          />

        </div>

        {/* BUTTONS */}
        <div className="mb-5">

          <button
            type="submit"
            className="btn btn-primary me-2"
          >
            {selectedProperty
              ? "Update Property"
              : "Save Property"}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Cancel
          </button>

        </div>

      </form>

    </div>
  );
}

export default PropertyForm;











