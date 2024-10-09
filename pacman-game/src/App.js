import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import Navbar from './components/Navbar';
import mapLevel1 from './maps/mapLevel1';
import mapLevel2 from './maps/mapLevel2';
import { getInitialGhostPositions } from './getInitialGhostPositions';
import usePacmanMovement from './hooks/usePacmanMovement';
import useGhostMovement from './hooks/useGhostMovement';
import useHandleKeyDown from './hooks/useHandleKeyDown';

import './App.css';

function App() {
    const [lives, setLives] = useState(3);
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [map, setMap] = useState(mapLevel1); // Consolidated map state for current level
    const [pacmanPosition, setPacmanPosition] = useState({ x: 8, y: 12 });
    const [direction, setDirection] = useState('right');
    const [nextDirection, setNextDirection] = useState(null);
    const [ghosts, setGhosts] = useState(getInitialGhostPositions());
    const [animationFrame, setAnimationFrame] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const [fruitPosition, setFruitPosition] = useState(null);
    const [ghostsBlueEyed, setGhostsBlueEyed] = useState(false);
    const [ghostsBlueEyedTimeout, setGhostsBlueEyedTimeout] = useState(null);

    // Use custom hooks for handling game logic
    useHandleKeyDown(setNextDirection);
    usePacmanMovement(
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
        setGameOver,
        setGhostsBlueEyed,
        ghostsBlueEyed,
        level,
        setLevel,
        gameOver // Pass gameOver to the hook
    );
    
    useGhostMovement(ghosts, map, setGhosts, pacmanPosition, ghostsBlueEyed, gameOver); // Pass gameOver to the hook
    
    // Animation frame toggling for Pacman
    useEffect(() => {
        if (gameOver) return;

        const animationIntervalId = setInterval(() => {
            setAnimationFrame((prevFrame) => (prevFrame === 1 ? 2 : 1));
        }, 200);

        return () => clearInterval(animationIntervalId);
    }, [gameOver]);

    // Add fruit to the map when the score reaches 400
    useEffect(() => {
        if (score >= 400 && !fruitPosition) {
            setFruitPosition({ x: 10, y: 10 });
        }
    }, [score, fruitPosition]);

    // Handle ghosts turning "blue-eyed"
    useEffect(() => {
        if (ghostsBlueEyed) {
            const timeoutId = setTimeout(() => {
                setGhostsBlueEyed(false);
            }, 5000);
            setGhostsBlueEyedTimeout(timeoutId);
        }

        return () => clearTimeout(ghostsBlueEyedTimeout);
    }, [ghostsBlueEyed, ghostsBlueEyedTimeout]);

    // Transition to the next level
    useEffect(() => {
        if (level === 2) {
            setMap(mapLevel2); // Change map to level 2
            setPacmanPosition({ x: 8, y: 12 }); // Reset Pacman's position
            setGhosts(getInitialGhostPositions()); // Reset ghosts' positions
        }
    }, [level]);

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
                        fruitPosition={fruitPosition}
                        ghostsBlueEyed={ghostsBlueEyed}
                    />
                </div>
            )}
        </div>
    );
}

export default App;
