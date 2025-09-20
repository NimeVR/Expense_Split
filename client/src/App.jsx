import React, { useState, useEffect } from 'react';
import './App.css';
import AuthPage from './pages/AuthPage.jsx';
import HomePage from './pages/HomePage.jsx';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user info is in local storage on app load
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo'); // Clear user info on logout
    setIsLoggedIn(false);
  };

  return (
    <>
    <h1 className="white-center">Welcome to Expense Split!</h1>
      

    <div className="app-container">
      <video autoPlay loop muted className="background-video">
        <source src="/backgroundvideo.mp4" type="video/mp4" />
      </video>
      <div className="content">
        {isLoggedIn ? (
          <HomePage onLogout={handleLogout} />
        ) : (
          <AuthPage onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </div>
    </>
  );
}
export default App;