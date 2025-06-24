import React, { useState } from 'react';

const CourseSwap = () => {
  const [formData, setFormData] = useState({
    courseHave: '',
    courseWant: '',
    currentTime: '',
    desiredTime: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Swap request submitted:', formData);
    // Reset form or show confirmation
  };

  return (
    <div className="content-area">
      <div className="form-container">
        <h2 className="form-title">Course Swap Request</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-col">
              <label htmlFor="courseHave" className="form-label">
                Course You Have
              </label>
              <input
                type="text"
                id="courseHave"
                name="courseHave"
                value={formData.courseHave}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. CS101-A"
                required
              />
            </div>
            
            <div className="form-col">
              <label htmlFor="courseWant" className="form-label">
                Course You Want
              </label>
              <input
                type="text"
                id="courseWant"
                name="courseWant"
                value={formData.courseWant}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. CS101-B"
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-col">
              <label htmlFor="currentTime" className="form-label">
                Current Time Slot
              </label>
              <input
                type="text"
                id="currentTime"
                name="currentTime"
                value={formData.currentTime}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. Mon/Wed 10:00-11:15"
                required
              />
            </div>
            
            <div className="form-col">
              <label htmlFor="desiredTime" className="form-label">
                Desired Time Slot
              </label>
              <input
                type="text"
                id="desiredTime"
                name="desiredTime"
                value={formData.desiredTime}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. Tues/Thurs 2:00-3:15"
                required
              />
            </div>
          </div>
          
          <button type="submit" className="form-submit">
            Submit Swap Request
          </button>
        </form>
        
        {/* Display active swap requests */}
        <div className="table-container">
          <h3 className="section-title">Active Swap Requests</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Course Have</th>
                <th>Course Want</th>
                <th>Current Time</th>
                <th>Desired Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample data - replace with actual data */}
              <tr>
                <td>CS301-A</td>
                <td>CS301-B</td>
                <td>Mon/Wed 2:00-3:15</td>
                <td>Tues/Thurs 11:00-12:15</td>
                <td>
                  <button className="action-btn">View</button>
                  <button className="action-btn">Match</button>
                </td>
              </tr>
              <tr>
                <td>MATH201-C</td>
                <td>MATH201-A</td>
                <td>Tues/Thurs 3:30-4:45</td>
                <td>Mon/Wed/Fri 10:00-10:50</td>
                <td>
                  <button className="action-btn">View</button>
                  <button className="action-btn">Match</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseSwap;