import React, { useState } from 'react';
import Map from './components/Map';
import mapLevel1 from './maps/mapLevel1';
import './App.css';

function App() {
  const [map] = useState(mapLevel1);

  return (
    <div className="App">
      <h1>Pacman Game</h1>
      <Map map={map} />
    </div>
  );
}

export default App;
