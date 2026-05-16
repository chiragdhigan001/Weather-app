import { memo } from "react";
import "./weatherforecast.css";

function WeatherForecast({ forecast, unit }) {
  let globalMin = Infinity, globalMax = -Infinity;
  for (let i = 0; i < forecast.length; i++) {
    const d = forecast[i];
    if (d.tempMin < globalMin) globalMin = d.tempMin;
    if (d.tempMax > globalMax) globalMax = d.tempMax;
  }
  const range = globalMax - globalMin || 1;

  return (
    <div className="forecast-container">
      <h3>5-Day Forecast</h3>
      <div className="forecast-list">
        {forecast.map((day, idx) => {
          const barLeft = ((day.tempMin - globalMin) / range) * 100;
          const barWidth = ((day.tempMax - day.tempMin) / range) * 100;

          return (
            <div className="forecast-day" key={idx}>
              <div className="day-name">{day.date}</div>
              <img src={day.icon} alt={day.description} />
              <div className="temp-current">{Math.round(day.temperature)}°{unit}</div>
              <div className="temp-range">
                <div className="temp-bar-bg">
                  <div
                    className="temp-bar-fill"
                    style={{
                      left: `${barLeft}%`,
                      width: `${Math.max(barWidth, 8)}%`,
                    }}
                  />
                </div>
                <div className="temp-labels">
                  <span>{Math.round(day.tempMin)}°</span>
                  <span>{Math.round(day.tempMax)}°</span>
                </div>
              </div>
              <div className="desc">{day.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(WeatherForecast);
