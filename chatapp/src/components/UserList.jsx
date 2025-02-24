

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import "../Css/Dashboard.css"

function UserList({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const socket = useSocket(); // Use the shared socket

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, redirecting to login');
        return;
      }
      try {
        const res = await axios.get('https://mernchatapp-c856.onrender.com/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data.map(user => ({ ...user, online: user.online || false })));
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();

    socket.on('status-update', ({ userId, online }) => {
      console.log(`Status update received: User ${userId} is ${online ? 'Online' : 'Offline'}`);
      setUsers(prev =>
        prev.map(user =>
          user._id === userId ? { ...user, online } : user
        )
      );
    });

    // Cleanup on unmount
    return () => {
      socket.off('status-update');
    };
  }, [socket]);

  return (
    <div className="user-list">
      <h2>Users</h2>
      {users.map(user => (
        <div
          key={user._id}
          onClick={() => onSelectUser(user)}
          className="user-item"
        >
          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={`${user.name}'s avatar`} className="user-avatar" />
          <div className="user-info">
            <span className="user-name">{user.name} ({user.role})</span>
            <span className="user-time">2:00 PM</span> {/* Placeholder timestamp; update with real data if needed */}
            <span className={user.online ? 'status-online' : 'status-offline'}>
              {user.online ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UserList;