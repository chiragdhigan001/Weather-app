const API_KEY = "b4403dba7fd6d28f44071fc9094fc671";
const BASE = "https://api.openweathermap.org/data/2.5";

function buildParams(query, units) {
  const params = typeof query === "object"
    ? `lat=${query.lat}&lon=${query.lon}`
    : `q=${query}`;
  return `${params}&appid=${API_KEY}&units=${units}`;
}

export async function fetchCurrentWeather(query, units) {
  const res = await fetch(`${BASE}/weather?${buildParams(query, units)}`);
  if (!res.ok) throw new Error("City not found");
  return res.json();
}

export async function fetchForecast(query, units) {
  const res = await fetch(`${BASE}/forecast?${buildParams(query, units)}`);
  if (!res.ok) throw new Error("Forecast not found");
  return res.json();
}

export async function fetchAirQuality(lat, lon) {
  const res = await fetch(`${BASE}/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
  if (!res.ok) throw new Error("Air quality data not found");
  return res.json();
}
