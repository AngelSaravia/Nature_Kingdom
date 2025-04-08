import React from "react";
import "./reportStyles.css";

const FilterSidebar = ({ filters, onFilterChange, onRunReport, onClearAll, filterOptions }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onFilterChange({ target: { name, value } });
  };
      

  const handleCheckboxChange = (event) => {
    const { name, value, checked } = event.target;
    if (name === "temp_control") {
      onFilterChange({ target: { name, value: checked ? "1" : "0" } });
    } else {
      onFilterChange(event);
    }
  };

  return (
    <div className="filter-sidebar">
      <h3>Filters</h3>

      {filterOptions.map(({ label, type, name, options }) => (
        <div key={name}>
          <h4>{label}</h4>
          {type === "text" && <input type="text" name={name} value={filters[name] || ""} onChange={handleChange} />}
          {type === "date" && <input type="date" name={name} value={filters[name] || ""} onChange={handleChange} />}
          {type === "datetime-local" && <input type="datetime-local" name={name} value={filters[name] || ""} onChange={handleChange} />}
          {type === "time" && <input type="time" name={name} value={filters[name] || ""} onChange={handleChange} />}
          {type === "number" && name !== "price" && name !== "duration" && 
            <input type="number" name={name} value={filters[name] || ""} onChange={handleChange} />}
          {type === "checkbox" &&
            options.map((option) => (
              <label key={option}>
                <input
                  type="checkbox"
                  name={name}
                  value={option}
                  checked={filters[name]?.includes(option) || false}
                  onChange={handleCheckboxChange}
                />
                {option}
              </label>
            ))}

          {type === "radio" &&
            options.map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  name={name}
                  value={option === "Yes" ? "1" : "0"}
                  checked={filters[name] === (option === "Yes" ? "1" : "0")}
                  onChange={handleChange}
                />
                {option}
              </label>
            ))}

          {name === "price" && (
            <>
              <label>Min Price:</label>
              <input type="number" name="priceMin" value={filters.priceMin || ""} onChange={handleChange} />
              <label>Max Price:</label>
              <input type="number" name="priceMax" value={filters.priceMax || ""} onChange={handleChange} />
            </>
          )}

          {name === "duration" && (
            <>
              <label>Min Duration (HH:MM):</label>
              <input type="time" name="durationMin" value={filters.durationMin || ""} onChange={handleChange} />
              <label>Max Duration (HH:MM):</label>
              <input type="time" name="durationMax" value={filters.durationMax || ""} onChange={handleChange} />
            </>
          )}

        </div>
      ))}

      <button onClick={onRunReport}>Run Report</button>
      <button onClick={onClearAll}>Clear All</button>
    </div>
  );
};

export default FilterSidebar;