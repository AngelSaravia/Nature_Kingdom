import { forwardRef } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./DropdownButton.css";

const DropdownButton = forwardRef(({children, toggle, open}, ref) => {
  return (
    <button
      onClick={toggle}
      className={`dropdown-btn ${open ? "button-open" : ""}`}
      ref={ref}
    >
      {children}
      <span className="toggle-icon">
        {open ? <FaChevronUp /> : <FaChevronDown />}
      </span>
    </button>
  );
});

export default DropdownButton;