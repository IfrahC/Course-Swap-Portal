import React from "react";
import "../styles/NotificationItem.css";

const NotificationItem = ({ notification, onClick }) => {
  const notificationClass =
    notification.type === "match" ? "notification-item match" : "notification-item";

  return (
    <div className={notificationClass} onClick={() => onClick(notification)}>
      <p>
        {notification.type === "match" ? (
          <>
            🔁 Suggested Match: <strong>{notification.userName}</strong> has a
            compatible request:{" "}
            <span>
              {notification.haveCourse} → {notification.wantCourse}
            </span>
            {notification.matchScore && (
              <span> (Score: {notification.matchScore})</span>
            )}
          </>
        ) : (
          <>
            👤 <strong>{notification.userName}</strong> is interested in your
            swap request:{" "}
            <span>
              {notification.haveCourse} → {notification.wantCourse}
            </span>
          </>
        )}
      </p>
    </div>
  );
};

export default NotificationItem;