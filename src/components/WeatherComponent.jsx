// WeatherComponent.jsx
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import ChartJS from "chart.js/auto";

export const WeatherComponent = () => {
  const API_KEY = "da332b532324f8d565bafa71121cbd87";
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [forecastData, setForecastData] = useState([]);
  const [showTrend, setShowTrend] = useState(false);

  const convertToTime = (ts) => new Date(ts * 1000).toLocaleTimeString();

  // choose background based on description
  const setBackground = (desc) => {
    let url = "";
    if (desc.includes("clear")) url = "url('clear.jpg')";
    else if (desc.includes("cloud")) url = "url('cloud.jpg')";
    else if (desc.includes("rain")) url = "url('rain.jpg')";
    else if (desc.includes("snow")) url = "url('snow.jpg')";
    else url = "url('default.jpg')";
    setBackgroundImage(url);
  };

  // fetch 5-day forecast, sample every 8th entry, and include rain
  const fetchForecast = async (loc) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${loc}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      if (data.cod === "200") {
        const slice = data.list.filter((_, i) => i % 8 === 0).slice(0, 5);
        setForecastData(
          slice.map((d) => ({
            date: d.dt_txt.split(" ")[0],
            temp: d.main.temp,
            rain: (d.rain && d.rain["3h"]) || 0,
          }))
        );
      } else {
        setForecastData([]);
      }
    } catch {
      setForecastData([]);
    }
  };

  const getWeather = async () => {
    if (!city.trim()) return alert("Please enter a city.");
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error("Failed to fetch.");
      const data = await res.json();
      setWeatherData(data);
      setBackground(data.weather[0].description);
      await fetchForecast(city);
      setShowTrend(true);
    } catch (e) {
      alert(e.message);
      setWeatherData(null);
      setForecastData([]);
      setShowTrend(false);
    }
  };

  // Chart.js config with two datasets
  const trendChartData = {
    labels: forecastData.map((d) => d.date),
    datasets: [
      {
        label: "Temp (°C)",
        data: forecastData.map((d) => d.temp),
        borderColor: "#28a745",        // admin-success
        backgroundColor: "rgba(40,167,69,0.2)",
        yAxisID: "yTemp",
      },
      {
        label: "Rain (mm)",
        data: forecastData.map((d) => d.rain),
        borderColor: "#ffc107",        // warning accent
        backgroundColor: "rgba(255,193,7,0.2)",
        yAxisID: "yRain",
      },
    ],
  };

  const trendChartOptions = {
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    stacked: false,
    scales: {
      yTemp: {
        type: "linear",
        position: "left",
        title: { display: true, text: "Temperature (°C)", color: "#28a745" },
        grid: { drawOnChartArea: false },
      },
      yRain: {
        type: "linear",
        position: "right",
        title: { display: true, text: "Rainfall (mm)", color: "#ffc107" },
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "2rem",
      }}
    >
      <div className="container bg-black text-success border border-success p-4 rounded shadow-lg">
        <h2 className="mb-4 border-bottom border-success pb-2">
          Weather Dashboard
        </h2>

        {/* City Input */}
        <div className="mb-3">
          <label className="form-label text-success">City</label>
          <input
            className="form-control bg-dark text-success border-success"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
          />
        </div>
        <button className="btn btn-success" onClick={getWeather}>
          Get Weather
        </button>

        {/* Current Weather */}
        {weatherData && (
          <div className="mt-5 bg-dark p-4 rounded border border-success">
            <h3 className="text-warning mb-3">
              Weather in {weatherData.name}
            </h3>
            <p>
              <strong>Temperature:</strong> {weatherData.main.temp}°C
            </p>
            <p>
              <strong>Feels Like:</strong> {weatherData.main.feels_like}°C
            </p>
            <p>
              <strong>Humidity:</strong> {weatherData.main.humidity}%
            </p>
            <p>
              <strong>Wind:</strong> {weatherData.wind.speed} m/s
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {weatherData.weather[0].description}
            </p>
            <p>
              <strong>Sunrise:</strong>{" "}
              {convertToTime(weatherData.sys.sunrise + weatherData.timezone)}
            </p>
            <p>
              <strong>Sunset:</strong>{" "}
              {convertToTime(weatherData.sys.sunset + weatherData.timezone)}
            </p>
          </div>
        )}

        {/* Trend Toggle */}
        {forecastData.length > 0 && (
          <div className="mt-4">
            <button
              className="btn btn-warning"
              onClick={() => setShowTrend((v) => !v)}
              aria-expanded={showTrend}
            >
              {showTrend ? "Hide" : "Show"} 5-Day Trends
            </button>
            <div className={`collapse ${showTrend ? "show" : ""} mt-3`}>
              <div className="bg-dark p-3 rounded border border-success">
                <Line
                  data={trendChartData}
                  options={trendChartOptions}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherComponent;
