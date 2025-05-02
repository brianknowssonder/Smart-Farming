import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { FaLeaf } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import PulseLoader from "react-spinners/PulseLoader"; // ✅ Import PulseLoader

const API_KEY = "da332b532324f8d565bafa71121cbd87";

const DashboardComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cropData, setCropData] = useState(null);
  const [error, setError] = useState("");

  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const [forecastData, setForecastData] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [isCropLoading, setIsCropLoading] = useState(false);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setSearchTerm("");
    setCropData(null);
    setLocation("");
    setWeatherData(null);
    setWeatherError("");
    setForecastData([]);
  };

  const fetchCropDetails = async () => {
    if (!searchTerm.trim()) {
      setError("Please enter a crop name.");
      setCropData(null);
      return;
    }

    setIsCropLoading(true);

    try {
      const response = await fetch(`https://openfarm.cc/api/v1/crops/?filter=${searchTerm}`);
      const text = await response.text();

      if (text.includes("<!DOCTYPE html>")) {
        throw new Error("Received HTML, possibly an error page.");
      }

      const data = JSON.parse(text);
      if (data && data.data && data.data.length > 0) {
        const crop = data.data[0].attributes;
        setCropData({
          name: crop.name,
          description: crop.description,
          main_image_path: crop.main_image_path,
        });
        setError("");
      } else {
        setCropData(null);
        setError("No crop found with that name.");
      }
    } catch (err) {
      setCropData(null);
      setError("Failed to fetch crop data. Please try again later.");
      console.error(err.message);
    } finally {
      setIsCropLoading(false);
    }
  };

  const fetchWeatherForecast = async () => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      if (data.cod === "200") {
        const simplified = data.list
          .filter((item, index) => index % 8 === 0)
          .map((item) => ({
            date: item.dt_txt.split(" ")[0],
            temp: item.main.temp,
          }));

        setForecastData(simplified);
      } else {
        setForecastData([]);
      }
    } catch (err) {
      setForecastData([]);
    }
  };

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
        await fetchWeatherForecast();
      } else {
        setWeatherError("City not found");
        setWeatherData(null);
        setForecastData([]);
      }
    } catch (err) {
      setWeatherError("Error fetching weather data");
      setWeatherData(null);
      setForecastData([]);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  return (
    <div className="container-fluid p-3 bg-light">
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />

      <div className="text-center mb-4">
        <h1 className="bg-success text-white p-2 rounded">Farmer's Dashboard</h1>
        <p className="text-muted">Search for crop information and check your local weather</p>
      </div>

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
              {isCropLoading ? (
                <>
                  <PulseLoader size={6} color="#ffffff" />
                  Loading...
                </>
              ) : (
                "Search Crop"
              )}
            </button>
          </div>
        </div>
      </div>

      {cropData && (
        <div className="row justify-content-center mb-4">
          <div className="col-md-8">
            <div className="card shadow">
              <div className="card-body">
                <h3 className="card-title">{cropData.name}</h3>
                <p>{cropData.description}</p>
                {cropData.main_image_path && (
                  <img
                    src={cropData.main_image_path}
                    alt={cropData.name}
                    className="img-fluid rounded"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {error && <div className="text-danger text-center">{error}</div>}

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
              {isWeatherLoading ? (
                <>
                  <PulseLoader size={6} color="#ffffff" />
                  Loading...
                </>
              ) : (
                "Get Weather"
              )}
            </button>
          </div>
        </div>
      </div>

      {weatherData && (
        <div className="row justify-content-center mb-4">
          <div className="col-md-6">
            <div className="card text-white bg-info shadow">
              <div className="card-body text-center">
                <h4 className="card-title">{weatherData.name}</h4>
                <p className="card-text">
                  {weatherData.weather[0].description} <br />
                  Temperature: {weatherData.main.temp}°C <br />
                  Humidity: {weatherData.main.humidity}% <br />
                </p>
                <img
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                  alt="weather icon"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {weatherError && <div className="text-danger text-center">{weatherError}</div>}

      {/* Forecast Chart */}
      {forecastData.length > 0 && (
        <div className="row justify-content-center my-4">
          <div className="col-md-8">
            <div className="card shadow p-3">
              <h5 className="text-center mb-3">📈 5-Day Temperature Forecast</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis unit="°C" />
                  <Tooltip />
                  <Line type="monotone" dataKey="temp" stroke="#28a745" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Farming Tips */}
      <div className="row mt-4">
        <div className="col-md-12">
          <h4 className="mb-3">🌿 Farming Tips</h4>
          <ul className="list-group">
            <li className="list-group-item">
              <FaLeaf /> Water early in the morning to reduce evaporation.
            </li>
            <li className="list-group-item">
              <FaLeaf /> Keep checking for pests during warm, dry spells.
            </li>
            <li className="list-group-item">
              <FaLeaf /> Use crop rotation to improve soil health.
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardComponent;
