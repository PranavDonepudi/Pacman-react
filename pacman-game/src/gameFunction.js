// gameFunctions.js

// Initialize the ghost positions
export function getInitialGhostPositions() {
    return [
        { x: 7, y: 3, type: 'red', released: false, delay: 0, initialPosition: { x: 7, y: 3 } },
        { x: 8, y: 3, type: 'blue', released: false, delay: 1000, initialPosition: { x: 8, y: 3 } }, // 1 second
        { x: 7, y: 4, type: 'orange', released: false, delay: 1500, initialPosition: { x: 7, y: 4 } }, // 2 seconds
        { x: 8, y: 4, type: 'green', released: false, delay: 2000, initialPosition: { x: 8, y: 4 } } // 3 seconds
    ];
}


// Handle keyboard events to change direction
export const handleKeyDown = (event, setNextDirection) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
    }

    let newDirection;
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
            return; // Ignore other keys
    }

    setNextDirection(newDirection);
};

export const movePacman = (
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
    setGameOver // Add setGameOver as a parameter
) => {
    let { x, y } = pacmanPosition;
    let newX = x;
    let newY = y;

    // Attempt to change direction if the next direction is valid
    if (nextDirection) {
        switch (nextDirection) {
            case 'up':
                if (y > 0 && map[y - 1][x] !== 1) {
                    newY = y - 1;
                    setDirection('up');
                }
                break;
            case 'down':
                if (y < map.length - 1 && map[y + 1][x] !== 1) {
                    newY = y + 1;
                    setDirection('down');
                }
                break;
            case 'left':
                if (x > 0 && map[y][x - 1] !== 1) {
                    newX = x - 1;
                    setDirection('left');
                }
                break;
            case 'right':
                if (x < map[0].length - 1 && map[y][x + 1] !== 1) {
                    newX = x + 1;
                    setDirection('right');
                }
                break;
            default:
                break;
        }
        setNextDirection(null);
    } else {
        // Continue moving in the current direction
        switch (direction) {
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
    }

    // Check for collisions with ghosts
    const collisionWithGhost = ghosts.some(ghost => ghost.x === newX && ghost.y === newY);
    if (collisionWithGhost) {
        setLives(prevLives => {
            const updatedLives = prevLives - 1;
            if (updatedLives <= 0) {
                setGameOver(true); // Trigger game over if no lives left
            }
            return updatedLives;
        });
        setPacmanPosition({ x: 8, y: 12 }); // Reset Pacman's position
        setDirection('right'); // Reset direction
        setMap(mapLevel1); // Reset the map
        setGhosts(getInitialGhostPositions()); // Reset ghosts' positions
        return;
    }

    // Update the map for pellet interaction and clear previous Pacman position
    const updatedMap = map.map((row, rowIndex) =>
        row.map((cell, cellIndex) => {
            if (rowIndex === y && cellIndex === x) {
                // Clear the previous Pacman position
                return 0;
            }
            if (rowIndex === newY && cellIndex === newX && cell === 3) {
                // Pacman eats a pellet
                setScore(prevScore => prevScore + 10);
                return 0; // Replace pellet with an empty path
            }
            return cell;
        })
    );
    setMap(updatedMap);

    // Update Pacman's position
    if (newX !== x || newY !== y) {
        setPacmanPosition({ x: newX, y: newY });
    }
};




// Function to move ghosts randomly
// Helper function to get valid moves (up, down, left, right) for a ghost, avoiding initial positions
const getValidMoves = (x, y, map, initialPosition) => {
    const moves = [];

    // Move up
    if (y > 0 && map[y - 1][x] !== 1 && !(initialPosition.x === x && initialPosition.y === y - 1)) {
        moves.push({ direction: 'up', x, y: y - 1 });
    }
    // Move down
    if (y < map.length - 1 && map[y + 1][x] !== 1 && !(initialPosition.x === x && initialPosition.y === y + 1)) {
        moves.push({ direction: 'down', x, y: y + 1 });
    }
    // Move left
    if (x > 0 && map[y][x - 1] !== 1 && !(initialPosition.x === x - 1 && initialPosition.y === y)) {
        moves.push({ direction: 'left', x: x - 1, y });
    }
    // Move right
    if (x < map[0].length - 1 && map[y][x + 1] !== 1 && !(initialPosition.x === x + 1 && initialPosition.y === y)) {
        moves.push({ direction: 'right', x: x + 1, y });
    }

    return moves;
};

// Main ghost movement function
export const moveGhosts = (ghosts, map, setGhosts, pacmanPosition) => {
    setGhosts(currentGhosts =>
        currentGhosts.map(ghost => {
            // Release the ghost based on its delay
            if (!ghost.released) {
                setTimeout(() => {
                    setGhosts(prevGhosts =>
                        prevGhosts.map(g => (g.type === ghost.type ? { ...g, released: true } : g))
                    );
                }, ghost.delay);
                return ghost; // Skip if not released
            }

            const { x: pacmanX, y: pacmanY } = pacmanPosition;
            const { x, y, initialPosition, direction } = ghost;
            let nextMove;

            // Get valid moves avoiding the initial position
            const possibleMoves = getValidMoves(x, y, map, initialPosition);

            // Implement ghost movement strategy
            if (ghost.type === 'red') {
                // Red ghost chases Pacman directly
                possibleMoves.sort((a, b) => calculateDistance(a.x, a.y, pacmanX, pacmanY) - calculateDistance(b.x, b.y, pacmanX, pacmanY));
                nextMove = possibleMoves[0];
            } else if (ghost.type === 'blue') {
                // Blue ghost moves randomly until close to Pacman
                const distanceToPacman = calculateDistance(x, y, pacmanX, pacmanY);
                if (distanceToPacman <= 5) {
                    possibleMoves.sort((a, b) => calculateDistance(a.x, a.y, pacmanX, pacmanY) - calculateDistance(b.x, b.y, pacmanX, pacmanY));
                    nextMove = possibleMoves[0];
                } else {
                    nextMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                }
            } else if (ghost.type === 'orange') {
                // Orange ghost targets the left side of the map
                possibleMoves.sort((a, b) => a.x - b.x);
                nextMove = possibleMoves[0];
            } else if (ghost.type === 'green') {
                // Green ghost moves in a circular pattern
                const directionOrder = ['up', 'right', 'down', 'left'];
                let nextDirectionIndex = directionOrder.indexOf(direction) + 1;
                if (nextDirectionIndex >= directionOrder.length) nextDirectionIndex = 0;
                for (let i = 0; i < directionOrder.length; i++) {
                    const dir = directionOrder[(nextDirectionIndex + i) % directionOrder.length];
                    const move = possibleMoves.find(move => move.direction === dir);
                    if (move) {
                        nextMove = move;
                        break;
                    }
                }
                if (!nextMove) {
                    nextMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                }
            }

            // Return the new ghost state with the updated position
            return {
                ...ghost,
                x: nextMove ? nextMove.x : x,
                y: nextMove ? nextMove.y : y,
                direction: nextMove ? nextMove.direction : direction
            };
        })
    );
};

// Helper function to calculate Manhattan distance between two points
const calculateDistance = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2);
