import { 
    ref, 
    set, 
    get, 
    update, 
    remove, 
    push, 
    query, 
    orderByChild, 
    equalTo, 
    limitToLast, 
    onValue,
    off
  } from "firebase/database";
  import { database } from "../../config/firebase";
  
  // Write data to a specific path
  export const writeData = async (path, data) => {
    try {
      const reference = ref(database, path);
      await set(reference, data);
      return true;
    } catch (error) {
      throw error;
    }
  };
  
  // Read data from a specific path
  export const readData = async (path) => {
    try {
      const reference = ref(database, path);
      const snapshot = await get(reference);
      
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  };
  
  // Update specific fields at a path
  export const updateData = async (path, updates) => {
    try {
      const reference = ref(database, path);
      await update(reference, updates);
      return true;
    } catch (error) {
      throw error;
    }
  };
  
  // Delete data at a specific path
  export const deleteData = async (path) => {
    try {
      const reference = ref(database, path);
      await remove(reference);
      return true;
    } catch (error) {
      throw error;
    }
  };
  
  // Generate a new child location with a unique key
  export const pushData = async (path, data) => {
    try {
      const listRef = ref(database, path);
      const newRef = push(listRef);
      await set(newRef, data);
      return newRef.key;
    } catch (error) {
      throw error;
    }
  };
  
  // Query data with filters
  export const queryData = async (path, orderBy, equalToValue, limit = 20) => {
    try {
      const reference = ref(database, path);
      const queryRef = query(
        reference,
        orderByChild(orderBy),
        equalTo(equalToValue),
        limitToLast(limit)
      );
      
      const snapshot = await get(queryRef);
      const results = [];
      
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          results.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
      }
      
      return results;
    } catch (error) {
      throw error;
    }
  };
  
  // Listen for real-time updates
  export const listenForData = (path, callback) => {
    const reference = ref(database, path);
    
    const unsubscribe = onValue(reference, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        callback(null);
      }
    }, (error) => {
      console.error("Listen error:", error);
    });
    
    // Return function to remove the listener
    return () => off(reference, 'value', unsubscribe);
  };
  
  // Listen for real-time updates with query
  export const listenForQueryData = (path, orderBy, equalToValue, callback) => {
    const reference = ref(database, path);
    const queryRef = query(
      reference,
      orderByChild(orderBy),
      equalTo(equalToValue)
    );
    
    const unsubscribe = onValue(queryRef, (snapshot) => {
      const results = [];
      
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          results.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        callback(results);
      } else {
        callback([]);
      }
    }, (error) => {
      console.error("Listen query error:", error);
    });
    
    // Return function to remove the listener
    return () => off(queryRef, 'value', unsubscribe);
  };
  
  // Real-time chat functionality
  export const getChatMessages = async (chatId, limit = 50) => {
    try {
      const messagesRef = ref(database, `chats/${chatId}/messages`);
      const messagesQuery = query(messagesRef, limitToLast(limit));
      const snapshot = await get(messagesQuery);
      
      const messages = [];
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          messages.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
      }
      
      return messages;
    } catch (error) {
      throw error;
    }
  };
  
  // Send a new chat message
  export const sendMessage = async (chatId, message) => {
    try {
      const messageData = {
        ...message,
        timestamp: Date.now()
      };
      
      const chatRef = ref(database, `chats/${chatId}/messages`);
      const newMessageRef = push(chatRef);
      await set(newMessageRef, messageData);
      
      // Update chat metadata
      const metadataRef = ref(database, `chats/${chatId}/metadata`);
      await update(metadataRef, {
        lastMessage: messageData.text,
        lastMessageTimestamp: messageData.timestamp,
        lastMessageSender: messageData.senderId
      });
      
      return newMessageRef.key;
    } catch (error) {
      throw error;
    }
  };
  
  // Listen for new chat messages
  export const listenForChatMessages = (chatId, callback) => {
    const messagesRef = ref(database, `chats/${chatId}/messages`);
    const messagesQuery = query(messagesRef, limitToLast(50));
    
    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      const messages = [];
      
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          messages.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          });
        });
        callback(messages);
      } else {
        callback([]);
      }
    });
    
    return () => off(messagesQuery, 'value', unsubscribe);
  };