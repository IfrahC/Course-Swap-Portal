import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import Footer from '../components/ProfileFooter';
import '../styles/profile.css';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requestCount, setRequestCount] = useState(0);
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // User is signed in, fetch their profile data from Firestore
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            // Get data from Firestore
            const userData = userDoc.data();
            
            // Create user object with profile data
            const userProfile = {
              uid: currentUser.uid,
              Email: userData.Email || currentUser.email,
              fullName: userData.fullName,
              "Contact Number": userData["Contact Number"] || 'Not provided',
              studentId: userData.studentId || '',
              requests: 0 // Default value, will be updated after fetching requests
            };
            
            // Fetch requests from user's subcollection
            const requestsCollectionRef = collection(userDocRef, "requests");
            const requestsSnapshot = await getDocs(requestsCollectionRef);
            const count = requestsSnapshot.size;
            
            // Update the requests count
            userProfile.requests = count;
            setRequestCount(count);
            
            setUser(userProfile);
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
        setUser(null);
        navigate('/login');
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth, db, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return <div className="screen">Loading...</div>;
  }

  if (!user) {
    return <div className="screen">Please log in to view your profile</div>;
  }

  // Transform user data to match what ProfileCard expects
  const profileData = {
    name: user.fullName,
    email: user.Email,
    phoneNumber: user["Contact Number"],
    studentId: user.studentId,
    requests: requestCount
  };

  return (
    <div className="screen">
      <div className="profile-page">
        <div className="navigation-buttons">
          <button onClick={() => navigate('/dashboard')}>Home</button>
          <button onClick={() => navigate('/my-requests')}>See Requests</button>
        </div>
        
        <main className="profile-content">
          <ProfileCard userData={profileData} />
        </main>
        
        <Footer 
          onEditProfile={() => navigate('/edit-profile')}
          onLogout={handleLogout} 
        />
      </div>
    </div>
  );
};

export default ProfilePage;