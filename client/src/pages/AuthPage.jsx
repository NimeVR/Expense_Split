import React, { useState } from 'react';
import axios from 'axios';
import './AuthPage.css';

function AuthPage({ onLoginSuccess }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const switchModeHandler = () => {
    setIsLoginMode((prevMode) => !prevMode);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const config = { headers: { 'Content-Type': 'application/json' } };

    try {
      let data;
      if (isLoginMode) {
        const response = await axios.post('/api/users/login', { email, password }, config);
        data = response.data;
      } else {
        const response = await axios.post('/api/users/register', { name, email, password }, config);
        data = response.data;
      }
      localStorage.setItem('userInfo', JSON.stringify(data));
      onLoginSuccess();
    } catch (error) {
      alert(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isLoginMode ? 'Login' : 'Sign Up'}</h2>
        {!isLoginMode && (
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="auth-button">
          {isLoginMode ? 'Login' : 'Sign Up'}
        </button>
        <button type="button" className="auth-toggle-button" onClick={switchModeHandler}>
          {isLoginMode ? 'No account yet? Sign Up' : 'Already have an account? Login'}
        </button>
      </form>
    </div>
  );
}
export default AuthPage;