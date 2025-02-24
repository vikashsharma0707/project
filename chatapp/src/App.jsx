

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import { SocketProvider } from './context/SocketContext'; // Import SocketProvider

function App() {
  return (
    <BrowserRouter>
      <SocketProvider> {/* Wrap the app with SocketProvider */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </SocketProvider>
    </BrowserRouter>
  );
}

export default App;