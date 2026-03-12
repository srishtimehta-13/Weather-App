import { useState } from "react";

const API_KEY = "1127276c50441333b182fd074405e1a5";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [unit, setUnit] = useState("metric");

  const handleSearch = async () => {
    if (!city) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "City not found");
      }

      setWeather(data);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    }

    setLoading(false);
  };

  const toggleUnit = () => {
    const newUnit = unit === "metric" ? "imperial" : "metric";
    setUnit(newUnit);

    if (weather) {
      handleSearch();
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "80px",
        fontFamily: "Arial",
      }}
    >
      <h1>Weather App 🌤️</h1>

      <input
        type="text"
        placeholder="Enter city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        style={{
          padding: "8px",
          marginRight: "10px",
        }}
      />

      <button onClick={handleSearch} style={{ padding: "8px 12px" }}>
        Search
      </button>

      <button
        onClick={toggleUnit}
        style={{ padding: "8px 12px", marginLeft: "10px" }}
      >
        Toggle °C / °F
      </button>

      {loading && <p>Loading weather...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div
          style={{
            marginTop: "30px",
            padding: "20px",
            borderRadius: "10px",
            background: "#f2f2f2",
            width: "250px",
            marginInline: "auto",
          }}
        >
          <h2>{weather.name}</h2>

          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />

          <h3>
            {weather.main.temp}°{unit === "metric" ? "C" : "F"}
          </h3>

          <p>{weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default App;