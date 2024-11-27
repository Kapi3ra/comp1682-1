import { useState, useEffect } from "react";
import { db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const useUserRole = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser && currentUser.uid) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser?.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        console.log("User not logged in");
      }
      setLoading(false);
    };

    fetchUserRole();
  }, []);

  return { role, loading };
};

export default useUserRole;
