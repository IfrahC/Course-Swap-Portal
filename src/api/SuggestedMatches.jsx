import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  setDoc
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

export const findSuggestedMatches = async (newRequest) => {
  if (!newRequest || !newRequest.haveCourse || !newRequest.wantCourse) return;

  const q = query(collection(db, "swapRequests"), where("status", "==", "active"));
  const snapshot = await getDocs(q);
  const allRequests = snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .filter(r => r.id !== newRequest.id); // exclude own request

  const scored = allRequests
    .map(r => {
      let score = 0;
      const exactMatch = r.haveCourse === newRequest.wantCourse &&
                         r.haveSection === newRequest.wantSection &&
                         r.wantCourse === newRequest.haveCourse &&
                         r.wantSection === newRequest.haveSection;

      const sameCourseDiffSection = r.haveCourse === newRequest.wantCourse &&
                                    r.wantCourse === newRequest.haveCourse;

      const sameTiming = r.timing === newRequest.timing;

      if (exactMatch) score = 3;
      else if (sameCourseDiffSection) score = 2;
      else if (sameTiming) score = 1;

      return { ...r, matchScore: score };
    })
    .filter(r => r.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);

  const topMatches = scored.slice(0, 3);
  const suggestionsRef = collection(db, "swapRequests", newRequest.id, "suggestedMatches");

  const existingSuggestions = await getDocs(suggestionsRef);
  for (const docSnap of existingSuggestions.docs) {
    await deleteDoc(doc(db, "swapRequests", newRequest.id, "suggestedMatches", docSnap.id));
  }

  await Promise.all(
    topMatches.map(async (match) => {
      const matchRef = doc(suggestionsRef, match.id);
      await setDoc(matchRef, {
        matchRequestId: match.id,
        userID: match.userID,
        haveCourse: match.haveCourse,
        wantCourse: match.wantCourse,
        matchScore: match.matchScore,
        timestamp: new Date()
      });
    })
  );
};
