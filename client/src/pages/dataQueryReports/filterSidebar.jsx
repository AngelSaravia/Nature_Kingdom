import React from "react";
import "./reportStyles.css";

const FilterSidebar = ({ filters, onFilterChange, onRunReport, filterOptions }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleCheckboxChange = (name, value) => {
    const updatedFilters = { ...filters };
    if (updatedFilters[name]?.includes(value)) {
      updatedFilters[name] = updatedFilters[name].filter((v) => v !== value);
    } else {
      updatedFilters[name] = [...(updatedFilters[name] || []), value];
    }
    onFilterChange(updatedFilters);
  };

  return (
    <div className="filter-sidebar">
      <h3>Filters</h3>

      {filterOptions.map(({ label, type, name, options }) => (
        <div key={name}>
          <h4>{label}</h4>
          {type === "text" && <input type="text" name={name} value={filters[name] || ""} onChange={handleChange} />}
          {type === "date" && <input type="date" name={name} value={filters[name] || ""} onChange={handleChange} />}
          {type === "number" && <input type="number" name={name} value={filters[name] || ""} onChange={handleChange} />}
          {type === "checkbox" &&
            options.map((option) => (
              <label key={option}>
                <input
                  type="checkbox"
                  checked={filters[name]?.includes(option) || false}
                  onChange={() => handleCheckboxChange(name, option)}
                />
                {option}
              </label>
            ))}
        </div>
      ))}

      <button onClick={() => onFilterChange({})}>Clear All</button>
      <button onClick={onRunReport}>Run Report</button>
    </div>
  );
};

export default FilterSidebar;
