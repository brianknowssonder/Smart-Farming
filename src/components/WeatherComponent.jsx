import { useState } from "react";

const WeatherComponent = () => {
  const API_KEY = "da332b532324f8d565bafa71121cbd87";

  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState("");

  const convertToTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString();
  };

  const setBackground = (description) => {
    let backgroundUrl = "";

    if (description.includes("clear")) {
      backgroundUrl = "url('https://www.istockphoto.com/photo/young-woman-sitting-on-edge-looks-out-at-view-gm1065043970-284792252')";
    } else if (description.includes("cloud")) {
      backgroundUrl = "url('https://www.istockphoto.com/photo/clouds-on-sky-gm184103864-16699674')";
    } else if (description.includes("rain")) {
      backgroundUrl = "url('https://www.istockphoto.com/photo/transparent-umbrella-under-rain-against-water-drops-splash-background-rainy-weather-gm1257951336-368822698')";
    } else if (description.includes("snow")) {
      backgroundUrl = "url('https://www.istockphoto.com/photo/skier-skis-down-slope-through-fresh-powder-snow-gm2165025120-585254961')";
    } else {
      backgroundUrl = "url('https://media.istockphoto.com/id/1365264688/vector/weather-forecast-meteorology-widget-app-interface.jpg?s=612x612&w=0&k=20&c=OSQHTnpLnK_p5jpyJ3i1hU7CWPSDUV_9JV69WqANgYk=')";
    }

    setBackgroundImage(backgroundUrl);
  };

  const getWeather = async () => {
    if (!city) {
      alert("Please enter a city.");
      return;
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch weather data.");
      }
      const data = await response.json();
      setWeatherData(data);
      setBackground(data.weather[0].description);
    } catch (error) {
      alert(error.message);
      setWeatherData(null);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: backgroundImage,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "2rem",
      }}
    >
      <div className="container bg-light p-4 rounded shadow">
        <h2 className="mb-4">Weather Dashboard</h2>

        {/* Search Input */}
        <div className="form-group mb-3">
          <label htmlFor="city">Enter City</label>
          <input
            type="text"
            className="form-control"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name"
            required
          />
        </div>

        <button className="btn btn-primary" onClick={getWeather}>
          Get Weather
        </button>

        {/* Weather Information */}
        {weatherData && (
          <div id="weatherInfo" className="mt-5">
            <h3>
              Weather in <span>{weatherData.name}</span>
            </h3>
            <p>
              <strong>Temperature:</strong> {weatherData.main.temp} °C
            </p>
            <p>
              <strong>Feels Like:</strong> {weatherData.main.feels_like} °C
            </p>
            <p>
              <strong>Humidity:</strong> {weatherData.main.humidity}%
            </p>
            <p>
              <strong>Wind Speed:</strong> {weatherData.wind.speed} m/s
            </p>
            <p>
              <strong>Description:</strong> {weatherData.weather[0].description}
            </p>
            <p>
              <strong>Sunrise:</strong> {convertToTime(weatherData.sys.sunrise + weatherData.timezone)}
            </p>
            <p>
              <strong>Sunset:</strong> {convertToTime(weatherData.sys.sunset + weatherData.timezone)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherComponent;
