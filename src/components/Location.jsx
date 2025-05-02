import React, { useState } from "react";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"; // For Google Maps
import { PulseLoader } from "react-spinners"; // For loading spinner

const GOOGLE_GEOCODING_API_KEY = "AlzaSyBMsahqnciZ15JvA-WH7oJHhHKPI5GWqpg"; // Replace with your Google Geocoding API key
const GOOGLE_PLACES_API_KEY = "your_google_places_api_key"; // Replace with your Google Places API key

const LocationComponent = () => {
  const [city, setCity] = useState("");
  const [agrovets, setAgrovets] = useState([]);
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const fetchAgrovets = async () => {
    if (!city.trim()) {
      setError("Please enter a city.");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      // Step 1: Get coordinates from Google Geocoding API
      const geocodingResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${GOOGLE_GEOCODING_API_KEY}`
      );
      
      // Log the response for debugging purposes
      console.log("Geocoding API Response:", geocodingResponse.data);

      const location = geocodingResponse.data.results[0]?.geometry.location;
      
      if (!location) {
        setError("City not found. Please try again.");
        setLoading(false);
        return;
      }

      setCoordinates(location);

      // Step 2: Fetch nearby agrovets using Google Places API
      const { lat, lng } = location;
      const agrovetsResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=store&keyword=agrovet&key=${GOOGLE_PLACES_API_KEY}`
      );
      
      setAgrovets(agrovetsResponse.data.results);
    } catch (err) {
      console.error("Error fetching agrovets:", err);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center mb-4">Find Nearby Agrovets</h2>

      {/* City Input */}
      <div className="row justify-content-center mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter city"
              value={city}
              onChange={handleCityChange}
            />
            <button
              className="btn btn-primary"
              onClick={fetchAgrovets}
              disabled={loading}
            >
              {loading ? (
                <PulseLoader color="#fff" size={8} />
              ) : (
                "Find Agrovets"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="text-danger text-center">{error}</div>}

      {/* Display Agrovets List */}
      {agrovets.length > 0 && (
        <div className="row justify-content-center my-4">
          <div className="col-md-8">
            <h5 className="text-center">Nearby Agrovets:</h5>
            <ul className="list-group">
              {agrovets.map((agrovet, index) => (
                <li className="list-group-item" key={index}>
                  <strong>{agrovet.name}</strong>
                  <p>{agrovet.vicinity}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Display Google Map */}
      {coordinates && (
        <div className="row justify-content-center my-4">
          <div className="col-md-8">
            <LoadScript googleMapsApiKey={GOOGLE_PLACES_API_KEY}>
              <GoogleMap
                mapContainerStyle={{
                  height: "400px",
                  width: "100%",
                }}
                center={coordinates}
                zoom={13}
              >
                {agrovets.map((agrovet, index) => (
                  <Marker
                    key={index}
                    position={{
                      lat: agrovet.geometry.location.lat,
                      lng: agrovet.geometry.location.lng,
                    }}
                    title={agrovet.name}
                  />
                ))}
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationComponent;
