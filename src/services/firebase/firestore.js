import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    limit,
    startAfter,
    serverTimestamp,
    Timestamp
  } from "firebase/firestore";
  import { firestore } from "../../config/firebase";
  
  // Generic function to get a document by ID
  export const getDocumentById = async (collectionName, docId) => {
    try {
      const docRef = doc(firestore, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  };
  
  // Generic function to get multiple documents with filters
  export const getDocuments = async (collectionName, filters = [], sortBy = null, limitTo = null) => {
    try {
      let q = collection(firestore, collectionName);
      
      // Apply filters if any
      if (filters.length > 0) {
        filters.forEach(filter => {
          q = query(q, where(filter.field, filter.operator, filter.value));
        });
      }
      
      // Apply sort if specified
      if (sortBy) {
        q = query(q, orderBy(sortBy.field, sortBy.direction || 'asc'));
      }
      
      // Apply limit if specified
      if (limitTo) {
        q = query(q, limit(limitTo));
      }
      
      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return documents;
    } catch (error) {
      throw error;
    }
  };
  
  // Generic function to add a document
  export const addDocument = async (collectionName, data) => {
    try {
      // Add server timestamp
      const dataWithTimestamp = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(firestore, collectionName), dataWithTimestamp);
      return docRef.id;
    } catch (error) {
      throw error;
    }
  };
  
  // Generic function to update a document
  export const updateDocument = async (collectionName, docId, data) => {
    try {
      // Add updated timestamp
      const dataWithTimestamp = {
        ...data,
        updatedAt: serverTimestamp()
      };
      
      const docRef = doc(firestore, collectionName, docId);
      await updateDoc(docRef, dataWithTimestamp);
      return true;
    } catch (error) {
      throw error;
    }
  };
  
  // Generic function to delete a document
  export const deleteDocument = async (collectionName, docId) => {
    try {
      const docRef = doc(firestore, collectionName, docId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      throw error;
    }
  };
  
  // Function to paginate documents
  export const paginateDocuments = async (collectionName, filters = [], sortBy = null, pageSize = 10, lastDocument = null) => {
    try {
      let q = collection(firestore, collectionName);
      
      // Apply filters if any
      if (filters.length > 0) {
        filters.forEach(filter => {
          q = query(q, where(filter.field, filter.operator, filter.value));
        });
      }
      
      // Apply sort (required for pagination)
      if (sortBy) {
        q = query(q, orderBy(sortBy.field, sortBy.direction || 'asc'));
      } else {
        // Default sort by createdAt if not specified
        q = query(q, orderBy('createdAt', 'desc'));
      }
      
      // Apply pagination
      if (lastDocument) {
        q = query(q, startAfter(lastDocument), limit(pageSize));
      } else {
        q = query(q, limit(pageSize));
      }
      
      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      // Get the last document for next pagination
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      
      return {
        documents,
        lastVisible,
        hasMore: documents.length === pageSize
      };
    } catch (error) {
      throw error;
    }
  };
  
  // Helper to convert Firestore Timestamp to JavaScript Date
  export const timestampToDate = (timestamp) => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    return timestamp;
  };