import { useEffect, useState } from "react";
import WeatherCard from "./components/WeatherCard";
import WeatherForecast from "./components/WeatherForecast";
import { getWeatherBackground } from "./components/weatherBackground";
import "./App.css";

const API_KEY = "b4403dba7fd6d28f44071fc9094fc671";

interface ForecastDay {
  date: string;
  temperature: number;
  description: string;
  icon: string;
}

function App() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<ForecastDay[]>([]);
  const [city, setCity] = useState("London");
  const [inputCity, setInputCity] = useState("London");
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    const units = unit === "C" ? "metric" : "imperial";

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${units}`
    )
      .then((res) => res.json())
      .then((data) => setWeatherData(data))
      .catch((err) => console.error("Error fetching weather:", err));

    fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=${units}`
    )
      .then((res) => res.json())
      .then((data) => {
        const daily = extractForecastDays(data.list);
        setForecastData(daily);
      })
      .catch((err) => console.error("Error fetching forecast:", err));
  }, [city, unit]);



  function extractForecastDays(list: any[]): ForecastDay[] {
    const map: { [date: string]: ForecastDay } = {};

    list.forEach((item) => {
      const [date, time] = item.dt_txt.split(" ");
      if (time === "12:00:00" && !map[date]) {
        map[date] = {
          date: new Date(item.dt_txt).toLocaleDateString("en-US", {
            weekday: "short",
          }),
          temperature: item.main.temp,
          description: item.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
        };
      }
    });

    return Object.values(map).slice(0, 5);
  }

useEffect(() => {
  if (!weatherData || !weatherData.weather) return;

  const weatherClass = getWeatherBackground(weatherData.weather[0].main);

  if (weatherClass=="bg-rain") {
    document.body.style.background = `url("https://i.imgur.com/kqbIVGC.gif")`;
  }
  else if (weatherClass=="bg-clouds") {
    document.body.style.background = `url("https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbGZvdDFqMDRiMWgxcTJjZWg5d244djJoeng1OHczdHliOGlqOGlsYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/KwZoSJlvep6Vy/giphy.gif")`;
  }
  else if (weatherClass=="bg-clear") {
    document.body.style.background = `url("https://24.media.tumblr.com/88f9ca54815ef1e8a4ccd67a062e52a6/tumblr_mstqhzIrfc1s75c57o1_500.gif")`;
  }
  else if (weatherClass=="bg-snow") {
    document.body.style.background = `url("https://media1.tenor.com/m/Lx6ipmgUZwUAAAAC/cold-winter.gif")`;
  }
  else if (weatherClass=="bg-default") {
    document.body.style.background = `url("https://24.media.tumblr.com/88f9ca54815ef1e8a4ccd67a062e52a6/tumblr_mstqhzIrfc1s75c57o1_500.gif")`;
  }
  else if (weatherClass=="bg-mist") {
    document.body.style.background = `url("https://fyfluiddynamics.com/wp-content/uploads/2020/11/mist_water1.gif")`;
  }
  else if (weatherClass=="bg-thunder") {
    document.body.style.background = `url("https://i.pinimg.com/originals/d1/f3/f5/d1f3f5f8d43f61d5cac86c8a7d3ad581.gif")`;
  }


  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundAttachment = "fixed";
  document.body.classList.remove("dark", "light");
  document.body.classList.add(isDarkMode ? "dark" : "light");
}, [weatherData, isDarkMode]);

return (
  <div className="App">
    {/*  Dark/Light Mode Toggle */}
    <button className="toggle-mode" onClick={toggleDarkMode}>
      {isDarkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
    </button>

      {/*  Header */}
      <h1 className="weather-heading">🌤️ Smart Weather</h1>

      {/*  Search Box */}
      <div className="search-box">
        <input
          type="text"
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
          placeholder="Enter city"
        />
        <button onClick={() => setCity(inputCity)}>🔍 Search</button>
        <button onClick={() => setUnit(unit === "C" ? "F" : "C")}>
          °{unit === "C" ? "F" : "C"}
        </button>
      </div>

      {/* Current Weather */}
      {weatherData ? (
        <WeatherCard
          humidity={weatherData.main.humidity}
          temperature={weatherData.main.temp}
          city={weatherData.name}
          description={weatherData.weather[0].description}
          windspeed={weatherData.wind.speed}
          icon={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
          unit={unit}
        />
      ) : (
        <p>Loading weather...</p>
      )}

      {/*  5-Day Forecast */}
      {forecastData.length > 0 && (
        <WeatherForecast forecast={forecastData} unit={unit} />
      )}
    </div>
  );
}

export default App;
