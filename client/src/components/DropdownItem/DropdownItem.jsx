import "./DropdownItem.css";

const DropdownItem = ({ value, onSelect, children }) => {
  return (
    <div className="dropdown-item" onClick={() => onSelect(value)}>
      {children}
    </div>
  );
};

export default DropdownItem;
