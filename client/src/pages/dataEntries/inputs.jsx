import React from "react";
import styles from "./employee_form.module.css";

const InputFields = ({label, type="text", name, value, onChange, required}) => {
    const handleInputChange = (event) => {
        onChange(event.target.values);
    };
    
    return (
        <div className={styles.inputGroup}>
            <label htmlFor={name} className={styles.inputLabel}>{label}</label>
            <input
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={handleInputChange}
                required={required}
                placeholder={`Enter ${label.toLowerCase()}`}
                className={styles.inputField}
            />
        </div>
    );
};
export default InputFields;