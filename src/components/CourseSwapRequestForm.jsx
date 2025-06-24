import React, { useState } from 'react';

const CourseSwapRequestForm = ({ onSubmit }) => {
  const [offeredCourse, setOfferedCourse] = useState('');
  const [desiredCourse, setDesiredCourse] = useState('');
  const [reason, setReason] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [matchingRequests, setMatchingRequests] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = { offeredCourse, desiredCourse, reason, preferredTime };
    onSubmit(requestData);
  };



  return (
    <form onSubmit={handleSubmit}>
      <label>
        Course You're Offering:
        <select
          value={offeredCourse}
          onChange={(e) => setOfferedCourse(e.target.value)}
        >
          <option value="course1">Course 1</option>
          <option value="course2">Course 2</option>
          <option value="course3">Course 3</option>
        </select>
      </label>
      <label>
        Course You Want:
        <select
          value={desiredCourse}
          onChange={(e) => setDesiredCourse(e.target.value)}
        >
          <option value="course1">Course 1</option>
          <option value="course2">Course 2</option>
          <option value="course3">Course 3</option>
        </select>
      </label>
      <label>
        Reason for Swap:
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows="4"
        />
      </label>
      <label>
        Preferred Time/Slot:
        <input
          type="text"
          value={preferredTime}
          onChange={(e) => setPreferredTime(e.target.value)}
        />
      </label>
      <button type="submit">Submit Request</button>
    </form>
  );
};

export default CourseSwapRequestForm;
