import React from "react";
import PropTypes from "prop-types";
import styles from "./selectGroup.module.css";

const SelectGroup = ({label, options, selectedOption, onChange}) => {
    return(
        <div className={styles.selectgroup}>
            <label className={styles.label}>{label}</label>
            <div className={styles.optionsContainer}>
                {options.map((option) => (
                    <button
                        key={option}
                        type="button"
                        className={`${styles.optionButton} ${selectedOption === option ? styles.selected : ""}`}
                        onClick={() => onChange(option)}
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