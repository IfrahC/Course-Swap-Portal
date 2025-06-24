import React from 'react';

const EmptyState = () => {
  return (
    <div className="empty-state" id="my-requests-empty-state">
      <div className="empty-state-icon">📋</div>    
      <div className="empty-state-text">
        Nothing to Show.
      </div>
      <div>You're all caught up.</div>
    </div>
  );
};

export default EmptyState;
