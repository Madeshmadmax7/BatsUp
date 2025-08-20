import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './App.css';

import Navbar from './components/Navbar';
import FooterPage from './page/FooterPage';
import Home from './page/HomePage';
import Tournament from './components/Tournament';
import About from './page/AboutPage';
import FixturesPage from './page/FixturesPage';
import Loader from './components/Loader';
import Login from './components/Login';
import AdminTeams from './components/AdminTeams';
import Registered from './components/Registered';

import { AuthProvider } from './AuthContext';
import NewsLetter from './components/NewsLetter';
import LiveScores from './components/LiveScores';
import TeamsPage from './components/TeamsPage';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tournaments" element={<Tournament />} />
          <Route path="/fixtures" element={<FixturesPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/manage" element={<AdminTeams />} />
          <Route path="/registered" element={<Registered />} />
          <Route path="/newsletter" element={<NewsLetter />} />
          <Route path="/scores" element={<LiveScores />} />
        </Routes>
        <FooterPage />
      </Router>
  );
}

export default App;
