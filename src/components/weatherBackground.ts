export function getWeatherBackground(condition: string): string {
  switch (condition.toLowerCase()) {
    case "clear":
      return "bg-clear";
    case "clouds":
      return "bg-clouds";
    case "rain":
    case "drizzle":
      return "bg-rain";
    case "snow":
      return "bg-snow";
    case "mist":
    case "fog":
      return "bg-mist";
    case "thunderstorm":
      return "bg-thunder";
    default:
      return "bg-default";
  }
}
