import React, { useState, useEffect } from "react";
import FilterSidebar from "./filterSidebar";
import ReportTable from "./reportTable";
import "./reportStyles.css";
// import "./revenue_queryReport.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const filterOptions = [
  {
    label: "PRODUCT TYPES",
    type: "checkbox",
    name: "product_types",
    options: ["ticket", "membership", "Giftshop Items"],
  },
  { label: "START DATE", type: "date", name: "start_date" },
  { label: "END DATE", type: "date", name: "end_date" },
];

const columnHeaders = {
  tuple_id: "Product ID",
  visitor_id: "Visitor ID",
  type_of_product: "Type of Product",
  price: "Price",
  purchase_date: "Purchase Date",
};

const TotalSalesBox = ({ total, totals }) => {
  return (
    <div className="total-sales-box">
      <h3>Total Profit</h3>
      <div className="total-amount">${total.toFixed(2)}</div>
      {total > 0 && (
        <div className="breakdown">
          <p>
            Tickets: <span>${totals.totalTicketEarnings.toFixed(2)}</span>
          </p>
          <p>
            Giftshop Items:{" "}
            <span>${totals.totalGiftshop_itemEarnings.toFixed(2)}</span>
          </p>
          <p>
            Memberships:{" "}
            <span>${totals.totalMembershipEarnings.toFixed(2)}</span>
          </p>
        </div>
      )}
      <div className="filter-info">
        {total === 0 ? "No data available" : "Showing filtered results"}
      </div>
    </div>
  );
};

const TotalItemsBox = ({ count, totals }) => {
  return (
    <div className="total-items-box">
      <h3>Total Products Sold</h3>
      <div className="total-count">{count}</div>
      {count > 0 && (
        <div className="breakdown">
          <p>
            Tickets: <span>{totals.totalTickets}</span>
          </p>
          <p>
            Giftshop Items: <span>{totals.totalGiftshop_items}</span>
          </p>
          <p>
            Memberships: <span>{totals.totalMemberships}</span>
          </p>
        </div>
      )}
      <div className="filter-info">
        {count === 0 ? "No items found" : "Showing filtered results"}
      </div>
    </div>
  );
};

const RevenueQueryReport = () => {
  const [filters, setFilters] = useState({
    product_types: [],
    start_date: null,
    end_date: null,
  });
  const [reportData, setReportData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const calculateTotalSales = (data) => {
    return data.reduce((sum, item) => sum + parseFloat(item.price), 0);
  };
  const [totals, setTotals] = useState({
    totalTickets: 0,
    totalTicketEarnings: 0,
    totalGiftshop_items: 0,
    totalGiftshop_itemEarnings: 0,
    totalMemberships: 0,
    totalMembershipEarnings: 0,
  });

  useEffect(() => {
    fetchReport(false);
  }, []);

  const handleFilterChange = (eventOrUpdater) => {
    if (typeof eventOrUpdater === "function") {
      setFilters((prevFilters) => eventOrUpdater(prevFilters));
    } else {
      const { name, value, type, checked } = eventOrUpdater.target;

      setFilters((prevFilters) => {
        if (type === "checkbox") {
          const updatedValues = prevFilters[name] ? [...prevFilters[name]] : [];
          if (checked) {
            if (!updatedValues.includes(value)) updatedValues.push(value);
          } else {
            const index = updatedValues.indexOf(value);
            if (index > -1) updatedValues.splice(index, 1);
          }
          return { ...prevFilters, [name]: updatedValues };
        }
        return { ...prevFilters, [name]: value };
      });
    }
  };

  const formatFiltersForBackend = (filters) => {
    const formattedFilters = {};

    if (filters.product_types && filters.product_types.length > 0) {
      formattedFilters["product type"] = filters.product_types;
    }

    if (filters.start_date) {
      formattedFilters["revenue.start_date"] = new Date(filters.start_date)
        .toISOString()
        .split("T")[0];
    }

    if (filters.end_date) {
      formattedFilters["revenue.end_date"] = new Date(filters.end_date)
        .toISOString()
        .split("T")[0];
    }

    return formattedFilters;
  };

  const fetchReport = async (applyFilters = true) => {
    try {
      const filtersToSend = applyFilters
        ? formatFiltersForBackend(filters)
        : {};

      console.log("Filters being sent to the backend:", filtersToSend); // Debugging line
      const response = await fetch(`${API_BASE_URL}/query_report/revenue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entity_type: "revenue",
          filters: filtersToSend,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setReportData(data.data);
        setTotalSales(calculateTotalSales(data.data));
        setTotalItems(data.data.length);
        calculateTotals(data.data);
      } else {
        console.error("Error fetching report:", data.message);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    }
  };

  const calculateTotals = (data) => {
    const totals = {
      totalTickets: 0,
      totalTicketEarnings: 0,
      totalGiftshop_items: 0,
      totalGiftshop_itemEarnings: 0,
      totalMemberships: 0,
      totalMembershipEarnings: 0,
    };

    data.forEach((item) => {
      if (item.type_of_product === "ticket") {
        totals.totalTickets += 1;
        totals.totalTicketEarnings += parseFloat(item.price);
      } else if (item.type_of_product === "giftshop_item") {
        totals.totalGiftshop_items += 1;
        totals.totalGiftshop_itemEarnings += parseFloat(item.price);
      } else if (item.type_of_product === "membership") {
        totals.totalMemberships += 1;
        totals.totalMembershipEarnings += parseFloat(item.price);
      }
    });

    setTotals(totals);
  };

  const onClearAll = () => {
    setFilters({
      product_types: [],
      start_date: null,
      end_date: null,
    });
    fetchReport(false);
  };

  return (
    <div className="revenue-query-report">
      <div className="report-table-wrapper">
        <div className="filter-sidebar-container">
          <div className="report-header">
            <h1>Revenue Report</h1>
            <TotalItemsBox count={totalItems} totals={totals} />
            <TotalSalesBox total={totalSales} totals={totals} />
          </div>
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onRunReport={() => fetchReport(true)}
            onClearAll={onClearAll}
            filterOptions={filterOptions}
          />
        </div>

        <ReportTable
          data={reportData}
          columns={Object.keys(columnHeaders)}
          columnLabels={columnHeaders}
        />
      </div>
    </div>
  );
};

export default RevenueQueryReport;
