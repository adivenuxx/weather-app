import { useEffect, useState } from 'react';
import './index.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState(() => {
    return JSON.parse(localStorage.getItem('recent-searches')) || [];
  });
  const [error, setError] = useState('');

  const API_KEY = '21ce936214d8a6acf269648ccce6d284'; // 🔑 Replace with your OpenWeatherMap API key

  const fetchWeather = async () => {
    if (!city) return;

    try {
      setError('');
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );

      if (!res.ok) {
        setError("❌ Please enter a valid city name");
        setWeather(null);
        setForecast(null);
        return;
      }

      const data = await res.json();
      setWeather(data);

      const res2 = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data2 = await res2.json();
      setForecast(data2);

      const updatedHistory = [city, ...history.filter(c => c !== city)].slice(0, 5);
      setHistory(updatedHistory);
      localStorage.setItem('recent-searches', JSON.stringify(updatedHistory));
    } catch (err) {
      setError("❌ Something went wrong");
    }
  };

  const getBackgroundImage = () => {
    if (!weather) return '';
    const main = weather.weather[0].main.toLowerCase();
    const now = weather.dt;
    const sunrise = weather.sys.sunrise;
    const sunset = weather.sys.sunset;
    const isDay = now >= sunrise && now <= sunset;

    if (main.includes("cloud")) return "url('https://github.com/adivenuxx/weather-app/blob/main/Cloudy.jpg?raw=true')";
    if (main.includes("rain")) return "url('Rainy.jpg')";
    if (main.includes("snow")) return "url('Snowy.jpg')";
    if (main.includes("clear") && isDay) return "url('https://github.com/adivenuxx/weather-app/blob/main/Sunny.jpg?raw=true')";
    if (main.includes("clear") && !isDay) return "url('Moon.jpg')";
    return '';
  };

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : '';
  }, [darkMode]);

  return (
    <>
      <div className="app-header">
        <div>🌤️ Weather App</div>
        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <div className="main-box" style={{ backgroundImage: getBackgroundImage() }}>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
          />
          <button onClick={fetchWeather}>Search</button>
        </div>

        {history.length > 0 && (
          <div className="recent-search">
            <h4>Recent Searches:</h4>
            {history.map((item, index) => (
              <button key={index} onClick={() => { setCity(item); fetchWeather(); }}>
                {item}
              </button>
            ))}
          </div>
        )}

        {error && (
          <p style={{
            color: 'red',
            textAlign: 'center',
            marginBottom: '10px',
            fontWeight: 'bold'
          }}>{error}</p>
        )}

        {weather && (
          <div className="weather-content">
            <div className="weather-left">
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather icon"
              />
            </div>
            <div className="weather-right">
              <h2>{weather.name}</h2>
              <p>{weather.weather[0].main}</p>
              <p>🌡️ {weather.main.temp} °C</p>
              <p>💧 {weather.main.humidity}% humidity</p>
              <p>🌬️ {weather.wind.speed} km/h wind</p>
            </div>
          </div>
        )}

        {forecast && (
          <div className="forecast">
            {forecast.list.filter((_, i) => i % 8 === 0).slice(0, 5).map((item, i) => (
              <div key={i} className="forecast-card">
                <p>{new Date(item.dt_txt).toLocaleDateString()}</p>
                <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} alt="icon" />
                <p>{item.main.temp} °C</p>
                <p>{item.weather[0].main}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
