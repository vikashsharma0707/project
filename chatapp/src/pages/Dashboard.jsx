



import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserList from '../components/UserList';
import ChatWindow from '../components/ChatWindow';
import { useSocket } from '../context/SocketContext';
import "../Css/Dashboard.css"

function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  const socket = useSocket(); // Use the shared socket

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get('https://project-1-2eem.onrender.com/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const user = res.data.find(u => u._id === JSON.parse(atob(token.split('.')[1])).id);
        setCurrentUser(user);
        if (user) {
          socket.emit('user-online');
          console.log(`Emitted user-online for ${user._id}`);
        }
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchCurrentUser();

    // Cleanup on unmount or token change
    return () => {
      if (currentUser) {
        socket.emit('user-online', null); // Mark user offline
      }
    };
  }, [navigate, currentUser, socket]);

  const handleLogout = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const userId = JSON.parse(atob(token.split('.')[1])).id;
      socket.emit('user-online', null); // Mark user offline
    }
    localStorage.removeItem('token'); // Clear token
    setCurrentUser(null); // Reset current user state
    navigate('/login'); // Navigate to login page immediately
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>{currentUser.name}</h1>
        <div className="header-actions">
          <button onClick={handleProfileClick} className="profile-btn">Profile</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>
      <main className="dashboard-main">
        <UserList onSelectUser={setSelectedUser} />
        <ChatWindow selectedUser={selectedUser} currentUser={currentUser} />
      </main>
    </div>
  );
}

export default Dashboard;