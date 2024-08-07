import React, { useState } from 'react';
import { authenticateUser } from '../../services/authService';
import { getUserData, saveUserData, UserData } from '../../services/firestoreService';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<UserData | null>(null);

  const handleLogin = async () => {
    try {
      const userCredential = await authenticateUser(email, password);
      const userId = userCredential.user.uid;

      // Fetch or create user data in Firestore
      let userData = await getUserData(userId);
      if (!userData) {
        userData = { email: userCredential.user.email! };
        await saveUserData(userId, userData);
      }

      setUser(userData);
      setError(null);
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
      {user && (
        <div className="user-info">
          <h3>Welcome, {user.email}</h3>
        </div>
      )}
    </div>
  );
};

export default Login;