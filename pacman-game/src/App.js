import React, { useState } from 'react';
import Map from './components/Map';
import Navbar from './components/Navbar';
import mapLevel1 from './maps/mapLevel1';
import './App.css';

function App() {
    // State for lives and level
    const [lives, setLives] = useState(3); // Start with 3 lives
    const [level, setLevel] = useState(1); // Start at level 1

    return (
        <div className="App">
            <Navbar lives={lives} level={level} />
            <div className="map-container">
                <Map map={mapLevel1} />
            </div>
        </div>
    );
}

export default App;
