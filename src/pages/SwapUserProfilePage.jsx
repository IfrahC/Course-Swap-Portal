import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import '../styles/profile.css';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';

const SwapUserProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { requestId } = useParams();
  const db = getFirestore();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchSwapUserProfile = async () => {
      try {
        console.log("Fetching swap request with ID:", requestId);
        
        // Get the swap request to find the userID
        const swapRequestRef = doc(db, "swapRequests", requestId);
        const swapRequestDoc = await getDoc(swapRequestRef);
        
        if (swapRequestDoc.exists()) {
          const swapData = swapRequestDoc.data();
          console.log("Swap request data:", swapData);
          
          // Get the userID from the swap request
          const swapUserID = swapData.userID;
          console.log("Swap userID:", swapUserID);
          
          if (swapUserID) {
            // Query users collection where studentId field equals the swapUserID
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("studentId", "==", swapUserID));
            
            console.log("Querying users where studentId =", swapUserID);
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
              // Found the user by studentId
              const userDoc = querySnapshot.docs[0];
              const userData = userDoc.data();
              console.log("Found user by studentId:", userData);
              
              // Create profile data from the found user
              const profileData = {
                name: userData.fullName || "Student " + swapUserID,
                email: userData.Email || `${swapUserID}@st.habib.edu.pk`,
                phoneNumber: userData["Contact Number"] || 'Not provided',
                studentId: userData.studentId || swapUserID,
              };
              
              console.log("Created profile data:", profileData);
              setUserData(profileData);
            } else {
              console.log("User not found by studentId query, using basic profile");
              
              // Create basic profile with the userID
              const profileData = {
                name: "Student " + swapUserID,
                email: `${swapUserID}@st.habib.edu.pk`,
                phoneNumber: 'Not provided',
                studentId: swapUserID,
              };
              
              setUserData(profileData);
            }
          } else {
            console.error("Could not find userID in swap request document");
            
            // Create a generic profile as fallback
            const profileData = {
              name: "Swap Request Creator",
              email: 'Not provided',
              phoneNumber: 'Not provided',
              studentId: 'Not available',
            };
            
            setUserData(profileData);
          }
        } else {
          console.error("Swap request document does not exist");
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Error fetching swap user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (requestId) {
      fetchSwapUserProfile();
    } else {
      setLoading(false);
      navigate('/dashboard');
    }
  }, [requestId, db, navigate]);

  if (loading) {
    return <div className="screen">Loading...</div>;
  }

  return (
    <div className="screen">
      <div className="profile-page">
      <h1 className="page-title" style={{ color: 'white' }}>Swap User's Profile Page</h1>
        <div className="navigation-buttons">
          <button onClick={() => navigate('/dashboard')}>Home</button>
        </div>
        
        <main className="profile-content">
          <ProfileCard userData={userData} showRequests={false} />
        </main>
      </div>
    </div>
  );
};
export default SwapUserProfilePage;