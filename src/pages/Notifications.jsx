import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import EmptyState from "../components/EmptyState";
import { db } from "../../firebase/firebaseConfig";
import {
  onSnapshot,
  collection,
  getDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import UserDetailsModal from "../components/UserDetailsModal";
import "../styles/Notifications.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NotificationItem from "../components/NotificationItem";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Set up the authentication listener to track user state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Fetch notifications after user state is updated
  useEffect(() => {
    if (!currentUser) return;
    const currentUserID = currentUser.email.substring(0, 7);

    // get interested users from swapRequests
    const unsubscribe = onSnapshot(
      collection(db, "swapRequests"),
      async (snapshot) => {
        const updatedNotifications = [];

        for (const docSnapshot of snapshot.docs) {
          const data = docSnapshot.data();
          const swapRequestId = docSnapshot.id;
          const isPoster = data.userID === currentUserID;
          if (isPoster) {
            // Get all docs in the interestedUsers subcollection
            const interestedUsersRef = collection(
              db,
              "swapRequests",
              swapRequestId,
              "interestedUsers"
            );
            const interestedUsersSnapshot = await getDocs(interestedUsersRef);

            if (!interestedUsersSnapshot.empty) {
              for (const userDoc of interestedUsersSnapshot.docs) {
                const userData = userDoc.data();

                const interestedUserID = userDoc.data().identifier;
                const usersQuery = query(
                  collection(db, "users"),
                  where("studentId", "==", interestedUserID)
                );
                const usersSnapshot = await getDocs(usersQuery);

                if (usersSnapshot.empty) {
                  console.warn("No user doc found for:", interestedUserID);
                } else {
                  const userDoc = usersSnapshot.docs[0];
                  const userData = userDoc.data();

                  updatedNotifications.push({
                    swapRequestId,
                    userID: interestedUserID,
                    userName: userData.fullName,
                    userEmail: userData.email,
                    userPhone: userData.contactNumber,
                    userMessage: userData.message,
                    haveCourse: data.haveCourse,
                    wantCourse: data.wantCourse,
                  });
                }
              }
            }
          }
        }

        setNotifications(updatedNotifications);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchMatchingRequests = async () => {
      try {
        const currentUserID = currentUser.uid;

        // Step 1: Fetch the user's requests
        const userRequestsRef = collection(
          db,
          "users",
          currentUserID,
          "requests"
        );
        const userRequestsSnapshot = await getDocs(userRequestsRef);

        if (userRequestsSnapshot.empty) {
          console.log("No requests found for the current user.");
          return;
        }

        const userRequests = userRequestsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("User's requests:", userRequests);

        // Step 2: Check for matches in the swapRequests collection
        const allMatches = [];

        for (const request of userRequests) {
          const { haveCourse, wantCourse } = request;

          const swapRequestsRef = collection(db, "swapRequests");
          const q = query(
            swapRequestsRef,
            where("haveCourse", "==", wantCourse), // Match user's wantCourse with other's haveCourse
            where("haveSection", "==", request.wantSection), // Match user's wantSection with other's haveSection
            where("wantSection", "==", request.haveSection), // Match user's haveSection with other's wantSection
            where("wantCourse", "==", haveCourse) // Match user's haveCourse with other's wantCourse
          );

          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            console.log(`No matches found for request ${request.id}`);
            continue; // Skip to the next request if no matches are found
          }

          const matches = querySnapshot.docs.filter((doc) => {
            const data = doc.data();
            return (
              data.haveCourse === wantCourse &&
              data.haveSection === request.wantSection &&
              data.wantSection === request.haveSection &&
              data.wantCourse === haveCourse
            );
          });

          if (matches.length === 0) {
            console.log(`No strict matches found for request ${request.id}`);
            continue;
          }

          matches.forEach((match) => {
            console.log("Strict Match Found:", match.id, match.data());
          });

          const swapData = querySnapshot.docs[0].data();
          console.log("Matching swap request found:", swapData);
          const matchUserID = swapData.userID;

          // Now get user profile info from "users" collection
          const userProfileQuery = query(
            collection(db, "users"),
            where("studentId", "==", matchUserID)
          );
          const userProfileSnapshot = await getDocs(userProfileQuery);

          if (!userProfileSnapshot.empty) {
            const userProfile = userProfileSnapshot.docs[0].data();

            allMatches.push({
              type: "match",
              userID: matchUserID,
              userName: userProfile.fullName,
              userEmail: userProfile.email,
              userPhone: userProfile.contactNumber,
              userMessage: userProfile.message,
              haveCourse: swapData.haveCourse,
              wantCourse: swapData.wantCourse,
            });
          } else {
            console.warn("No user profile found for:", matchUserID);
          }
        }

        // Step 3: Update the notifications state with matches
        setNotifications((prevNotifications) => {
          const updatedNotifications = [...prevNotifications, ...allMatches];
          console.log("Updated Notifications State:", updatedNotifications);
          return updatedNotifications;
        });
      } catch (error) {
        console.error("Error fetching matching requests:", error);
      }
    };

    fetchMatchingRequests();
  }, [currentUser]);

  const handleNotificationClick = (notification) => {
    setSelectedUser({
      name: notification.userName,
      email: notification.userEmail,
      phone: notification.userPhone,
      message: notification.userMessage,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (currentUser === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="requests-layout">
      <Sidebar />
      <div className="requests-main">
        <h1 className="section-title">Your Notifications</h1>
        <div className="requests-content">
          {notifications.length === 0 ? (
            <div className="empty-state-wrapper">
              <EmptyState />
            </div>
          ) : (
            notifications.map((notification, index) => (
              <NotificationItem
                key={index}
                notification={notification}
                onClick={handleNotificationClick}
              />
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <UserDetailsModal
          isOpen={isModalOpen}
          user={selectedUser}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default NotificationsPage;
