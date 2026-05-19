import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MangaDetail from './pages/MangaDetail';
import ReadManga from './pages/ReadManga';

import Welcome from './pages/Welcome';
import AnimeHome from './pages/AnimeHome';
import AnimeDetail from './pages/AnimeDetail';
import WatchAnime from './pages/WatchAnime';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="container" style={{ paddingTop: 'calc(var(--header-height) + 20px)', paddingBottom: '40px' }}>
        <Routes>
          {/* Welcome Screen */}
          <Route path="/" element={<Welcome />} />
          
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
    </Router>
  );
}

export default App;
