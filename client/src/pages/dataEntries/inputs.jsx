import React from "react";
import PropTypes from "prop-types";
import styles from "./forms.module.css";

const InputFields = ({label, type="text", name, value, onChange, required=true, autoComplete}) => {
    return (
        <div className={styles.inputGroup}>
            <label htmlFor={name} className={styles.inputLabel}>{label}</label>
            <input
                id={name}
                type={type}
                name={name}
                value={value || ""}
                onChange={onChange}
                required={required}
                autoComplete={autoComplete}
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
    required: PropTypes.bool,
    autoComplete: PropTypes.string
};

export default InputFields;