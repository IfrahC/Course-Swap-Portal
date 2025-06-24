import React, { useState, useEffect } from "react";
import "../styles/signIn.css";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPasswordHandler } from "../../firebase/auth_signin_password";
import { db } from "../../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useSnackbar } from "notistack";

const LoginPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = () => {
    setRememberMe(!rememberMe);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = credentials;

    try {
      const user = await signInWithEmailAndPasswordHandler(email, password);
      const uid = user.uid;

      // Save user data to Firestore
      const userData = { email: user.email, lastLogin: Date.now() };
      await setDoc(doc(db, "users", uid), userData, { merge: true });

      console.log("Login successful:", user);
      enqueueSnackbar("Sign In successful!", {
        variant: "success",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error.message);
      enqueueSnackbar("Invalid email or password. Please try again.", {
        variant: "error",
      });
    }
  };

  const handleForgotPassword = () => {
    console.log("Forgot password clicked");
  };

  return (
    <div className="login-container">
      <div className="login-left-panel">
        <h1>Welcome back!</h1>
        <p>Sign in to Habib University Course Swap portal</p>
        <div className="decorative-elements">
          <div className="circle-element top-left"></div>
          <div className="circle-element bottom-right"></div>
          <div className="wave-element"></div>
        </div>
      </div>

      <div className="login-form-panel">
        <div className="login-form-container">
          <h2>Sign In</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Username or email"
                value={credentials.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
            </div>

            <button type="submit" className="signin-btn">
              Sign In
            </button>
          </form>

          <div className="create-account">
            <p>
              New here? <Link to="/signup">Create an Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
