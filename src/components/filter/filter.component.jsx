import React from "react";

// Filter component that renders with table headers
const Filter = ({ setFilter }) => {
  return (
    <div className="filter">
      <input
        type="search"
        placeholder="Filter"
        onChange={(e) => {
          let newFilter = {
            filterValue: e.target.value,
            key: e.target.offsetParent.innerText,
          };
          setFilter(newFilter);
        }}
      />
    </div>
  );
};

export default Filter;
