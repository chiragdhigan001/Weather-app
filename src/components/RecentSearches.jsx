function RecentSearches({ searches, onSelect }) {
  if (!searches || searches.length === 0) return null;

  return (
    <div className="recent-searches">
      {searches.map((s, i) => (
        <button key={i} className="recent-chip" onClick={() => onSelect(s)}>
          {s}
        </button>
      ))}
    </div>
  );
}

export default RecentSearches;
