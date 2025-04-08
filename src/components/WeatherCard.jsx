export default function WeatherCard({ data }) {
    return (
      <div className="weather-info">
        <h2>{data.name}</h2>
        <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} alt="icon" />
        <p>{data.weather[0].main}</p>
        <p>🌡️ {data.main.temp} °C</p>
        <p>💧 Humidity: {data.main.humidity}%</p>
        <p>🌬️ Wind: {data.wind.speed} km/h</p>
      </div>
    );
  }
  