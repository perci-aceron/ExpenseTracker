import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'api/axios';
import LoginForm from 'components/LoginFormComponent';

const LoginPage = () => {
  console.log('LoginPage component rendered');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token); // Save token
      navigate('/info'); // Redirect to profile page
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        onSubmit={handleLogin}
      />
    </div>
  );
};

export default LoginPage;
