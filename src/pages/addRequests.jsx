import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/addRequests.css";
import { db } from "../../firebase/firebaseConfig";
import {
  query,
  where,
  collection,
  getDocs,
  addDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";
import { useSnackbar } from "notistack";
import Swal from 'sweetalert2'

const AddRequest = () => {
  const [warning, setWarning] = useState("");
  const [coursesData, setCoursesData] = useState([]);
  const [haveCourse, setHaveCourse] = useState("");
  const [haveSectionOptions, setHaveSectionOptions] = useState([]);
  const [haveSection, setHaveSection] = useState("");
  const [wantCourse, setWantCourse] = useState("");
  const [wantSectionOptions, setWantSectionOptions] = useState([]);
  const [wantSection, setWantSection] = useState("");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar(); // Access enqueueSnackbar from the hook

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCoursesData(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const selected = coursesData.find((course) => course.code === haveCourse);
    setHaveSectionOptions(selected?.sections || []);
  }, [haveCourse, coursesData]);

  useEffect(() => {
    const selected = coursesData.find((course) => course.code === wantCourse);
    setWantSectionOptions(selected?.sections || []);
  }, [wantCourse, coursesData]);

  const clean = (val) => val.replace(/['"]+/g, "").trim();

  const handleSubmit = async () => {
    if (!haveCourse || !haveSection || !wantCourse || !wantSection) {
      // alert('Please fill in all fields before submitting.');
      enqueueSnackbar("Please fill in all fields before submitting.", {
        variant: "error",
      });
      return;
    }

    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      // alert("You must be logged in to submit a request.");
      enqueueSnackbar("You must be logged in to submit a request.", {
        variant: "error",
      });
      return;
    }

    const email = currentUser.email;
    const userId = email.substring(0, email.indexOf("@"));
    const have = clean(haveCourse);
    const want = clean(wantCourse);

    try {
      const existingQuery = query(
        collection(db, "swapRequests"),
        where("userID", "==", userId),
        where("haveCourse", "==", have),
        where("wantCourse", "==", want)
      );

      const querySnapshot = await getDocs(existingQuery);
      if (!querySnapshot.empty) {
        // alert("You have already submitted a similar swap request.");
        Swal.fire({
          title: "Error!",
          text: "You have already submitted a similar swap request.",
          icon: "error",
          // confirmButtonText: 'Cool'
        });
        return;
      }

      // Create the request data object
      const newRequest = {
        userID: userId,
        haveCourse: have,
        haveSection: clean(haveSection),
        wantCourse: want,
        wantSection: clean(wantSection),
        status: "open",
        createdAt: serverTimestamp(),
      };

      // 1. Add to main swapRequests collection (as before)
      await addDoc(collection(db, "swapRequests"), newRequest);

      // 2. ADDED: Also add to user's subcollection
      // Create a reference to the current user's document
      const userDocRef = doc(db, "users", currentUser.uid);

      // Create a reference to the requests subcollection
      const userRequestsRef = collection(userDocRef, "requests");

      // Add the request to the user's subcollection
      await addDoc(userRequestsRef, newRequest);

      Swal.fire({
        title: "Success!",
        text: "Swap request submitted successfully!",
        icon: "success",
        // confirmButtonText: 'Cool'
      });
      // alert("Swap request submitted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error submitting swap request:", error);
      // alert("There was an error submitting your request.");
      enqueueSnackbar("There was an error submitting your request.", {
        variant: "error",
      });
    }
  };

  const handleWantSectionChange = (value) => {
    if (!wantCourse) {
      setWarning(
        '⚠️ Please select a course before choosing a section in the "Want" column.'
      );
      setWantSection("");
    } else {
      setWarning("");
      setWantSection(value);
    }
  };

  const handleHaveSectionChange = (value) => {
    if (!haveCourse) {
      setWarning('Please select a course first for the "Have" section.');
      setHaveSection("");
    } else {
      setWarning("");
      setHaveSection(value);
    }
  };

  return (
    <div className="screen" id="course-schedule-screen">
      <div className="course-form-container">
        <div className="back-btn-container">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            Back
          </button>
        </div>
        <div className="form-content-horizontal">
          <div className="section-row">
            {/* Have Section */}
            <div className="course-section">
              <div className="form-group">
                <label>Have</label>
                <div className="input-container">
                  <select
                    value={haveCourse}
                    onChange={(e) => setHaveCourse(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select a course</option>
                    {coursesData.map((course, index) => (
                      <option key={index} value={course.code}>
                        {course.code}
                      </option>
                    ))}
                  </select>
                  <span className="select-arrow">▼</span>
                </div>
              </div>

              <div className="form-group">
                <label>Section</label>
                <div className="input-container">
                  <select
                    value={haveSection}
                    onChange={(e) => handleHaveSectionChange(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select a section</option>
                    {haveSectionOptions.map((section, index) => (
                      <option key={index} value={section.section}>
                        {section.section} ({section.days_times})
                      </option>
                    ))}
                  </select>
                  <span className="select-arrow">▼</span>
                </div>
              </div>
            </div>

            {/* Want Section */}
            <div className="course-section">
              <div className="form-group">
                <label>Want</label>
                <div className="input-container">
                  <select
                    value={wantCourse}
                    onChange={(e) => setWantCourse(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select a course</option>
                    {coursesData.map((course, index) => (
                      <option key={index} value={course.code}>
                        {course.code}
                      </option>
                    ))}
                  </select>
                  <span className="select-arrow">▼</span>
                </div>
              </div>

              <div className="form-group">
                <label>Section</label>
                <div className="input-container">
                  <select
                    value={wantSection}
                    onChange={(e) => handleWantSectionChange(e.target.value)}
                    className="form-select"
                  >
                    <option value="">Select a section</option>
                    {wantSectionOptions.map((section, index) => (
                      <option key={index} value={section.section}>
                        {section.section} ({section.days_times})
                      </option>
                    ))}
                  </select>
                  <span className="select-arrow">▼</span>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="submit-container">
            {warning && <div className="warning-message">{warning}</div>}
            <button className="submit-btn" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRequest;
