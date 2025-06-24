import React from "react";
import "../styles/UserDetailsModal.css"; // Add styling for the modal

const UserDetailsModal = ({ isOpen, user, onClose }) => {
  if (!isOpen || !user) return null;
  console.log(user);
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <h2>{user.name}'s Contact Details</h2>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Phone:</strong> {user.phone || "N/A"}
        </p>{" "}
      </div>
    </div>
  );
};

export default UserDetailsModal;
