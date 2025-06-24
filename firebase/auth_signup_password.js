import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();

export const createUserWithEmailAndPasswordHandler = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("User signed up:", userCredential.user);
      return userCredential; // Return the full object!
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Error signing up:", errorCode, errorMessage);
      throw error;
    });
};
