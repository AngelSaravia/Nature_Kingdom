import React from "react";

const InputFields = ({label, type, name, value, onChange, required}) => {
    return (
        <div className={StyleSheet.inputContainer}>
            <label htmlFor={name}>{label}</label>
            <input
                id={name}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={`Enter ${label.toUpperCase()}`}
                className={styles.inputs}
            />
        </div>
    );
};
export default InputFields;