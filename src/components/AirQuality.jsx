import { useEffect, useState } from "react";
import { fetchAirQuality } from "../api/weather";

const AQI_LABELS = ["", "Good", "Fair", "Moderate", "Poor", "Very Poor"];
const AQI_COLORS = ["", "#4caf50", "#ffeb3b", "#ff9800", "#f44336", "#9c27b0"];
const AQI_TEXT = ["", "#fff", "#333", "#fff", "#fff", "#fff"];

function AirQuality({ lat, lon }) {
  const [aqi, setAqi] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lat == null || lon == null) return;
    setLoading(true);
    fetchAirQuality(lat, lon)
      .then(data => setAqi(data.list[0]))
      .catch(() => setAqi(null))
      .finally(() => setLoading(false));
  }, [lat, lon]);

  if (loading) return <div className="air-quality loading-sm">Loading AQI...</div>;
  if (!aqi) return null;

  const level = aqi.main.aqi;
  const comp = aqi.components;

  return (
    <div className="air-quality">
      <div className="aqi-indicator" style={{ background: AQI_COLORS[level] }}>
        <span className="aqi-value" style={{ color: AQI_TEXT[level] }}>{level}</span>
      </div>
      <div className="aqi-info">
        <div className="aqi-label">Air Quality Index</div>
        <div className="aqi-status" style={{ color: AQI_COLORS[level] }}>{AQI_LABELS[level]}</div>
        <div className="aqi-components">
          <span className="aqi-component">PM2.5 <strong>{comp.pm2_5?.toFixed(1)}</strong></span>
          <span className="aqi-component">PM10 <strong>{comp.pm10?.toFixed(1)}</strong></span>
          <span className="aqi-component">O₃ <strong>{comp.o3?.toFixed(1)}</strong></span>
        </div>
      </div>
    </div>
  );
}

export default AirQuality;
