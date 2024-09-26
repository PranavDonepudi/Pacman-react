import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import Navbar from './components/Navbar';
import mapLevel1 from './maps/mapLevel1';
import './App.css';

function App() {
    const [lives, setLives] = useState(3);
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [map, setMap] = useState(mapLevel1);
    const [pacmanPosition, setPacmanPosition] = useState({ x: 8, y: 12 });
    const [direction, setDirection] = useState('right'); // Pacman starts moving to the right
    const [ghosts, setGhosts] = useState(getInitialGhostPositions());

    // Initial ghost positions
    function getInitialGhostPositions() {
        return [
            { x: 7, y: 3, type: 'red' },
            { x: 8, y: 3, type: 'blue' },
            { x: 7, y: 4, type: 'orange' },
            { x: 8, y: 4, type: 'green' }
        ];
    }

    // Handle keyboard events to change direction
    useEffect(() => {
        const handleKeyDown = (event) => {
            let newDirection = direction;
            switch (event.key) {
                case 'ArrowUp':
                    newDirection = 'up';
                    break;
                case 'ArrowDown':
                    newDirection = 'down';
                    break;
                case 'ArrowLeft':
                    newDirection = 'left';
                    break;
                case 'ArrowRight':
                    newDirection = 'right';
                    break;
                default:
                    break;
            }

            // Check if the new direction is valid; if not, ignore the change
            const { x, y } = pacmanPosition;
            let validMove = false;

            switch (newDirection) {
                case 'up':
                    validMove = y > 0 && map[y - 1][x] !== 1;
                    break;
                case 'down':
                    validMove = y < map.length - 1 && map[y + 1][x] !== 1;
                    break;
                case 'left':
                    validMove = x > 0 && map[y][x - 1] !== 1;
                    break;
                case 'right':
                    validMove = x < map[0].length - 1 && map[y][x + 1] !== 1;
                    break;
                default:
                    break;
            }

            if (validMove || newDirection === direction) {
                // Update direction only if the move is valid or if it's already moving in that direction
                setDirection(newDirection);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [direction, pacmanPosition, map]);

    // Move Pacman continuously based on the current direction
    useEffect(() => {
        const movePacman = () => {
            let { x, y } = pacmanPosition;

            // Save the previous position
            const prevX = x;
            const prevY = y;

            // Determine the next position based on the current direction
            switch (direction) {
                case 'up':
                    if (y > 0 && map[y - 1][x] !== 1) y -= 1;
                    break;
                case 'down':
                    if (y < map.length - 1 && map[y + 1][x] !== 1) y += 1;
                    break;
                case 'left':
                    if (x > 0 && map[y][x - 1] !== 1) x -= 1;
                    break;
                case 'right':
                    if (x < map[0].length - 1 && map[y][x + 1] !== 1) x += 1;
                    break;
                default:
                    break;
            }

            // Check for collisions with ghosts
            const collisionWithGhost = ghosts.some(ghost => ghost.x === x && ghost.y === y);
            if (collisionWithGhost) {
                // Reduce lives by one and reset game state
                setLives(lives - 1);
                setPacmanPosition({ x: 8, y: 12 }); // Reset Pacman's position
                setDirection('right'); // Reset direction
                setMap(mapLevel1); // Reset the map
                setGhosts(getInitialGhostPositions()); // Reset ghosts' positions
                return; // Exit early since we need to reset the state
            }

            // Update the map to reflect Pacman's movement
            const updatedMap = map.map((row, rowIndex) =>
                row.map((cell, cellIndex) => {
                    if (rowIndex === y && cellIndex === x && cell === 3) {
                        setScore((prevScore) => prevScore + 10); // Increment score
                        return 0; // Pacman eats the pellet
                    }
                    if (rowIndex === prevY && cellIndex === prevX) {
                        return 0; // Clear Pacman's previous position
                    }
                    return cell;
                })
            );
            setMap(updatedMap);

            // Update Pacman's position
            setPacmanPosition({ x, y });
        };

        const intervalId = setInterval(movePacman, 300); // Move Pacman every 300ms

        return () => clearInterval(intervalId);
    }, [direction, pacmanPosition, map, ghosts, lives]);

    // Handle ghost movement
    useEffect(() => {
        const moveGhosts = () => {
            setGhosts((currentGhosts) =>
                currentGhosts.map((ghost) => {
                    const directions = ['up', 'down', 'left', 'right'];
                    let newDirection = directions[Math.floor(Math.random() * directions.length)];
                    let { x, y } = ghost;

                    // Calculate new position based on direction
                    let newX = x;
                    let newY = y;
                    switch (newDirection) {
                        case 'up':
                            if (y > 0 && map[y - 1][x] !== 1) newY -= 1;
                            break;
                        case 'down':
                            if (y < map.length - 1 && map[y + 1][x] !== 1) newY += 1;
                            break;
                        case 'left':
                            if (x > 0 && map[y][x - 1] !== 1) newX -= 1;
                            break;
                        case 'right':
                            if (x < map[0].length - 1 && map[y][x + 1] !== 1) newX += 1;
                            break;
                        default:
                            break;
                    }

                    // Return the new ghost position
                    return { ...ghost, x: newX, y: newY };
                })
            );
        };

        const intervalId = setInterval(moveGhosts, 500); // Move ghosts every 500ms
        return () => clearInterval(intervalId);
    }, [map]);

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
