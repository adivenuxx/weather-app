export default function SearchBar({ city, setCity, onSearch, onRefresh }) {
    return (
      <div>
        <input
          type="text"
          placeholder="Enter city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        />
        <button onClick={onSearch}>Search</button>
        <button onClick={onRefresh}>Refresh</button>
      </div>
    );
  }
  