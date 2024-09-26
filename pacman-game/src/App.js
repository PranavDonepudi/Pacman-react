import React, { useState, useEffect } from 'react';
import Map from './components/Map';
import Navbar from './components/Navbar';
import mapLevel1 from './maps/mapLevel1';
import './App.css';

function App() {
    // State for lives, level, and map
    const [lives, setLives] = useState(3);
    const [level, setLevel] = useState(1);
    const [map, setMap] = useState(mapLevel1);
    const [pacmanPosition, setPacmanPosition] = useState({ x: 8, y: 12 }); // Initial position of Pacman

    // Handle keyboard events for Pacman movement
    useEffect(() => {
        const handleKeyDown = (event) => {
            let { x, y } = pacmanPosition;

            switch (event.key) {
                case 'ArrowUp':
                    if (y > 0 && map[y - 1][x] !== 1) { // Move up
                        y -= 1;
                    }
                    break;
                case 'ArrowDown':
                    if (y < map.length - 1 && map[y + 1][x] !== 1) { // Move down
                        y += 1;
                    }
                    break;
                case 'ArrowLeft':
                    if (x > 0 && map[y][x - 1] !== 1) { // Move left
                        x -= 1;
                    }
                    break;
                case 'ArrowRight':
                    if (x < map[0].length - 1 && map[y][x + 1] !== 1) { // Move right
                        x += 1;
                    }
                    break;
                default:
                    break;
            }

            // Update Pacman's position
            setPacmanPosition({ x, y });

            // Eat pellet if present
            if (map[y][x] === 3) {
                const updatedMap = map.map((row, rowIndex) =>
                    row.map((cell, cellIndex) => {
                        if (rowIndex === y && cellIndex === x) {
                            return 0; // Change pellet to empty path
                        }
                        return cell;
                    })
                );
                setMap(updatedMap);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [pacmanPosition, map]);

    return (
        <div className="App">
            <Navbar lives={lives} level={level} />
            <div className="map-container">
                <Map map={map} pacmanPosition={pacmanPosition} />
            </div>
        </div>
    );
}

export default App;
