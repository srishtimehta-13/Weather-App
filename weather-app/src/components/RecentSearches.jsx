function RecentSearches({ recent, onSearch }) {

  if (!recent.length) return null;

  return (
    <div className="recent">

      <p className="recent-title">Recent Searches</p>

      <div className="recent-list">
        {recent.map((city, index) => (
          <button
            key={index}
            className="recent-chip"
            onClick={() => onSearch(city)}
          >
            {city}
          </button>
        ))}
      </div>

    </div>
  );
}

export default RecentSearches;