import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import LineChart from './LineChart.jsx';
import { getGiftshopSummary, getProducts } from '../../services/api';
import './giftshopReport.css';

const GiftshopReport = () => {
    const [summaryData, setSummaryData] = useState(null);
    const [orderReportData, setOrderReportData] = useState([]);
    const [orderItemsReportData, setOrderItemsReportData] = useState([]);
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        products: [],
        minTotal: '',
        maxTotal: ''
    });

    const [productsOptions, setProductsOptions] = useState([]);
    const [isOrderReport, setIsOrderReport] = useState(true);

    useEffect(() => {
        const fetchFilteredSummary = async () => {
            try {
                const data = await getGiftshopSummary(filters);
                const prod = await getProducts("", "");
                console.log("Giftshop Summary Data:", data);
                // console.log("Products:", prod);
                if (!data.success) throw new Error("API returned failure");

                const flatOrders = data.ordersTable?.flat() || [];
                const flatItems = data.orderItemsTable?.flat() || [];

                const orderReport = flatOrders
                    .filter(order => order.order_id && order.total_amount)
                    .map(order => ({
                        orderId: order.order_id,
                        totalAmount: order.total_amount,
                        totalItems: order.total_items,
                        date: new Date(order.order_date).toLocaleDateString(),
                        customer: order.visitor_id
                    }));

                const orderItemsReport = flatOrders
                    .map(order => {
                        const itemsForOrder = flatItems.filter(item => item.order_id === order.order_id);
                        if (itemsForOrder.length === 0) return null;
                        return itemsForOrder.map(item => ({
                            orderId: order.order_id,
                            product: item.product_name,
                            quantity: item.quantity,
                            totalPrice: item.total_amount,
                            date: new Date(order.order_date).toLocaleDateString(),
                            customer: order.visitor_id,
                            totalAmount: order.total_amount,
                            totalItems: order.total_items
                        }));
                    })
                    .flat()
                    .filter(record => record !== null);

                const validOrderItemsReport = orderItemsReport.filter(item => item != null && item.product);
                const validOrderReport = orderReport.filter(order => order.orderId && order.totalAmount);

                setOrderReportData(validOrderReport);
                setOrderItemsReportData(validOrderItemsReport);

                // const productsSet = new Set(flatItems.map(item => item.product_name));
                // console.log(productsSet);
                const productOptions = prod.map(product => ({
                    value: product.product_id,
                    label: product.name
                  }));
                setProductsOptions(productOptions);

                setSummaryData(data.summary);
            } catch (error) {
                console.error("Failed to fetch data with filters", error);
            }
        };

        fetchFilteredSummary();
    }, [filters]);

    // console.log(productsOptions);

    const handleProductChange = selectedOptions => {
        setFilters(prev => ({ ...prev, products: selectedOptions }));
    };

    const toggleReportView = () => {
        setIsOrderReport(prev => !prev);
    };

    const totalRevenue = orderReportData.reduce((acc, order) => acc + parseFloat(order.totalAmount || 0), 0);
    const totalOrders = orderReportData.length;
    const totalProductsSold = orderItemsReportData.reduce((acc, item) => acc + item.quantity, 0);

    // Ensure data passed to chart is in the correct format
    const chartData = isOrderReport
        ? orderReportData?.map(entry => ({
            date: entry.date,
            value: parseFloat(entry.totalAmount) || 0
        })) 
        : orderItemsReportData?.map(entry => ({
            date: entry.date,
            value: entry.quantity || 0
        }));

    return (
        <div className="report-body">
            <div className="report-container">
                <h1>Giftshop Report</h1>

                {/* Filters Section */}
                <div className="filters-section">
                    <h3>Filters</h3>
                    <div className="filter-inputs">
                        <div className='filter-date-container'>
                            <label>Date Range:</label>
                            <input type="date" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
                            <input type="date" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
                            <button className="clear-filters-button" onClick={() => setFilters({
                                startDate: '',
                                endDate: '',
                                products: [],
                                minTotal: '',
                                maxTotal: ''
                            })}>
                                Clear All Filters
                            </button>
                        </div>
                        <div className='filter-selectors-container'>
                            <div className='filter-selectors-row'>
                                <label>Products:</label>
                                <Select
                                    className='filter-selectors'
                                    isMulti
                                    options={productsOptions}
                                    value={filters.products}
                                    onChange={handleProductChange}
                                    placeholder="Select Products"
                                />
                            </div>
                            <div className='filter-selectors-row input-container'>
                                <label>Min Total Price:</label>
                                <input type="number" value={filters.minTotal} onChange={(e) => setFilters({ ...filters, minTotal: e.target.value })} placeholder="Min Price" />
                            </div>
                            <div className='filter-selectors-row input-container'>
                                <label>Max Total Price:</label>
                                <input type="number" value={filters.maxTotal} onChange={(e) => setFilters({ ...filters, maxTotal: e.target.value })} placeholder="Max Price" />
                            </div>
                        </div>
                    </div>
                </div>

                {summaryData ? (
                    <div className="summary-and-linechart">
                        <div className="summary-section">
                            <h2 className="section-title">Summary</h2>
                            <div className="summary-table">
                                <div className="summary-row">
                                    <div className="summary-label">Total Revenue</div>
                                    <div className="summary-value">${totalRevenue.toFixed(2)}</div>
                                </div>
                                <div className="summary-row">
                                    <div className="summary-label">Total Orders Made</div>
                                    <div className="summary-value">{totalOrders}</div>
                                </div>
                                <div className="summary-row">
                                    <div className="summary-label">Total Products Sold</div>
                                    <div className="summary-value">{totalProductsSold}</div>
                                </div>
                                <div className="summary-row">
                                    <div className="summary-label">Best Grossing Item</div>
                                    <div className="summary-value">{summaryData.bestGrossingItem ?? 'N/A'}</div>
                                </div>
                                <div className="summary-row">
                                    <div className="summary-label">Worst Grossing Item</div>
                                    <div className="summary-value">{summaryData.worstGrossingItem ?? 'N/A'}</div>
                                </div>
                                <div className="summary-row">
                                    <div className="summary-label">Item with Most Quantity Sold</div>
                                    <div className="summary-value">{summaryData.highestQuantityItem ?? 'N/A'}</div>
                                </div>
                                <div className="summary-row">
                                    <div className="summary-label">Item with Least Quantity Sold</div>
                                    <div className="summary-value">{summaryData.lowestQuantityItem ?? 'N/A'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Loading giftshop report...</p>
                )}

                <div className="detailed-records-section">
                    <div className='detailed-records-section-title'>
                    <h3>{isOrderReport ? 'Detailed Orders Report' : 'Detailed Order Items Report'}</h3>
                    <div className="toggle-button-container">
                        <button onClick={toggleReportView} className="toggle-button">
                            {isOrderReport ? 'Switch to Order Items Report' : 'Switch to Order Report'}
                        </button>
                    </div>
                    </div>
                    
                    {isOrderReport ? (
                        <table className="detailed-records-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer ID</th>
                                    <th>Total Items</th>
                                    <th>Date</th>
                                    <th>Total Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderReportData.length > 0 ? orderReportData.map((record, index) => (
                                    <tr key={index}>
                                        <td>{record.orderId}</td>
                                        <td>{record.customer}</td>
                                        <td>{record.totalItems}</td>
                                        <td>{record.date}</td>
                                        <td>${record.totalAmount}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="5">No data available</td></tr>
                                )}
                            </tbody>
                        </table>
                    ) : (
                        <table className="detailed-records-table">
                            <thead>
                                <tr>
                                    <th>Customer ID</th>
                                    <th>Order ID</th>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Total Price</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderItemsReportData.length > 0 ? orderItemsReportData.map((record, index) => (
                                    <tr key={index}>
                                        <td>{record.customer}</td>
                                        <td>{record.orderId}</td>
                                        <td>{record.product}</td>
                                        <td>{record.quantity}</td>
                                        <td>${record.totalPrice}</td>
                                        <td>{record.date}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="6">No data available</td></tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GiftshopReport;
