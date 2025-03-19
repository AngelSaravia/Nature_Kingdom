import React from "react";
import PropTypes from "prop-types";
import styles from "./employee_form.module.css";

const InputFields = ({label, type="text", name, value, onChange, required=true}) => {
    return (
        <div className={styles.inputGroup}>
            <label htmlFor={name} className={styles.inputLabel}>{label}</label>
            <input
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                required={required}
                placeholder={`Enter ${label.toLowerCase()}`}
                className={styles.inputField}
            />
        </div>
    );
};

InputFields.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
    required: PropTypes.bool
};

export default InputFields;