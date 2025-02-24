

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthForm from '../components/AuthForm';
import "../Css/Register.css"

function Register() {
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', data);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="register-page">
      <div className="register-content">
        <div className="join-section">
          <div className="arrow-down"></div> {/* CSS pseudo-element for the arrow */}
          <h1>Join Us</h1>
          <p>Subscribe Easy Tutorials YouTube Channel to watch more videos</p>
          <button className="about-btn">About Us</button>
        </div>
        <div className="auth-container">
          <h1>Register Here</h1>
          <AuthForm type="register" onSubmit={handleRegister} />
          <p className="register-link">
            Already have an account?{' '}
            <button onClick={handleLoginClick} className="register-btn">
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;