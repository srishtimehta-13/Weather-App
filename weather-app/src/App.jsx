import {
  WiDaySunny,
  WiCloud,
  WiCloudy,
  WiRain,
  WiThunderstorm,
  WiSnow,
  WiFog
} from "react-icons/wi";

import { useState, useEffect } from "react";
import "./App.css";
import RecentSearches from "./components/RecentSearches";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTemperatureHalf,
  faDroplet,
  faWind,
  faGaugeHigh
} from "@fortawesome/free-solid-svg-icons";

const API_KEY = "1127276c50441333b182fd074405e1a5";

function App() {

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [unit, setUnit] = useState("metric");
  const [error, setError] = useState("");

  // NEW STATE
  const [recent, setRecent] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("recentCities")) || [];
    setRecent(stored);
  }, []);

  // Save searched cities
  const saveCity = (cityName) => {

    const updated = [cityName, ...recent.filter(c => c !== cityName)];

    const lastFive = updated.slice(0,5);

    setRecent(lastFive);

    localStorage.setItem(
      "recentCities",
      JSON.stringify(lastFive)
    );
  };

  const fetchWeather = async (cityName = city) => {

    if (!cityName) return;

    try {

      setError("");

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=${unit}`
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setWeather(data);

      // Save city to localStorage
      saveCity(cityName);

      // Update input field
      setCity(cityName);

    } catch (err) {

      setError(err.message);
      setWeather(null);

    }
  };

  const toggleUnit = () => {
    const newUnit = unit === "metric" ? "imperial" : "metric";
    setUnit(newUnit);

    if (weather) fetchWeather(weather.name);
  };

  const getWeatherIcon = (description) => {

    description = description.toLowerCase();

    if (description.includes("clear"))
      return <WiDaySunny className="weather-icon" />;

    if (description.includes("few clouds"))
      return <WiCloud className="weather-icon" />;

    if (description.includes("scattered clouds"))
      return <WiCloud className="weather-icon" />;

    if (description.includes("broken clouds"))
      return <WiCloudy className="weather-icon" />;

    if (description.includes("overcast"))
      return <WiCloudy className="weather-icon" />;

    if (description.includes("rain"))
      return <WiRain className="weather-icon" />;

    if (description.includes("thunderstorm"))
      return <WiThunderstorm className="weather-icon" />;

    if (description.includes("snow"))
      return <WiSnow className="weather-icon" />;

    if (description.includes("mist") || description.includes("fog") || description.includes("haze"))
      return <WiFog className="weather-icon" />;

    return <WiCloud className="weather-icon" />;
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

        <button onClick={() => fetchWeather()}>Search</button>

        <button onClick={toggleUnit}>°C / °F</button>

      </div>

      {/* Recent Searches Component */}
      <RecentSearches
        recent={recent}
        onSearch={fetchWeather}
      />

      {error && <p className="error">{error}</p>}

      {weather && (

        <div className="card">

          <h2>
            {weather.name}, {weather.sys.country}
          </h2>

          {getWeatherIcon(weather.weather[0].description)}

          <h1 className="temp">
            {weather.main.temp}°{unit === "metric" ? "C" : "F"}
          </h1>

          <p className="desc">
            {weather.weather[0].description}
          </p>

          <div className="details">

            <div className="detail-box">
              <FontAwesomeIcon icon={faTemperatureHalf} className="detail-icon"/>
              <p>Feels Like</p>
              <span>{weather.main.feels_like}°</span>
            </div>

            <div className="detail-box">
              <FontAwesomeIcon icon={faDroplet} className="detail-icon"/>
              <p>Humidity</p>
              <span>{weather.main.humidity}%</span>
            </div>

            <div className="detail-box">
              <FontAwesomeIcon icon={faWind} className="detail-icon"/>
              <p>Wind</p>
              <span>{weather.wind.speed}</span>
            </div>

            <div className="detail-box">
              <FontAwesomeIcon icon={faGaugeHigh} className="detail-icon"/>
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