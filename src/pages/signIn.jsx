import React from 'react';
import SignInForm from '../components/SignInForm';  // New Form Component
import '../styles/signIn.css';  // Importing the CSS for sign-in page


const SignInPage = () => {
  return (
    <div className="wrapper">
      <SignInForm />
    </div>
    
  );
};

export default SignInPage;
