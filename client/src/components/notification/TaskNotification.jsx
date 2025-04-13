import React, { useState } from "react";
import "./TaskNotification.css";

const TaskNotification = ({ initialTasks = [] }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const removeTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const clearAllTasks = () => {
    setTasks([]);
  };

  const hasNotifications = tasks.length > 0;

  return (
    <div className="task-notification-container">
      <div className="notification-icon" onClick={togglePopup}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
        </svg>

        {hasNotifications && (
          <span className="notification-badge">{tasks.length}</span>
        )}
      </div>

      {isPopupOpen && (
        <div className="notification-popup">
          <div className="popup-header">
            <h3>Your Tasks</h3>
            {hasNotifications && (
              <button className="clear-all-btn" onClick={clearAllTasks}>
                Clear All
              </button>
            )}
          </div>

          <div className="popup-content">
            {tasks.length > 0 ? (
              <ul className="task-list">
                {tasks.map((task) => (
                  <li key={task.id} className="task-item">
                    <div className="task-details">
                      <p className="task-title">{task.title}</p>
                      {task.description && (
                        <p className="task-description">{task.description}</p>
                      )}
                    </div>
                    <button
                      className="remove-task-btn"
                      onClick={() => removeTask(task.id)}
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-tasks">
                <p>No tasks to display</p>
              </div>
            )}
          </div>
        </div>
      )}

      {isPopupOpen && (
        <div className="popup-backdrop" onClick={togglePopup}></div>
      )}
    </div>
  );
};

export default TaskNotification;
