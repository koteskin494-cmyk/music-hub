import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

  const Navbar = () => {
  const navigate = useNavigate();
     const user = JSON.parse(localStorage.getItem('user'));
   const isLoggedIn = !!user;

    const handleLogout = () => {
        localStorage.removeItem('user');
       localStorage.removeItem('token');
     navigate('/login');
  };

      return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🎵 Music Hub
        </Link>
        
        <div className="nav-links">
          {isLoggedIn ? (
            <>
              <Link to="/" className="nav-link">Главная</Link>
    
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Вход</Link>
              <Link to="/register" className="nav-link">Регистрация</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;