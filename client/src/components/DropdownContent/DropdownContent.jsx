import { forwardRef } from "react";
import "./DropdownContent.css";

const DropdownContent = forwardRef(({children, open, top}, ref) => {
  return (
    <div
      className={`dropdown-content ${open ? "content-open" : ""}`}
      style={{top}}
      ref={ref}
    >
      {children}
    </div>
  );
});

export default DropdownContent;