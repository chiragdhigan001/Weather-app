import "./weather.css";


interface WeatherCardProps {
  humidity: number;
  temperature: number;
  city: string;
  description: string;
  icon: string;
  unit: string;
  windspeed: number;
}

function WeatherCard(props: WeatherCardProps) {
  const {
    humidity,
    temperature,
    city,
    description,
    icon,
    unit,
    windspeed,
  } = props;

  // Ensure the icon is a full URL (already handled in App.tsx)
  const iconSrc = icon && icon.trim() !== ""
    ? icon
    : "https://openweathermap.org/img/wn/01d@2x.png";

  return (
    <>
      
      <div className="weather-card">
        <h2>{city}</h2>
        <img src={iconSrc} alt={description} className="weather-icon" />
        <p>{description}</p>
        <p>Temperature: {temperature}°{unit}</p>
        <p>Humidity: {humidity}%</p>
        <p>Wind Speed: {windspeed} km/h</p>
      </div>
    </>
  );
}

export default WeatherCard;
