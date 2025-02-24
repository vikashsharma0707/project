


import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import "../Css/Dashboard.css"

function ChatWindow({ selectedUser, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const socket = useSocket(); // Use the shared socket

  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, redirecting to login');
        return;
      }
      try {
        const res = await axios.get(`https://project-vvyj.onrender.com/api/users/messages/${selectedUser._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
        console.log(`Fetched messages for user ${selectedUser._id}:`, res.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (selectedUser) {
      fetchMessages();
      socket.emit('user-online');
    }

    socket.on('receive-message', (message) => {
      if (
        (message.sender === currentUser.id && message.receiver === selectedUser._id) ||
        (message.sender === selectedUser._id && message.receiver === currentUser.id)
      ) {
        setMessages(prev => [...prev, message]);
        console.log(`Received message from ${message.sender}: ${message.content}`);
      }
    });

    // Cleanup on unmount
    return () => {
      socket.off('receive-message');
    };
  }, [selectedUser, currentUser, socket]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found, redirecting to login');
      return;
    }
    const message = {
      content,
      receiver: selectedUser._id
    };
    
    try {
      const res = await axios.post('https://project-vvyj.onrender.com/api/users/messages', message, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      socket.emit('send-message', res.data);
      setMessages(prev => [...prev, res.data]);
      setContent('');
      console.log('Message sent:', res.data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="chat-window">
      {selectedUser ? (
        <>
          <h2>Chat with {selectedUser.name}</h2>
          <div className="message-container">
            {messages.map(msg => (
              <div
                key={msg._id}
                className={`message ${msg.sender === currentUser.id ? 'sent' : 'received'}`}
              >
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender === currentUser.id ? currentUser.name : selectedUser.name}`} alt="Avatar" className="message-avatar" />
                <div className="message-bubble">
                  <div className="message-content">{msg.content}</div>
                  <span className="message-time">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="chat-form">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Send a message"
              className="message-input"
            />
            <button type="submit" className="send-btn">Send</button>
          </form>
        </>
      ) : (
        <p>Select a user to start chatting</p>
      )}
    </div>
  );
}

export default ChatWindow;