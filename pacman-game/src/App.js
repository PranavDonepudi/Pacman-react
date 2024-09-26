// App.js
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
    const [animationFrame, setAnimationFrame] = useState(1);
    const [gameOver, setGameOver] = useState(false); // New state to track game over

    // Handle keyboard events to change Pacman's direction
    useEffect(() => {
        const handleKeyDownWrapper = (event) => handleKeyDown(event, setNextDirection);
        window.addEventListener('keydown', handleKeyDownWrapper);
        return () => window.removeEventListener('keydown', handleKeyDownWrapper);
    }, []);

    // Move Pacman continuously
    useEffect(() => {
        if (gameOver) return; // Stop moving Pacman if game is over

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
                getInitialGhostPositions,
                setGameOver // Pass setGameOver to end the game
            );
        }, 200);

        return () => clearInterval(intervalId);
    }, [direction, pacmanPosition, map, ghosts, nextDirection, gameOver]);

    // Move ghosts
    useEffect(() => {
        if (gameOver) return; // Stop moving ghosts if game is over

        const intervalId = setInterval(() => {
            moveGhosts(ghosts, map, setGhosts, pacmanPosition);
        }, 200);

        return () => clearInterval(intervalId);
    }, [map, ghosts, pacmanPosition, gameOver]);

    // Animation frame toggling for Pacman
    useEffect(() => {
        if (gameOver) return; // Stop animation if game is over

        const animationIntervalId = setInterval(() => {
            setAnimationFrame((prevFrame) => (prevFrame === 1 ? 2 : 1));
        }, 200);

        return () => clearInterval(animationIntervalId);
    }, [gameOver]);

    return (
        <div className="App">
            <Navbar lives={lives} level={level} score={score} />
            {gameOver ? (
                <div className="game-over">
                    <h1>Game Over</h1>
                    <p>Your Score: {score}</p>
                </div>
            ) : (
                <div className="map-container" style={{ position: 'relative' }}>
                    <Map
                        map={map}
                        pacmanPosition={pacmanPosition}
                        pacmanDirection={direction}
                        animationFrame={animationFrame}
                        ghosts={ghosts}
                    />
                </div>
            )}
        </div>
    );
}

export default App;