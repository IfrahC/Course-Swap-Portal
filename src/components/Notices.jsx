import React from 'react';

const Notices = () => {
  return (
    <div className="notices">
      <h2>Notices</h2>
      <div className="notice">
        <h4>System Downtime</h4>
        <p>Portal will be down for maintenance from 12am to 3am.</p>
      </div>
      <div className="notice">
        <h4>Deadline Reminder</h4>
        <p>Last date to submit swap requests is April 15.</p>
      </div>
    </div>
  );
};

export default Notices;
