import { useState } from "react";
import "./App.css";

const API_KEY = "1127276c50441333b182fd074405e1a5";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [unit, setUnit] = useState("metric");
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city) return;

    try {
      setError("");

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    }
  };

  const toggleUnit = () => {
    setUnit(unit === "metric" ? "imperial" : "metric");
    if (weather) fetchWeather();
  };

  return (
    <div className="app">

      <h1 className="title">Weather App</h1>

      <div className="search">
        <input
          type="text"
          placeholder="Search city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
        />

        <button onClick={fetchWeather}>Search</button>

        <button onClick={toggleUnit}>°C / °F</button>
      </div>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="card">

          <h2>
            {weather.name}, {weather.sys.country}
          </h2>

          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather"
          />

          <h1 className="temp">
            {weather.main.temp}°{unit === "metric" ? "C" : "F"}
          </h1>

          <p className="desc">
            {weather.weather[0].description}
          </p>

          <div className="details">

            <div>
              <p>Feels Like</p>
              <span>{weather.main.feels_like}°</span>
            </div>

            <div>
              <p>Humidity</p>
              <span>{weather.main.humidity}%</span>
            </div>

            <div>
              <p>Wind</p>
              <span>{weather.wind.speed}</span>
            </div>

            <div>
              <p>Pressure</p>
              <span>{weather.main.pressure}</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default App;