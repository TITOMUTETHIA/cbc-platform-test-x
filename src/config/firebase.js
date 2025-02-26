// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import 'firebase/auth';
import 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKERdi_0qTlYfvt0eW2MZnXxuOH3Cx2yM",
  authDomain: "school-management-app-9597c.firebaseapp.com",
  projectId: "school-management-app-9597c",
  storageBucket: "school-management-app-9597c.firebasestorage.app",
  messagingSenderId: "409276059604",
  appId: "1:409276059604:web:86edaf76c35ffdd3035041",
  measurementId: "G-P1X26RZ1B3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firebase Authentication and get a reference to the service
// Using AsyncStorage for persistence to maintain user session
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  
  // Initialize Cloud Firestore and get a reference to the service
  const firestore = getFirestore(app);
  
  // Initialize Realtime Database and get a reference to the service
  const database = getDatabase(app);
  
  // Initialize Cloud Storage and get a reference to the service
  const storage = getStorage(app);
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
   }
  export { app, auth, firestore, database, storage };