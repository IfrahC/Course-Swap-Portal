import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../../firebase/firebaseConfig';
import EmptyState from './EmptyState';

const UserRequests = () => {
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const clean = (str) => str?.replace(/^['"]+|['"]+$/g, '');

  const fetchUserRequests = async (identifier) => {
    try {
      console.log('Fetching requests for identifier:', identifier);
      const q = query(collection(db, 'swapRequests'), where('userID', '==', identifier));
      const snapshot = await getDocs(q);
      console.log('Snapshot size:', snapshot.size);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUserRequests(data);
    } catch (error) {
      console.error("Error fetching user requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      // Get the current user
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        console.error("User not authenticated");
        return;
      }
      
      // 1. Get the request data before deleting it
      const requestDocRef = doc(db, 'swapRequests', id);
      const requestDoc = await getDoc(requestDocRef);
      
      if (!requestDoc.exists()) {
        console.error("Request document not found");
        return;
      }
      
      const requestData = requestDoc.data();
      
      // 2. Delete from main swapRequests collection
      await deleteDoc(requestDocRef);
      
      // 3. Find and delete from user's subcollection
      const userRequestsRef = collection(db, 'users', currentUser.uid, 'requests');
      
      // Create a query to find matching documents in the subcollection
      // Using multiple fields to ensure we get the right document
      const q = query(
        userRequestsRef, 
        where("haveCourse", "==", requestData.haveCourse),
        where("wantCourse", "==", requestData.wantCourse)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        console.log("No matching document found in user's subcollection");
      } else {
        console.log(`Found ${querySnapshot.size} matching documents in subcollection`);
        
        // Delete each matching document in the subcollection
        const deletePromises = querySnapshot.docs.map(doc => 
          deleteDoc(doc.ref)
        );
        
        await Promise.all(deletePromises);
        console.log("Deleted from subcollection successfully");
      }
      
      // Update the UI
      setUserRequests(prev => prev.filter(req => req.id !== id));
      
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
        const identifier = user.email.split('@')[0];
        console.log('Current user identifier:', identifier); // ✅ Debug log
        fetchUserRequests(identifier);
    } else {
        setLoading(false);
    }
    });
    return () => unsubscribe();
  }, []);  

  if (loading) return <p>Loading...</p>;

  return (
    <div className="swap-card-container">
      {userRequests.length === 0 ? (
        <EmptyState />
      ) : (
        userRequests.map((request) => (
          <div key={request.id} className="swap-card">
            <h4>
              {clean(request.haveCourse)} ({clean(request.haveSection)}) → {clean(request.wantCourse)} ({clean(request.wantSection)})
            </h4>
            <p>Status: {request.status}</p>
            <button className="swap-card-btn1" onClick={() => handleDelete(request.id)}>
              Delete Request
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default UserRequests;