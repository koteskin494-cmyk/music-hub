import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }
    
    const verifyToken = async () => {
      try {
        await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsValid(true);
      } catch (err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsValid(false);
      }
    };
    
    verifyToken();
  }, [token]);

  if (isValid === null) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>Проверка авторизации...</div>;
  }

  return isValid ? children : <Navigate to="/login" />;
};

export default PrivateRoute;