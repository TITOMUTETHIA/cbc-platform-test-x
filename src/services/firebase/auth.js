import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    sendPasswordResetEmail,
    updateProfile,
    updateEmail,
    updatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider
  } from "firebase/auth";
  import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
  import { auth, firestore } from "../../config/firebase";
  
  // Register a new user
  export const registerUser = async (email, password, userData) => {
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update user profile with displayName
      if (userData.displayName) {
        await updateProfile(user, {
          displayName: userData.displayName
        });
      }
      
      // Create user document in Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        role: userData.role || "parent", // Default role
        createdAt: new Date().toISOString(),
        ...userData
      });
      
      return userCredential;
    } catch (error) {
      throw error;
    }
  };
  
  // Sign in existing user
  export const loginUser = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };
  
  // Sign out the current user
  export const logoutUser = async () => {
    try {
      return await signOut(auth);
    } catch (error) {
      throw error;
    }
  };
  
  // Send password reset email
  export const resetPassword = async (email) => {
    try {
      return await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };
  
  // Get current user data from Firestore
  export const getCurrentUserData = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return null;
      
      const docRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { uid: user.uid, ...docSnap.data() };
      } else {
        // If user auth exists but no Firestore document, create one
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          createdAt: new Date().toISOString()
        };
        await setDoc(docRef, userData);
        return userData;
      }
    } catch (error) {
      throw error;
    }
  };
  
  // Update user profile
  export const updateUserProfile = async (userData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");
      
      const updates = {};
      
      // Update displayName in Authentication if provided
      if (userData.displayName) {
        await updateProfile(user, { displayName: userData.displayName });
        updates.displayName = userData.displayName;
      }
      
      // Update user document in Firestore
      const userRef = doc(firestore, "users", user.uid);
      await updateDoc(userRef, { ...userData, updatedAt: new Date().toISOString() });
      
      return true;
    } catch (error) {
      throw error;
    }
  };
  
  // Update user email
  export const updateUserEmail = async (newEmail, password) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");
      
      // Re-authenticate user before changing email
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      
      // Update email in Authentication
      await updateEmail(user, newEmail);
      
      // Update email in Firestore
      const userRef = doc(firestore, "users", user.uid);
      await updateDoc(userRef, { 
        email: newEmail,
        updatedAt: new Date().toISOString() 
      });
      
      return true;
    } catch (error) {
      throw error;
    }
  };
  
  // Update user password
  export const updateUserPassword = async (currentPassword, newPassword) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");
      
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
      
      return true;
    } catch (error) {
      throw error;
    }
  };