import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/profile.css';
import EditProfileCard from '../components/EditProfileCard';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const [loading, setLoading] = useState(true);
  
  // Initialize with empty user data
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    studentId: '',
    requests: 0,
  });

  // Add state to track the original user data
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Fetch user data from Firestore
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            // Get data from Firestore
            const firestoreData = userDoc.data();
            
            // Format data to match your component structure
            const formattedData = {
              name: firestoreData.fullName,
              email: firestoreData.Email || currentUser.email,
              phoneNumber: firestoreData["Contact Number"] || 'Not provided',
              studentId: firestoreData.studentId || '',
              requests: firestoreData.requests || 0,
              uid: currentUser.uid // Store the UID for saving later
            };
            
            setUserData(formattedData);
            setOriginalData(formattedData); // Store original data for comparison
          } else {
            console.error("User document does not exist in Firestore");
            navigate('/complete-profile');
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        // User is signed out
        navigate('/login');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth, db, navigate]);

  const handleSave = async () => {
    try {
      // Check if anything has changed
      if (userData.phoneNumber !== originalData.phoneNumber) {
        // Create a reference to the user document
        const userDocRef = doc(db, "users", userData.uid);
        
        // Update only the phone number field in Firestore
        await updateDoc(userDocRef, {
          "Contact Number": userData.phoneNumber
        });
        
        console.log('User data updated successfully');
      } else {
        console.log('No changes to save');
      }
      
      // Navigate back to profile page after saving
      navigate('/profile');
    } catch (error) {
      console.error('Error updating user data:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleCancel = () => {
    // Navigate back to profile page without saving
    navigate('/profile');
  };

  const handleChange = (field, value) => {
    setUserData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };

  if (loading) {
    return <div className="screen">Loading...</div>;
  }

  return (
    <div className="screen">
      <div className="profile-page">
        
        <main className="profile-content">
          <EditProfileCard userData={userData} onFieldChange={handleChange} />
        </main>
        
        <div className="footer">
          <button 
            className="action-btn save-btn" 
            onClick={handleSave}
          >
            Save Changes
          </button>
          <button 
            className="action-btn cancel-btn" 
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;