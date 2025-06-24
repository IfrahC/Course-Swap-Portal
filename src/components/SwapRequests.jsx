import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import EmptyState from './EmptyState';
import SearchBar from './SearchBar';
import Swal from 'sweetalert2'
import { useSnackbar } from 'notistack';

const SwapRequests = () => {
  const [swapRequests, setSwapRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [interestedRequestIds, setInterestedRequestIds] = useState(new Set());
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar(); // Access enqueueSnackbar from the hook
  const clean = (str) => str?.replace(/^['"]+|['"]+$/g, '');

  const fetchUserInterestStatus = async (requests) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user || !user.email) return;
  
    const identifier = user.email.split('@')[0];
    const interestedIds = new Set();
  
    await Promise.all(
      requests.map(async (req) => {
        const interestedRef = collection(db, 'swapRequests', req.id, 'interestedUsers');
        const docsSnap = await getDocs(interestedRef);
  
        docsSnap.forEach(doc => {
          const data = doc.data();
          if (data.identifier === identifier) {
            interestedIds.add(req.id);
          }
        });
      })
    );
  
    setInterestedRequestIds(interestedIds);
  };
  

  const fetchAllRequests = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'swapRequests'));
      const requests = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSwapRequests(requests);
      await fetchUserInterestStatus(requests);
    } catch (error) {
      console.error("Error fetching swap requests:", error);
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const handleSearch = async () => {
    const trimmedTerm = searchTerm.trim().toUpperCase();
  
    if (!trimmedTerm) {
      fetchAllRequests();
      return;
    }
  
    try {
      const wantQuery = query(
        collection(db, 'swapRequests'),
        where('wantCourse', '==', trimmedTerm)
      );
      const haveQuery = query(
        collection(db, 'swapRequests'),
        where('haveCourse', '==', trimmedTerm)
      );
  
      const [wantSnap, haveSnap] = await Promise.all([
        getDocs(wantQuery),
        getDocs(haveQuery)
      ]);
  
      // Merge both results and remove duplicates if any
      const docsMap = new Map();
  
      wantSnap.docs.forEach(doc => {
        docsMap.set(doc.id, { id: doc.id, ...doc.data() });
      });
  
      haveSnap.docs.forEach(doc => {
        docsMap.set(doc.id, { id: doc.id, ...doc.data() });
      });
  
      setSwapRequests(Array.from(docsMap.values()));
    } catch (error) {
      console.error("Error filtering swap requests:", error);
    }
  };

  const handleInterested = async (requestId) => {
    try {
      console.log("handleInterested called with requestId:", requestId);
      const auth = getAuth();
      const user = auth.currentUser;
  
      if (!user || !user.email) {
        // alert("Please log in to express interest.");
        Swal.fire({
          title: 'Error!',
          text: 'Please log in to express interest.',
          icon: 'error',
          // confirmButtonText: 'Cool'
        })
        return;
      }
  
      console.log("Current user email:", user.email);
      const identifier = user.email.split('@')[0]; // Extracts "aa01010" from email
      
      // Verify the swap request exists first
      try {
        const swapRequestRef = doc(db, 'swapRequests', requestId);
        const swapRequestDoc = await getDoc(swapRequestRef);
        
        if (!swapRequestDoc.exists()) {
          console.error("Swap request doesn't exist:", requestId);
          Swal.fire({
            title: 'Error!',
            text: 'This swap request no longer exists.',
            icon: 'error',
            // confirmButtonText: 'Cool'
          })
          // alert("This swap request no longer exists.");
          return;
        }
        
        console.log("Swap request found, proceeding to add interested user");
        
        // Create the reference to the interestedUsers subcollection
        const interestedUserRef = collection(db, 'swapRequests', requestId, 'interestedUsers');
        
        // Add the document to the subcollection
        const docRef = await addDoc(interestedUserRef, {
          identifier: identifier,
          timestamp: new Date()
        });
        
        console.log("Successfully added interest document with ID:", docRef.id);

        setInterestedRequestIds((prev) => new Set(prev).add(requestId));
      
        // Navigate to the SwapUserProfilePage with the requestId
        navigate(`/swap-user-profile/${requestId}`);
        Swal.fire({
          title: "Success!",
          text: "You've been marked as interested!",
          icon: "success"
        });
        // alert("You've been marked as interested!");
      } catch (innerError) {
        console.error("Error when checking swap request:", innerError);
        throw innerError; // Re-throw to be caught by outer catch
      }
    } catch (error) {
      console.error("Error saving interest:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      // alert("Failed to mark interest. Try again.");
      enqueueSnackbar('Failed to mark interest. Try again.', { variant: 'error' });

    }
  };
  
  return (
    <div className="swap-requests">
      <div className="searchbar-wrapper">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearch}
          placeholder="Search want courses..."
        />
      </div>
      <h2 className="section-title">Available Swap Requests</h2>

      <div className="swap-card-container">
        {swapRequests.length === 0 ? (
          <EmptyState />
        ) : (
          swapRequests.map((request) => (
            <div key={request.id} className="swap-card">
              <h4>
                {clean(request.haveCourse)} ({clean(request.haveSection)}) → {clean(request.wantCourse)} ({clean(request.wantSection)})
              </h4>
              <p>Status: {request.status}</p>
              <button className={`swap-card-btn ${interestedRequestIds.has(request.id) ? 'interested-disabled' : ''}`} onClick={() => handleInterested(request.id)} disabled={interestedRequestIds.has(request.id)} >
                {interestedRequestIds.has(request.id) ? 'Interest Sent' : 'Interested'}
              </button>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SwapRequests;