import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import WeatherCard from "./components/WeatherCard";
import WeatherForecast from "./components/WeatherForecast";
import WeatherEffect from "./components/WeatherEffect";
import WeatherAlerts from "./components/WeatherAlerts";
import AirQuality from "./components/AirQuality";
import HourlyForecast from "./components/HourlyForecast";
import RecentSearches from "./components/RecentSearches";
import { useGeolocation } from "./hooks/useGeolocation";
import { useRecentSearches } from "./hooks/useRecentSearches";
import { fetchCurrentWeather, fetchForecast } from "./api/weather";
import { getWeatherBackground } from "./components/weatherBackground";
import "./App.css";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [query, setQuery] = useState(null);
  const [inputCity, setInputCity] = useState("");
  const [unit, setUnit] = useState("C");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [manualSearch, setManualSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);
  const geo = useGeolocation();
  const { searches, addSearch } = useRecentSearches();

  const toggleDarkMode = () => setIsDarkMode(v => !v);

  useEffect(() => {
    if (manualSearch || geo.loading) return;
    if (geo.coords) {
      setQuery(geo.coords);
    } else if (geo.error) {
      setQuery("London");
      setInputCity("London");
    }
  }, [geo.coords, geo.error, geo.loading, manualSearch]);

  useEffect(() => {
    if (!query) return;
    const units = unit === "C" ? "metric" : "imperial";
    setIsLoading(true);

    Promise.all([
      fetchCurrentWeather(query, units),
      fetchForecast(query, units),
    ])
      .then(([weather, forecast]) => {
        setWeatherData(weather);
        setForecastData(extractForecastDays(forecast.list));
        setHourlyData(forecast.list.slice(0, 8).map(item => ({
          time: new Date(item.dt_txt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          temp: item.main.temp,
          icon: item.weather[0].icon,
          description: item.weather[0].description,
        })));
        const cityName = typeof query === "object" ? weather.name : query;
        if (typeof query === "object") setInputCity(weather.name);
        addSearch(cityName);
      })
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, [query, unit]);

  function extractForecastDays(list) {
    const dayGroups = {};
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const date = item.dt_txt.split(" ")[0];
      if (!dayGroups[date]) dayGroups[date] = [];
      dayGroups[date].push(item);
    }

    const entries = Object.entries(dayGroups);
    const result = [];
    for (let i = 0; i < Math.min(entries.length, 5); i++) {
      const [date, items] = entries[i];
      let tempMin = Infinity, tempMax = -Infinity;
      const descCounts = {};
      const midIdx = Math.floor(items.length / 2);

      for (let j = 0; j < items.length; j++) {
        const t = items[j].main.temp;
        if (t < tempMin) tempMin = t;
        if (t > tempMax) tempMax = t;
        const d = items[j].weather[0].description;
        descCounts[d] = (descCounts[d] || 0) + 1;
      }

      let topDesc = "", topCount = 0;
      for (const [desc, count] of Object.entries(descCounts)) {
        if (count > topCount) { topDesc = desc; topCount = count; }
      }

      const mid = items[midIdx];
      result.push({
        date: new Date(date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        tempMin, tempMax,
        temperature: mid.main.temp,
        description: topDesc,
        icon: `https://openweathermap.org/img/wn/${mid.weather[0].icon}@2x.png`,
      });
    }
    return result;
  }

  useEffect(() => {
    if (!weatherData?.weather) return;
    const weatherClass = getWeatherBackground(weatherData.weather[0].main);
    const allClasses = ["bg-clear", "bg-clouds", "bg-rain", "bg-snow", "bg-mist", "bg-thunder", "bg-default"];
    for (let i = 0; i < allClasses.length; i++) document.body.classList.remove(allClasses[i]);
    document.body.classList.add(weatherClass);
    document.body.classList.remove("dark", "light");
    document.body.classList.add(isDarkMode ? "dark" : "light");
  }, [weatherData, isDarkMode]);

  const handleMouseMove = useCallback((e) => {
    mouseRef.current = {
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * -2,
    };
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        setMousePos(mouseRef.current);
        rafRef.current = null;
      });
    }
  }, []);

  const handleSearch = useCallback((city) => {
    const target = city || inputCity.trim();
    if (target) {
      setManualSearch(true);
      setQuery(target);
      setInputCity(target);
    }
  }, [inputCity]);

  const weatherMain = weatherData?.weather?.[0]?.main?.toLowerCase();
  const coords = weatherData?.coord;
  const w = weatherData;

  const contentStyle = useMemo(() => ({
    transform: `perspective(1200px) rotateX(${mousePos.y * 2}deg) rotateY(${mousePos.x * 2}deg)`,
  }), [mousePos]);

  return (
    <div className="app-3d-container" onMouseMove={handleMouseMove}>
      <WeatherEffect weather={weatherMain} />
      <div className="app-content" style={contentStyle}>
        <button className="toggle-mode" onClick={toggleDarkMode}>
          {isDarkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        <h1 className="weather-heading">Smart Weather</h1>

        <div className="search-box">
          <input
            type="text"
            value={inputCity}
            onChange={e => setInputCity(e.target.value)}
            placeholder={geo.loading ? "Detecting location..." : "Enter city"}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
          />
          <button onClick={() => handleSearch()}>Search</button>
          <button onClick={() => setUnit(unit === "C" ? "F" : "C")}>
            °{unit === "C" ? "F" : "C"}
          </button>
        </div>

        <RecentSearches searches={searches} onSelect={handleSearch} />

        {weatherData ? (
          <>
            <WeatherAlerts weatherData={w} unit={unit} />
            <WeatherCard
              humidity={w.main.humidity}
              temperature={w.main.temp}
              feelsLike={w.main.feels_like}
              city={w.name}
              description={w.weather[0].description}
              windspeed={w.wind.speed}
              windDeg={w.wind.deg}
              pressure={w.main.pressure}
              sunrise={w.sys.sunrise}
              sunset={w.sys.sunset}
              icon={`https://openweathermap.org/img/wn/${w.weather[0].icon}@2x.png`}
              unit={unit}
            />
            {coords && <AirQuality lat={coords.lat} lon={coords.lon} />}
            {hourlyData.length > 0 && <HourlyForecast hourly={hourlyData} unit={unit} />}
            {forecastData.length > 0 && <WeatherForecast forecast={forecastData} unit={unit} />}
          </>
        ) : (
          <p className="loading">
            {isLoading || geo.loading ? "Loading weather data..." : "Search for a city to get started"}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
