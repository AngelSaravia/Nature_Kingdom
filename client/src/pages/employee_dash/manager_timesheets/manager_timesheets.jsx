import { useEffect, useState } from "react";
import "./manager_timesheets.css";
import { getEmployeeTimesheets } from "../../../services/api";

const ManagerTimesheets = () => {
  const [timesheets, setTimesheets] = useState([]);
  const [expandedEmail, setExpandedEmail] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredTimesheets, setFilteredTimesheets] = useState([]);

  const email = localStorage.getItem("email");

  useEffect(() => {
    if (email) {
      fetchTimesheets();
    }
  }, [email]);

  const fetchTimesheets = async () => {
    try {
      const response = await getEmployeeTimesheets(email);
      if (response.success && Array.isArray(response.data)) {
        setTimesheets(response.data);
        console.log("Timesheets fetched successfully:", response.data);
      } else {
        console.warn("Unexpected response format:", response);
        setTimesheets([]);
      }
    } catch (error) {
      console.error("Error fetching timesheets:", error);
      setTimesheets([]);
    }
  };

  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  // Filter timesheets based on the selected start and end dates
  const filterTimesheets = () => {
    const filtered = timesheets.filter((record) => {
      const recordDate = new Date(record.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      return (
        (!start || recordDate >= start) &&
        (!end || recordDate <= end)
      );
    });

    setFilteredTimesheets(filtered);
  };

  // Watch for changes in startDate or endDate
  useEffect(() => {
    filterTimesheets();
  }, [startDate, endDate, timesheets]);

  // Group records by employee email
  const grouped = filteredTimesheets.reduce((acc, curr) => {
    const key = curr.employee_email;
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {});

  // Check if any employee is missing and add them with 0 hours worked
  const addMissingEmployees = (groupedData) => {
    const employeeEmails = Object.keys(groupedData);
    const allEmployeeEmails = []; // This should be the list of employees you manage

    allEmployeeEmails.forEach(email => {
      if (!employeeEmails.includes(email)) {
        groupedData[email] = [{ date: "—", hours: 0, hours_paid: 0 }];
      }
    });

    return groupedData;
  };

  // Function to convert hh:mm:ss to total hours
  const convertToHours = (timeStr) => {
    if (typeof timeStr === "string") {
      const [hours, minutes, seconds] = timeStr.split(":").map(Number);
      return hours + minutes / 60 + seconds / 3600; // Convert everything to hours
    }
    return 0; // If it's not a string, return 0
  };

  // Function to convert decimal hours to hh:mm format
  const convertToTimeFormat = (decimalHours) => {
    const hours = Math.floor(decimalHours); // Get the whole hours
    const minutes = Math.round((decimalHours - hours) * 60); // Get the minutes

    // Format hours and minutes to always be 2 digits
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const toggleExpand = (email) => {
    setExpandedEmail(expandedEmail === email ? null : email);
  };

  // Add missing employees with 0 hours before rendering
  const completeGroupedData = addMissingEmployees(grouped);

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1 className="dashboard-title">Manager Timesheets</h1>

        {/* Date Range Filter Inputs */}
        <div className="date-filter">
          <p className="date-filter-text">Filter by Date Range:</p>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Start Date"
            className="date-input"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="End Date"
            className="date-input"
          />
        </div>

        {Object.entries(completeGroupedData).map(([email, records]) => {
          // Calculate total hours and total paid hours
          const totalHoursDecimal = records.reduce(
            (sum, r) => sum + convertToHours(r.hours), // Use the convertToHours function to properly add hours
            0
          );

          const totalPaid = records.reduce((sum, r) => sum + (r.hours_paid || 0), 0);
          const isExpanded = expandedEmail === email;

          // Convert total hours to hh:mm format
          const totalHoursFormatted = convertToTimeFormat(totalHoursDecimal);

          return (
            <div key={email} className="dashboard-group">
              <div
                className="dashboard-box"
                onClick={() => toggleExpand(email)}
                style={{ cursor: "pointer" }}
              >
                <h2>{email}</h2>
                <p>Total Hours Worked: {totalHoursFormatted}</p> {/* Show total hours in hh:mm format */}
                <p>Total Hours Paid: {totalPaid}</p>
              </div>

              {isExpanded && (
                <div className="dashboard-box">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Hours Worked</th>
                        <th>Hours Paid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((r, index) => {
                        const formattedDate = r.date
                          ? new Date(r.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })
                          : "—";
              
                        return (
                          <tr key={index}>
                            <td>{formattedDate}</td>
                            <td>{r.clock_in ? new Date(r.clock_in).toLocaleTimeString() : "—"}</td>
                            <td>{r.clock_out ? new Date(r.clock_out).toLocaleTimeString() : "—"}</td>
                            <td>{r.hours ?? "—"}</td>
                            <td>{r.hours_paid ?? "—"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ManagerTimesheets;
