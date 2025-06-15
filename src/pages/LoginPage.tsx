import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppContext } from '../context/AppContext';

const LoginPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { dispatch } = useAppContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // Step 1: Attempt login
      await axios.post(
        'https://frontend-take-home-service.fetch.com/auth/login',
        { name, email },
        { withCredentials: true }
      );

      // Step 2: Try fetching user from session
      let user;
      try {
        const meRes = await axios.get(
          'https://frontend-take-home-service.fetch.com/auth/me',
          { withCredentials: true }
        );
        user = meRes.data;
      } catch (meError) {
        console.warn('⚠️ /auth/me failed, falling back to manual user:', meError);
        user = { name, email }; // fallback in case /me fails
      }

      // Step 3: Store user and navigate
      dispatch({ type: 'LOGIN', payload: user });
      navigate('/search');
    } catch (err: any) {
      console.error('❌ Login failed:', err);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Login to Fetch Dog Adoption</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Name:</label><br />
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Email:</label><br />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <button type="submit">Login</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default LoginPage;