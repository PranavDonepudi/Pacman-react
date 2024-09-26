import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import Navbar from './components/Navbar';
import  mapLevel1  from './maps/mapLevel1';
import { movePacman, moveGhosts, getInitialGhostPositions, handleKeyDown } from './gameFunction';
import './App.css';

function App() {
    const [lives, setLives] = useState(3);
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [map, setMap] = useState(mapLevel1);
    const [pacmanPosition, setPacmanPosition] = useState({ x: 8, y: 12 });
    const [direction, setDirection] = useState('right');
    const [nextDirection, setNextDirection] = useState(null);
    const [ghosts, setGhosts] = useState(getInitialGhostPositions());

    // Use the imported `handleKeyDown` function
    useEffect(() => {
        const handleKeyDownWrapper = (event) => handleKeyDown(event, setNextDirection, direction);
        window.addEventListener('keydown', handleKeyDownWrapper);
        return () => window.removeEventListener('keydown', handleKeyDownWrapper);
    }, [direction]);

    // Use the imported `movePacman` function
    useEffect(() => {
        const intervalId = setInterval(() => {
            movePacman(
                pacmanPosition,
                direction,
                nextDirection,
                map,
                ghosts,
                setPacmanPosition,
                setDirection,
                setNextDirection,
                setMap,
                setScore,
                setLives,
                setGhosts,
                mapLevel1,
                getInitialGhostPositions
            );
        }, 300);

        return () => clearInterval(intervalId);
    }, [direction, pacmanPosition, map, ghosts, lives, nextDirection]);

    // Use the imported `moveGhosts` function
    useEffect(() => {
        const intervalId = setInterval(() => {
            moveGhosts(ghosts, map, setGhosts);
        }, 500);
        return () => clearInterval(intervalId);
    }, [map, ghosts]);

    return (
        <div className="App">
            <Navbar lives={lives} level={level} score={score} />
            <div className="map-container">
                <Map map={map} pacmanPosition={pacmanPosition} ghosts={ghosts} />
            </div>
        </div>
    );
}

export default App;
