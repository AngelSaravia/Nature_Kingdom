import React from "react";
import PropTypes from "prop-types";
import "./StatusMetricsPanel.css";

/**
 * A reusable component to display status metrics in cards
 */
const StatusMetricsPanel = ({
  metrics,
  children,
  title,
  isLoading,
  onViewAllClick,
  viewAllButtonText = "View All Records",
}) => {
  return (
    <div className="status-panel">
      <h2 className="status-panel-heading">{title}</h2>

      {isLoading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <div className="status-metrics">
            {metrics.map((metric, index) => (
              <div className="status-metric-card" key={index}>
                <div className="metric-value" style={{ color: metric.color }}>
                  {metric.value}
                </div>
                <div className="metric-label">{metric.label}</div>
              </div>
            ))}
          </div>

          {children}

          {onViewAllClick && (
            <div className="view-all-btn-container">
              <button className="view-all-btn" onClick={onViewAllClick}>
                {viewAllButtonText}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

StatusMetricsPanel.propTypes = {
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        .isRequired,
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  onViewAllClick: PropTypes.func,
  viewAllButtonText: PropTypes.string,
};

export default StatusMetricsPanel;
