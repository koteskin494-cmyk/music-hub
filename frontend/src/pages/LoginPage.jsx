import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка входа');
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 400, margin: '0 auto' }}>
        <h1> Music Hub</h1>
        <h2>Вход</h2>
        <form onSubmit={handleSubmit}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" required />
          {error && <div className="error-message">{error}</div>}
          <button type="submit">Войти</button>
          <p style={{ marginTop: 15 }}>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;