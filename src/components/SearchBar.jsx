import React from 'react';

const SearchBar = ({ value, onChange, onSearch, placeholder = "Search want courses..." }) => {
  return (
    <div className="search-bar-wrapper">
      <div className="search-row">
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button className="search-request-btn" onClick={onSearch}>Search</button>
      </div>
    </div>
  );
};

export default SearchBar;
