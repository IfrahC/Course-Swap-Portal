import { db } from "../../firebase/firebaseConfig";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

// Handle the "Interested" button click
const handleInterestClick = async (swapRequestId) => {
  const userId = auth.currentUser.uid;

  // Get the current swap request document
  const swapRequestDoc = doc(db, "swapRequests", swapRequestId);
  
  // Update the swap request document by adding the user to interestedUsers array
  await updateDoc(swapRequestDoc, {
    interestedUsers: arrayUnion(userId)
  });

  console.log("User added to interested users list!");
};
