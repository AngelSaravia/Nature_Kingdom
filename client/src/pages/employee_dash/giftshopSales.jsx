import React, { useState, useEffect } from "react";
import FilterSidebar from "../dataQueryReports/filterSidebar";
import ReportTable from "../dataQueryReports/reportTable";
import "./giftshop_sales.css";
const API_BASE_URL = import.meta.env.VITE_API_URL;

const GiftShopSales = () => {
  const [orderFilters, setOrderFilters] = useState({});
  const [orderItemFilters, setOrderItemFilters] = useState({});
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [totals, setTotals] = useState({});
  const [shouldFetchOrders, setShouldFetchOrders] = useState(false);
  const [shouldFetchOrderItems, setShouldFetchOrderItems] = useState(false);

  // Initial load
  useEffect(() => {
    fetchOrders();
    fetchOrderItems();
  }, []);

  useEffect(() => {
    if (shouldFetchOrders) {
      fetchOrders();
      setShouldFetchOrders(false);
    }
  }, [shouldFetchOrders, orderFilters]);

  // Fetch order items when triggered
  useEffect(() => {
    if (shouldFetchOrderItems) {
      fetchOrderItems();
      setShouldFetchOrderItems(false);
    }
  }, [shouldFetchOrderItems, orderItemFilters]);

  useEffect(() => {
    if (orders.length > 0 && orderItems.length > 0) {
      calculateTotals(orders, orderItems);
    }
  }, [orders, orderItems]);

  const handleOrderFilterChange = (event) => {
    const { name, value } = event.target; // Extract name and value from the event-like object
    setOrderFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };
  
  const handleOrderItemFilterChange = (event) => {
    const { name, value } = event.target; // Extract name and value from the event-like object
    setOrderItemFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const fetchOrders = async () => {
    try {
      const filtersToSend = Object.keys(orderFilters).length > 0 ? orderFilters : {}; // Send filters only if they exist
      console.log("Order Filters:", orderFilters); // Debugging log
      const response = await fetch(`${API_BASE_URL}/query_report/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity_type: "orders", ...orderFilters }),
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
        calculateTotals(data.data, orderItems);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchOrderItems = async () => {
    try {
        const queryParams = {
            table1: "order_items",
            table2: "products",
            join_condition: "order_items.product_id = products.product_id",
            additional_joins: [
                {
                    table: "orders",
                    join_condition: "order_items.order_id = orders.order_id",
                },
            ],
            computed_fields: `
                order_items.order_id, 
                products.name AS product_name, 
                order_items.quantity, 
                order_items.total_amount
            `,
            ...orderItemFilters,
        };
        const filtersToSend = Object.keys(orderItemFilters).length > 0 ? orderItemFilters : {}; // Send filters only if they exist
      console.log("Order Item Filters:", orderItemFilters); // Debugging log

      const response = await fetch(`${API_BASE_URL}/query_report/order_items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entity_type: "order_items", ...orderItemFilters }),
      });
      const data = await response.json();
      if (data.success) {
        setOrderItems(data.data);
        calculateTotals(orders, data.data); // Recalculate totals
      }
    } catch (error) {
      console.error("Error fetching order items:", error);
    }
  };

  const calculateTotals = (orders, orderItems) => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total_amount), 0);
    const totalItemsPurchased = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const topProduct = orderItems.reduce((acc, item) => {
      acc[item.product_name] = (acc[item.product_name] || 0) + item.quantity;
      return acc;
    }, {});
    const topPurchasedProduct = Object.keys(topProduct).reduce((a, b) => (topProduct[a] > topProduct[b] ? a : b), "");

    setTotals({
      totalOrders,
      totalRevenue,
      totalItemsPurchased,
      topPurchasedProduct,
    });
  };

  const orderColumns = ["order_id", "visitor_id", "order_date", "total_amount"];
  const orderItemColumns = ["order_id", "product_name", "quantity", "total_amount"];

  const columnLabels = {
    order_id: "Order ID",
    visitor_id: "Visitor ID",
    order_date: "Order Date",
    total_amount: "Total Amount",
    product_name: "Product Name",
    quantity: "Quantity",
  };

  return (
    <div className="giftshop-sales-container">
      <h1 className="giftshop-sales-title">GiftShop Sales</h1>
      {/* Totals Section */}
    <div className="totals-container">
      <div className="total-box">
        <h3>Total Orders</h3>
        <p>{totals.totalOrders}</p>
      </div>
      <div className="total-box">
        <h3>Total Revenue</h3>
        <p>${totals.totalRevenue?.toFixed(2)}</p>
      </div>
      <div className="total-box">
        <h3>Total Items Purchased</h3>
        <p>{totals.totalItemsPurchased}</p>
      </div>
      <div className="total-box">
        <h3>Top Purchased Product</h3>
        <p>{totals.topPurchasedProduct}</p>
      </div>
    </div>

      {/* Content Section */}
      <div className="giftshop-sales-content">
        <div className="report-section">
          <FilterSidebar
            filters={orderFilters}
            onFilterChange={handleOrderFilterChange}
            onRunReport={() => setShouldFetchOrders(true)}
            onClearAll={() => {
                setOrderFilters({});
                setShouldFetchOrders(true); // Trigger fetch with cleared filters
            }}
            filterOptions={[
              { label: "Start Date", type: "date", name: "order_dateMin" },
              { label: "End Date", type: "date", name: "order_dateMax" },
            ]}
          />
          <ReportTable data={orders} columns={orderColumns} columnLabels={columnLabels} />
        </div>
        <div className="report-section">
          <FilterSidebar
            filters={orderItemFilters}
            onFilterChange={handleOrderItemFilterChange}
            onRunReport={() => setShouldFetchOrderItems(true)}
            onClearAll={() => {
                setOrderItemFilters({});
                setShouldFetchOrderItems(true);
            }}
            filterOptions={[
              { label: "Product Name", type: "text", name: "product_name" },
              { label: "Min Quantity", type: "number", name: "quantityMin" },
              { label: "Max Quantity", type: "number", name: "quantityMax" },
            ]}
          />
          <ReportTable data={orderItems} columns={orderItemColumns} columnLabels={columnLabels} />
        </div>
      </div>
    </div>
  );
};

export default GiftShopSales;