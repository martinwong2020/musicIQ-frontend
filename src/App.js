import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.js';
import Game from './pages/Game.js';
import EndScreen from './pages/EndScreen.js';
import GameLobby from './pages/GameLobby.js';
import WaitingRoom from './pages/WaitingRoom.js';
import MultiplayerGame from './pages/MultiplayerGame.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/endscreen" element = {<EndScreen />} />
        <Route path="/gamelobby" element = {<GameLobby />} />
        <Route path="/waitingroom" element = {<WaitingRoom />} />
        <Route path="/multiplayer" element ={<MultiplayerGame />} />
      </Routes>
    </Router>
  );
}

export default App;
