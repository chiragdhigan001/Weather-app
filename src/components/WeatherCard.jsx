import { memo } from "react";
import "./weather.css";

function degToCompass(deg) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(((deg % 360) + 360) % 360 / 45) % 8];
}

function formatTime(timestamp) {
  return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit",
  });
}

function WeatherCard({
  humidity, temperature, feelsLike, city, description, icon, unit, windspeed,
  windDeg, pressure, sunrise, sunset,
}) {
  const iconSrc = icon && icon.trim() !== ""
    ? icon
    : "https://openweathermap.org/img/wn/01d@2x.png";

  const windUnit = unit === "C" ? "m/s" : "mph";

  return (
    <div className="weather-card">
      <h2>{city}</h2>
      <img src={iconSrc} alt={description} className="weather-icon" />
      <p className="description">{description}</p>
      <p className="temperature">{Math.round(temperature)}°{unit}</p>
      {feelsLike != null && (
        <p className="feels-like">Feels like {Math.round(feelsLike)}°{unit}</p>
      )}
      <div className="weather-stats">
        <div className="weather-stat">
          <div className="label">Humidity</div>
          <div className="value">{humidity}%</div>
        </div>
        <div className="weather-stat">
          <div className="label">
            Wind
            {windDeg != null && (
              <span className="wind-arrow" style={{ transform: `rotate(${windDeg}deg)` }}>↑</span>
            )}
          </div>
          <div className="value">
            {Math.round(windspeed)} {windUnit}
            {windDeg != null && <span className="wind-dir">{degToCompass(windDeg)}</span>}
          </div>
        </div>
        {pressure != null && (
          <div className="weather-stat">
            <div className="label">Pressure</div>
            <div className="value">{pressure} hPa</div>
          </div>
        )}
        {sunrise != null && sunset != null && (
          <div className="weather-stat">
            <div className="label">Sunrise / Sunset</div>
            <div className="value sun-times">
              <span>↑{formatTime(sunrise)}</span>
              <span className="sun-divider">|</span>
              <span>↓{formatTime(sunset)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(WeatherCard);
