import React from "react";
import PropTypes from "prop-types";
import styles from "./employee_form.module.css";

const SelectGroup = ({label, options, selectedOption, onChange}) => {
    const handleSelect = (option) => {
        if (selectedOption === option) {
            onChange("");
        }
        else onChange(option);
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
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
    selectedOption: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};
export default SelectGroup;