import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './giftshop-purchases.css';

const GiftshopPurchases = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { dashboardData } = location.state || {};
    const [groupedOrders, setGroupedOrders] = useState({});
    const [expandedOrders, setExpandedOrders] = useState({});

    useEffect(() => {
        const orders = dashboardData?.orders || [];

        // Group orders by order_id
        const grouped = orders.reduce((acc, order) => {
            if (!acc[order.order_id]) {
                acc[order.order_id] = {
                    order_id: order.order_id,
                    order_date: order.order_date,
                    total_amount: 0,
                    payment_status: order.payment_status,
                    items: []
                };
            }

            // Add the current order item to the grouped order
            acc[order.order_id].items.push(order);

            // Add to the total amount for the order
            acc[order.order_id].total_amount += parseFloat(order.total_amount);

            return acc;
        }, {});

        setGroupedOrders(grouped);
    }, [dashboardData?.orders]);

    const toggleOrder = (orderId) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId]
        }));
    };

    // Sort grouped orders by order_date (most recent first)
    const sortedOrders = Object.entries(groupedOrders).sort(([orderIdA, orderA], [orderIdB, orderB]) => {
        return new Date(orderB.order_date) - new Date(orderA.order_date); // Compare dates in descending order
    });

    return (
        <div className="giftshop-container">
            <div className="giftshop-card">
                <h1 className="giftshop-title">Giftshop Purchases</h1>

                {sortedOrders.length > 0 ? (
                    sortedOrders.map(([orderId, order], index) => (
                        <div key={index} className="order-group">
                            <div className="order-header" onClick={() => toggleOrder(orderId)}>
                                <h2 className="order-date">
                                    {/* Order ID: {orderId} <br/> */}
                                    Purchase Date: {new Date(order.order_date).toLocaleDateString()} <br/>
                                    Total Amount: ${parseFloat(order.total_amount).toFixed(2)}
                                </h2>
                            </div>

                            {expandedOrders[orderId] && (
                                <div className="order-summary">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="order-item">
                                            <p><strong>{item.product_name}</strong></p>
                                            <p>Quantity: {item.quantity}</p>
                                            <p>Unit Price: ${parseFloat(item.product_price).toFixed(2)}</p>
                                            <p>Total: ${parseFloat(item.total_amount).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="no-orders-text">You have no giftshop purchases.</p>
                )}

                <button onClick={() => navigate('/dashboard')} className="giftshop-button">
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default GiftshopPurchases;
