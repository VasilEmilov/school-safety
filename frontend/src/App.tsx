// frontend/src/App.tsx
import { useEffect, useMemo, useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import ReportForm from './pages/ReportForm';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import OverseerDashboard from './pages/OverseerDashboard';

export type AuthUser = {
  id: string;
  email: string;
  role: 'OVERSEER' | 'SCHOOL_ADMIN';
  schoolId?: string | null;
};

export type AuthContext = {
  token: string | null;
  user: AuthUser | null;
  apiBaseUrl: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';

const App = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const handleLogin = (accessToken: string, authUser: AuthUser) => {
    setToken(accessToken);
    setUser(authUser);
    if (authUser.role === 'OVERSEER') {
      navigate('/overseer');
    } else {
      navigate('/admin');
    }
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    navigate('/');
  };

  const authContext = useMemo<AuthContext>(
    () => ({ token, user, apiBaseUrl: API_BASE_URL }),
    [token, user],
  );

  return (
    <div>
      <nav>
        <Link to="/">Report</Link>
        <Link to="/login">Login</Link>
        {user?.role === 'SCHOOL_ADMIN' && <Link to="/admin">Admin</Link>}
        {user?.role === 'OVERSEER' && <Link to="/overseer">Overseer</Link>}
        {user && (
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<ReportForm apiBaseUrl={API_BASE_URL} />} />
          <Route path="/login" element={<Login apiBaseUrl={API_BASE_URL} onLogin={handleLogin} />} />
          <Route path="/admin" element={<AdminDashboard auth={authContext} />} />
          <Route path="/overseer" element={<OverseerDashboard auth={authContext} />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
