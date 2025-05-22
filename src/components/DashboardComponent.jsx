import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { FaLeaf } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import PulseLoader from "react-spinners/PulseLoader";
import axios from "axios";

const API_KEY = "da332b532324f8d565bafa71121cbd87";
const AGRO_API_KEY = "e79177809dd3d0942942f17e0886ab01";

function generateSquarePolygon(lat, lon, sizeInMeters = 1000) {
  const earthRadius = 6378137;
  const dLat = (sizeInMeters / earthRadius) * (180 / Math.PI);
  const dLon = dLat / Math.cos((lat * Math.PI) / 180);

  const lat1 = lat - dLat / 2;
  const lat2 = lat + dLat / 2;
  const lon1 = lon - dLon / 2;
  const lon2 = lon + dLon / 2;

  return [
    [lon1, lat1],
    [lon2, lat1],
    [lon2, lat2],
    [lon1, lat2],
    [lon1, lat1],
  ];
}

const DashboardComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cropData, setCropData] = useState(null);
  const [error, setError] = useState("");

  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [weatherError, setWeatherError] = useState("");

  const [cropConditionData, setCropConditionData] = useState(null);
  const [polygonId, setPolygonId] = useState(null);
  const [weatherPredictor, setWeatherPredictor] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCropLoading, setIsCropLoading] = useState(false);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setIsLoggedIn(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setSearchTerm("");
    setCropData(null);
    setLocation("");
    setWeatherData(null);
    setWeatherError("");
    setCropConditionData(null);
    setWeatherPredictor([]);
  };

  const fetchCropDetails = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a crop name.");
      setCropData(null);
      return;
    }

    setIsCropLoading(true);
    await createPolygon();

    try {
      const response = await axios.get(
        "https://en.wikipedia.org/api/rest_v1/page/summary/" + searchTerm
      );
      const data = response.data.extract_html;

      if (data) {
        setCropData({ htmlContent: data });
        setError("");
      } else {
        setCropData(null);
        setError("No crop found with that name.");
      }
    } catch (err) {
      setCropData(null);
      setError("Failed to fetch crop data. Please try again later.");
    } finally {
      setIsCropLoading(false);
    }
  };

  const createPolygon = async () => {
    try {
      const centerLat = 36.8219;
      const centerLon = -1.2921;

      const coordinates = generateSquarePolygon(centerLat, centerLon);

      const response = await axios.post(
        `https://api.agromonitoring.com/agro/1.0/polygons?appid=${AGRO_API_KEY}`,
        {
          name: searchTerm || "CropArea",
          geo_json: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Polygon",
              coordinates: [coordinates],
            },
          },
        }
      );

      setPolygonId(response.data.id);
    } catch (err) {
      console.error("Polygon creation failed", err.response?.data || err.message);
    }
  };

  const fetchCropConditions = async (polyId) => {
    try {
      const now = Math.floor(Date.now() / 1000);
      const thirtyDaysAgo = now - 30 * 24 * 60 * 60;

      const weatherRes = await axios.get(
        `https://api.agromonitoring.com/agro/1.0/weather/polygon?polyid=${polyId}&appid=${AGRO_API_KEY}`
      );

      const ndviRes = await axios.get(
        `https://api.agromonitoring.com/agro/1.0/ndvi/history?start=${thirtyDaysAgo}&end=${now}&polyid=${polyId}&appid=${AGRO_API_KEY}`
      );

      setCropConditionData({
        weather: weatherRes.data,
        ndvi: ndviRes.data,
      });
    } catch (err) {
      console.error("Error fetching polygon data", err);
      setCropConditionData(null);
    }
  };

  useEffect(() => {
    if (polygonId) {
      fetchCropConditions(polygonId);
    }
  }, [polygonId]);

  const fetchWeather = async () => {
    setIsWeatherLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (data.cod === 200) {
        setWeatherData(data);
        setWeatherError("");
        setWeatherPredictor(generateMonthlyData());
      } else {
        setWeatherError("City not found");
        setWeatherData(null);
        setWeatherPredictor([]);
      }
    } catch (err) {
      setWeatherError("Error fetching weather data");
      setWeatherData(null);
      setWeatherPredictor([]);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  const generateMonthlyData = () => {
    return [
      { month: "Jan", temp: 20, rainfall: 50 },
      { month: "Feb", temp: 21, rainfall: 60 },
      { month: "Mar", temp: 23, rainfall: 80 },
      { month: "Apr", temp: 26, rainfall: 100 },
      { month: "May", temp: 28, rainfall: 110 },
      { month: "Jun", temp: 26, rainfall: 90 },
      { month: "Jul", temp: 24, rainfall: 70 },
      { month: "Aug", temp: 23, rainfall: 60 },
      { month: "Sep", temp: 24, rainfall: 50 },
      { month: "Oct", temp: 25, rainfall: 40 },
      { month: "Nov", temp: 23, rainfall: 45 },
      { month: "Dec", temp: 21, rainfall: 55 },
    ];
  };

  return (
    <div className="container-fluid">
      <div className="dashboard-overlay">
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <div id="dashboard-background" className="container-fluid p-4">
          <h2 className="text-center text-white mb-4">🌾 Crop and Weather Dashboard</h2>
               <br />
               <br />
               <br />
          {/* Crop Search */}
          <div className="row justify-content-center mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter crop name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  className="btn btn-success d-flex align-items-center justify-content-center gap-2"
                  onClick={fetchCropDetails}
                  disabled={isCropLoading}
                >
                  {isCropLoading ? <PulseLoader size={6} color="#fff" /> : "Search Crop"}
                </button>
              </div>
            </div>
          </div>

          {/* Crop Display */}
          {cropData && cropData.htmlContent && (
            <div className="row justify-content-center mb-4">
              <div className="col-md-8">
                <div className="card shadow">
                  <div className="card-body">
                    <div dangerouslySetInnerHTML={{ __html: cropData.htmlContent }} />
                    <div className="text-center mt-3">
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                          searchTerm + " farming"
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-danger rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2"
                      >
                        <FaYoutube size={20} /> Learn More 
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Crop Condition */}
          {cropConditionData && (
            <div className="row justify-content-center mb-4">
              <div className="col-md-8">
                <div className="card shadow">
                  <div className="card-body">
                    <h5 className="text-center">Crop Condition (NDVI & Weather)</h5>
                    <p><strong>Polygon Weather:</strong></p>
                    <ul>
                      <li>Temperature: {cropConditionData.weather.main?.temp} °C</li>
                      <li>Humidity: {cropConditionData.weather.main?.humidity} %</li>
                    </ul>
                    <hr />
                    <h6>📊 NDVI Index (Last 30 days)</h6>
                    {cropConditionData.ndvi.length > 0 ? (
                      <ul>
                        {cropConditionData.ndvi.map((entry, index) => (
                          <li key={index}>
                            {new Date(entry.dt * 1000).toLocaleDateString()}: NDVI = {entry.ndvi}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No NDVI data available.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Weather Search */}
          <div className="row justify-content-center mb-4">
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter city for weather"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
                <button
                  className="btn btn-primary d-flex align-items-center justify-content-center gap-2"
                  onClick={fetchWeather}
                  disabled={isWeatherLoading}
                >
                  {isWeatherLoading ? <PulseLoader size={6} color="#fff" /> : "Get Weather"}
                </button>
              </div>
            </div>
          </div>
            
          {weatherData && (
            <>
              <div className="row justify-content-center mb-4">
                <div className="col-md-6">
                  <div className="card text-white bg-info shadow">
                    <div className="card-body text-center">
                      <h4 className="card-title">{weatherData.name}</h4>
                      <p className="card-text">
                        {weatherData.weather[0].description}<br />
                        Temperature: {weatherData.main.temp}°C<br />
                        Humidity: {weatherData.main.humidity}%
                      </p>
                      <img
                        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                        alt="weather icon"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 📅 Yearly Weather Predictor */}
              <div className="row justify-content-center mb-4">
                <div className="col-md-10">
                  <div className="card shadow p-3">
                    <h5 className="text-center mb-3">📅 Yearly Weather Predictor</h5>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={weatherPredictor}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          stroke="#82ca9d"
                          label={{ value: "Rainfall (mm)", angle: -90, position: "insideRight" }}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="temp" fill="#8884d8" name="Avg Temp (°C)" />
                        <Bar yAxisId="right" dataKey="rainfall" fill="#82ca9d" name="Rainfall (mm)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}

          {weatherError && <div className="text-danger text-center">{weatherError}</div>}
            <br />
          {/* Farming Tips */}
          <div className="row mt-4 justify-content-center">
            <div className="col-md-8">
              <h4 className="mb-3 text-white">🌿 Farming Tips</h4>
              <ul className="list-group">
                <li className="list-group-item"><FaLeaf /> Water early in the morning to reduce evaporation.</li>
                <li className="list-group-item"><FaLeaf /> Check for pests during warm, dry spells.</li>
                <li className="list-group-item"><FaLeaf /> Use crop rotation to improve soil health.</li>
              </ul>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default DashboardComponent;
