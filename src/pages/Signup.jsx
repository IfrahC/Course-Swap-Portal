import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/SignUp.css";
import { createUserWithEmailAndPasswordHandler } from "../../firebase/auth_signup_password";
import { validatePasswordHandler } from "../../firebase/auth_validate_password";
import { db } from "../../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useSnackbar } from "notistack";

const SignUp = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar(); // Access enqueueSnackbar from the hook

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateHUEmail = (email) => {
    const huEmailPattern = /^[a-z]{2}\d{5}@st\.habib\.edu\.pk$/;
    return huEmailPattern.test(email);
  };

  const validateForm = async () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateHUEmail(formData.email)) {
      newErrors.email = "Please enter a valid Habib University student email";
    }

    // Await the result of validatePasswordHandler
    const validPassword = await validatePasswordHandler(formData.password);

    if (!validPassword.isValid) {
      if (validPassword.needsLowerCase) {
        newErrors.password =
          "Password must contain at least one lowercase letter.";
      }
      if (validPassword.needsUpperCase) {
        newErrors.password =
          "Password must contain at least one uppercase letter.";
      }
      if (validPassword.needsNumber) {
        newErrors.password = "Password must contain at least one number.";
      }
      if (validPassword.needsMinLength) {
        newErrors.password = "Password must be at least 6 characters long.";
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = await validateForm();

    if (isValid) {
      console.log("Form submitted:", formData);
      createUserWithEmailAndPasswordHandler(formData.email, formData.password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          const uid = user.uid;
          console.log("User created:", user);
          const studentId = formData.email.split("@")[0]; // parses e.g., fa12345 from email

          try {
            await setDoc(doc(db, "users", user.uid), {
              fullName: formData.fullName,
              email: formData.email,
              studentId: studentId,
              createdAt: new Date(),
            });
            console.log("User added to Firestore successfully");
          } catch (error) {
            console.error("Error adding user to Firestore:", error.message);
          }

          console.log("Signup and Firestore user creation successful:", user);
          enqueueSnackbar("Account created successfully!", {
            variant: "success",
          });
          navigate("/");
        })

        .catch((error) => {
          console.error("Signup failed:", error.message);
          enqueueSnackbar("Signup failed. Please try again.", {
            variant: "error",
          });
        });
    } else {
      console.log("Form validation failed:", errors);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-left-panel">
        <h1>Join Us!</h1>
        <p>Sign up to Habib University Course Swap portal</p>
        <div className="decorative-elements">
          <div className="circle-element top-left"></div>
          <div className="circle-element bottom-right"></div>
          <div className="wave-element"></div>
        </div>
      </div>
      <div className="auth-form">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
            />
            {errors.fullName && (
              <div className="error-message">{errors.fullName}</div>
            )}
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && (
              <div className="error-message">{errors.confirmPassword}</div>
            )}
          </div>

          <button type="submit" className="auth-button">
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
