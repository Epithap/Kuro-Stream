import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MangaDetail from './pages/MangaDetail';
import ReadManga from './pages/ReadManga';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AnimeHome from './pages/AnimeHome';
import AnimeDetail from './pages/AnimeDetail';
import WatchAnime from './pages/WatchAnime';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import { useAuth } from './contexts/AuthContext.jsx';

function Layout() {
  const location = useLocation();
  const { user } = useAuth();
  const isReader = location.pathname.startsWith('/chapter/');
  const isWelcome = location.pathname === '/';
  const isLogin = location.pathname === '/login';
  const isDashboard = location.pathname === '/dashboard';
  const hideNavbar = isReader || isWelcome || isLogin || isDashboard;

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main
        className="container"
        style={{
          paddingTop: hideNavbar ? '0' : '20px',
          paddingBottom: '40px',
        }}
      >
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          
          {/* Welcome / auth landing - redirect to dashboard if already logged in */}
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Welcome />} />

          {/* Profile / admin */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Manga Mode Routes */}
          <Route path="/manga" element={<Home />} />
          <Route path="/manga/:id" element={<MangaDetail />} />
          <Route path="/chapter/:id" element={<ReadManga />} />

          {/* Anime Mode Routes */}
          <Route path="/anime" element={<AnimeHome />} />
          <Route path="/anime/:id" element={<AnimeDetail />} />
          <Route path="/watch/:episodeId" element={<WatchAnime />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
