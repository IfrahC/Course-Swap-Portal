import { getAuth, validatePassword } from "firebase/auth";

const auth = getAuth();

export const validatePasswordHandler = async (passwordFromUser) => {
  try {
    const status = await validatePassword(auth, passwordFromUser);

    if (!status.isValid) {
        const needsLowerCase = !/[a-z]/.test(passwordFromUser); // Check for lowercase letters
        const needsUpperCase = !/[A-Z]/.test(passwordFromUser); // Check for uppercase letters
        const needsNumber = !/[0-9]/.test(passwordFromUser);    // Check for numbers
        const needsMinLength = passwordFromUser.length < 6;     // Check for minimum length
    
        const isValid = !needsLowerCase && !needsUpperCase && !needsNumber && !needsMinLength;
    
        return {
          isValid,
          needsLowerCase,
          needsUpperCase,
          needsNumber,
          needsMinLength,
        };
    }

    return { isValid: true };
  } catch (error) {
    console.error("Error validating password:", error.message);
    throw error;
  }
};