import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.js';
import Game from './pages/Game.js';
import EndScreen from './pages/EndScreen.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/endscreen" element = {<EndScreen />} />
        {/* <Route path="/game" element={<Game />} />
        <Route path="/leaderboard" element={<Leaderboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
