export default function SearchBar({
  search,
  setSearch,
  filter,
  setFilter,
}) {
  return (
    <div className="search-bar">
      <input
        placeholder="Search employee..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option>All</option>
        <option>Active</option>
        <option>Inactive</option>
      </select>
    </div>
  );
}