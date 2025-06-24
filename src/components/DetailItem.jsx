import React from 'react';

const DetailItem = ({ title, value }) => {
  return (
    <div className="detail-item">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

export default DetailItem;