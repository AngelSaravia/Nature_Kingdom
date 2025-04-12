import React, { useEffect, useState, useRef } from "react";
import DropdownButton from "../DropdownButton/DropdownButton";
import DropdownContent from "../DropdownContent/DropdownContent";
import "./Dropdown.css";

const Dropdown = ({ label, onSelect, children, selectedLabel, reset }) => {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(selectedLabel || label);

  const dropdownRef = useRef();
  const buttonRef = useRef();
  const contentRef = useRef();

  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  const handleSelect = (value) => {
    setSelectedValue(value);
    onSelect(value);
    setOpen(false);
  };

  useEffect(() => {
    // Update selectedValue when selectedLabel prop changes
    if (selectedLabel !== undefined) {
      setSelectedValue(selectedLabel);
    } 
  }, [selectedLabel]);

  useEffect (() => {
    console.log("Dropdown reset prop:", reset); // Debugging
    if (reset) {
      console.log("Resetting dropdown to default label:", label);
      setSelectedValue(label);
    }
  }, [reset, label]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`dropdown ${open ? 'open' : ''}`}>
      <DropdownButton ref={buttonRef} toggle={toggleDropdown} open={open}>
        {selectedValue}
      </DropdownButton>
      <DropdownContent ref={contentRef} open={open}>
        {React.Children.map(children, (child) =>
          React.cloneElement(child, { onSelect: handleSelect })
        )}
      </DropdownContent>
    </div>
  );
};

export default Dropdown;
