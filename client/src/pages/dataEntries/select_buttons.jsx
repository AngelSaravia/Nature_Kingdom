import React from "react";
import PropTypes from "prop-types";
import styles from "./employee_form.module.css";

const SelectGroup = ({name, label, options, selectedOption, onChange}) => {
    const handleSelect = (option) => {
        onChange(name, selectedOption === option ? "" : option);
    };
    
    return(
        <div className={styles.selectgroup}>
            <label className={styles.label}>{label}</label>
            <div className={styles.optionsContainer}>
                {options.map((option) => (
                    <button
                        key={option}
                        type="button"
                        className={`${styles.optionButton} ${selectedOption === option ? styles.selected : ""}`}
                        onClick={() => handleSelect(option)}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};

SelectGroup.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedOption: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};
export default SelectGroup;