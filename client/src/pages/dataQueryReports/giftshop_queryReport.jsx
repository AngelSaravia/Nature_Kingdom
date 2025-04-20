import React, { useState, useEffect } from "react";
import FilterSidebar from "./filterSidebar";
import ReportTable from "./reportTable";
import "./reportStyles.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const filterOptions = [
    { label: "CATEGORIES", type: "checkbox", name: "categories", options: ["plush", "clothing", "books", "souvenirs"] },
];

const columnHeaders = {
    product_id: "Product ID",
    name: "Name",
    category: "Category",
    purchase_history: "Purchase History"
};

const PurchaseHistoryCell = ({ history }) => {
    if (!history || history.length === 0) {
        return <span>No purchases</span>;
    }

    return (
        <div className="purchase-history">
            {history.map((purchase, index) => (
                <div key={index} className="purchase-record">
                    <div>Date: {new Date(purchase.order_date).toLocaleDateString()}</div>
                    <div>Qty: {purchase.quantity}</div>
                    <div>Total: ${purchase.total_amount.toFixed(2)}</div>
                </div>
            ))}
        </div>
    );
};


const TotalProductsBox = ({ count }) => {
    return (
      <div className="total-items-box">
        <h3>Total Products</h3>
        <div className="total-count">{count}</div>
        <div className="filter-info">
          {count === 0 ? "No products found" : "Showing filtered results"}
        </div>
      </div>
    );
};

const GiftshopQueryReport = () => {
    const [filters, setFilters] = useState({
        categories: [],
    });
    const [reportData, setReportData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    
    useEffect(() => {
        fetchReport(false);
    }, []);

    const fetchReport = async (applyFilters = true) => {
        try {
            // Build query parameters
            const params = new URLSearchParams();
            
            if (applyFilters && filters.categories?.length) {
                params.append('category', filters.categories.join(','));
            }
    
            const response = await fetch(`${API_BASE_URL}/api/giftshop?${params.toString()}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            
            // Ensure we're handling the response correctly regardless of format
            if (!data.success) {
                throw new Error(data.message || "Failed to fetch products");
            }
            
            // Handle response formats
            const products = data.products || [];
    
            setReportData(products);
            setTotalItems(products.length);
    
        } catch (error) {
            console.error("Error fetching report:", error);
            setReportData([]);
            setTotalItems(0);
        }
    };

    const customCellRenderers = {
        purchase_history: (value) => <PurchaseHistoryCell history={value} />
    };

    const formatFiltersForBackend = (filters) => {
        const formattedFilters = {};
        
        if (filters.categories && filters.categories.length > 0) {
            formattedFilters.categories = filters.categories;
        }

        return formattedFilters;
    };

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

    const onClearAll = () => {
        setFilters({
            categories: [],
        });
        fetchReport(false);
    };

    return (
        <div className="revenue-query-report">
            <div className="report-table-wrapper">
                <div className="filter-sidebar-container">
                    <div className="report-header">
                        <h1>Gift Shop Report</h1>
                        <TotalProductsBox count={totalItems} />
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
                    customCellRenderers={customCellRenderers}
                />
            </div>
        </div>
    );
};

export default GiftshopQueryReport;