import "./weatherforecast.css";

interface ForecastDay {
  date: string;
  temperature: number;
  description: string;
  icon: string;
}

interface WeatherForecastProps {
  forecast: ForecastDay[];
  unit: "C" | "F";
}

function WeatherForecast({ forecast, unit }: WeatherForecastProps) {
  return (
    <div className="forecast-container">
      <h3>5-Day Forecast</h3>
      <div className="forecast-list">
        {forecast.map((day, idx) => (
          <div className="forecast-day" key={idx}>
            <div>{day.date}</div>
            <img src={day.icon} alt={day.description} width={50} />
            <div>
              {day.temperature}°{unit}
            </div>
            <div>{day.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WeatherForecast;
