// App.js
import React, { useState, useEffect } from 'react';
import Pacman from './components/Pacman'; // Import the Pacman component
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
    const [animationFrame, setAnimationFrame] = useState(1); // For Pacman animation

    // Handle keyboard events to change Pacman's direction
    useEffect(() => {
        const handleKeyDownWrapper = (event) => handleKeyDown(event, setNextDirection, direction);
        window.addEventListener('keydown', handleKeyDownWrapper);
        return () => window.removeEventListener('keydown', handleKeyDownWrapper);
    }, [direction]);

    // Move Pacman continuously
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
        }, 300); // Adjust interval as needed for smooth movement
    
        return () => clearInterval(intervalId);
    }, [direction, pacmanPosition, map, ghosts, lives, nextDirection]);
    
    // Move ghosts more quickly and continuously
    useEffect(() => {
        const intervalId = setInterval(() => {
            moveGhosts(ghosts, map, setGhosts, pacmanPosition);
        }, 200); // Reduced time interval for faster movement
        return () => clearInterval(intervalId);
    }, [map, ghosts, pacmanPosition]);

    // Animation frame toggling for Pacman
    useEffect(() => {
        const animationIntervalId = setInterval(() => {
            setAnimationFrame((prevFrame) => (prevFrame === 1 ? 2 : 1));
        }, 200); // Adjust the speed of animation here

        return () => clearInterval(animationIntervalId);
    }, []);

    // Render the game map and components
    return (
        <div className="App">
            <Navbar lives={lives} level={level} score={score} />
            <div className="map-container" style={{ position: 'relative' }}>
                <Map
                    map={map}
                    pacmanPosition={pacmanPosition}
                    pacmanDirection={direction}
                    animationFrame={animationFrame}
                    ghosts={ghosts}
                />
            </div>
        </div>
    );
}

export default App;