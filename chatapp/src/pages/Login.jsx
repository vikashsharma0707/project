

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from '../components/AuthForm';
import "../Css/Login.css"

function Login() {
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      const res = await axios.post('https://project-1-2eem.onrender.com/api/auth/login', {
        email: data.email,
        password: data.password
      });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="login-page">
      <div className="login-content">
        <div className="welcome-section">
          <h1>Welcome to Website</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
        <div className="auth-container">
          <h1>USER LOGIN</h1>
          <AuthForm type="login" onSubmit={handleLogin} />
          <p className="register-link">
            Don't have an account?{' '}
            <button onClick={handleRegisterClick} className="register-btn">
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;