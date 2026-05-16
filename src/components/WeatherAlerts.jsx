function WeatherAlerts({ weatherData, unit }) {
  if (!weatherData) return null;

  const main = weatherData.weather?.[0]?.main?.toLowerCase();
  const temp = weatherData.main?.temp;
  const wind = weatherData.wind?.speed;
  const vis = weatherData.visibility;
  const rain1h = weatherData.rain?.["1h"];

  const alerts = [];

  if (main === "thunderstorm") {
    alerts.push({ severity: "high", message: "⚠️ Thunderstorm Warning — Seek shelter immediately" });
  }
  if (unit === "C" ? temp > 38 : temp > 100) {
    alerts.push({ severity: "high", message: `🌡️ Extreme Heat — ${Math.round(temp)}°${unit}, stay hydrated and avoid sun` });
  }
  if (unit === "C" ? temp < -8 : temp < 18) {
    alerts.push({ severity: "moderate", message: `❄️ Cold Advisory — ${Math.round(temp)}°${unit}, dress warmly` });
  }
  if (wind > (unit === "C" ? 18 : 40)) {
    const wUnit = unit === "C" ? "m/s" : "mph";
    alerts.push({ severity: "moderate", message: `💨 Strong Winds — ${Math.round(wind)} ${wUnit}, secure outdoor items` });
  }
  if (vis < 1000) {
    alerts.push({ severity: "moderate", message: "🌫️ Low Visibility — Drive carefully, use fog lights" });
  }
  if (main === "rain" && rain1h != null && rain1h > 8) {
    alerts.push({ severity: "moderate", message: "🌧️ Heavy Rain — Flood risk possible, avoid low-lying areas" });
  }

  if (alerts.length === 0) return null;

  return (
    <div className="weather-alerts">
      {alerts.map((a, i) => (
        <div key={i} className={`alert alert-${a.severity}`}>{a.message}</div>
      ))}
    </div>
  );
}

export default WeatherAlerts;
