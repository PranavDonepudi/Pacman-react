import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import Navbar from './components/Navbar';
import mapLevel1 from './maps/mapLevel1';
import mapLevel2 from './maps/mapLevel2';
import { movePacman, moveGhosts, getInitialGhostPositions, handleKeyDown } from './gameFunction';
import './App.css';

function App() {
    const [lives, setLives] = useState(3);
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [map, setMap] = useState(mapLevel1); // Use a single map state
    const [pacmanPosition, setPacmanPosition] = useState({ x: 8, y: 12 });
    const [direction, setDirection] = useState('right');
    const [nextDirection, setNextDirection] = useState(null);
    const [ghosts, setGhosts] = useState(getInitialGhostPositions());
    const [animationFrame, setAnimationFrame] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const [fruitPosition, setFruitPosition] = useState(null);
    const [ghostsBlueEyed, setGhostsBlueEyed] = useState(false);
    const [ghostsBlueEyedTimeout, setGhostsBlueEyedTimeout] = useState(null);

    // Handle keyboard events to change Pacman's direction
    useEffect(() => {
        const handleKeyDownWrapper = (event) => handleKeyDown(event, setNextDirection);
        window.addEventListener('keydown', handleKeyDownWrapper);
        return () => window.removeEventListener('keydown', handleKeyDownWrapper);
    }, []);

    // Move Pacman continuously
    useEffect(() => {
        if (gameOver) return;

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
                mapLevel2,
                getInitialGhostPositions,
                (newGameOver) => {
                    if (lives <= 0) {
                        setGameOver(newGameOver);
                    }
                }, 
                fruitPosition,
                setFruitPosition,
                setGhostsBlueEyed,
                ghostsBlueEyed,
                level,
                setLevel, // Pass level and setLevel to handle level transitions
            );
        }, 200);

        return () => clearInterval(intervalId);
    }, [direction, pacmanPosition, map, ghosts, nextDirection, gameOver, fruitPosition, ghostsBlueEyed, level]);

    // Move ghosts
    useEffect(() => {
        if (gameOver) return;

        const intervalId = setInterval(() => {
            moveGhosts(ghosts, map, setGhosts, pacmanPosition, ghostsBlueEyed);
        }, 250);

        return () => clearInterval(intervalId);
    }, [map, ghosts, pacmanPosition, gameOver, ghostsBlueEyed]);

    // Animation frame toggling for Pacman
    useEffect(() => {
        if (gameOver) return;
    
        const animationIntervalId = setInterval(() => {
            setAnimationFrame((prevFrame) => (prevFrame === 1 ? 2 : 1));
        }, 200);
    
        return () => clearInterval(animationIntervalId);
    }, [gameOver, animationFrame]); // Added animationFrame as a dependency
    

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
            }, 5000);// eslint-disable-next-line
            setGhostsBlueEyedTimeout(timeoutId);
        }

        return () => clearTimeout(ghostsBlueEyedTimeout);
    }, [ghostsBlueEyed]);

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
