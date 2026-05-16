import "./hourlyforecast.css";

function HourlyForecast({ hourly, unit }) {
  if (!hourly || hourly.length === 0) return null;

  return (
    <div className="hourly-container">
      <h3>Hourly Forecast</h3>
      <div className="hourly-list">
        {hourly.map((h, i) => (
          <div className="hourly-item" key={i}>
            <div className="hourly-time">{h.time}</div>
            <img
              src={`https://openweathermap.org/img/wn/${h.icon}.png`}
              alt={h.description}
            />
            <div className="hourly-temp">{Math.round(h.temp)}°{unit}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HourlyForecast;
