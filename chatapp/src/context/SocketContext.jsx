import { createContext, useContext, useEffect } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const token = localStorage.getItem('token');

  const socket = io('https://project-1-2eem.onrender.com', {
    auth: { token }, // Pass JWT token for authentication
    reconnectionAttempts: 5, // Limit reconnection attempts
    reconnectionDelay: 1000, // Delay between reconnection attempts
    transports: ['websocket', 'polling'], // Explicitly specify transports
    withCredentials: true, // Allow credentials for CORS
  });

  useEffect(() => {
    // Log connection status
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      console.log('Socket disconnected');
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};