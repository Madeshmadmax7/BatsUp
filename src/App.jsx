import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import FooterPage from './page/FooterPage';
import Home from './page/HomePage';
import Tournament from './components/Tournament';
import Fixtures from './page/FixturesPage';
import Tickets from './page/TicketsPage';
import About from './page/AboutPage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tournaments" element={<Tournament />} />
        <Route path="/fixtures" element={<Fixtures />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <FooterPage />
    </Router>
  );
}

export default App;
