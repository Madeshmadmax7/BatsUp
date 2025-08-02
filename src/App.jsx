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
      </Routes>
      <FooterPage />
    </Router>
  );
}

export default App;
