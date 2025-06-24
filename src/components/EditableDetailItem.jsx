import React from 'react';

const EditableDetailItem = ({ title, value, onChange }) => {
  return (
    <div className="detail-item editable-detail-item">
      <h3>{title}</h3>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="edit-input"
      />
    </div>
  );
};

export default EditableDetailItem;