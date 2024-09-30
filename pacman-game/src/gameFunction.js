// gameFunctions.js

// Initialize the ghost positions
export function getInitialGhostPositions() {
    return [
        { x: 7, y: 3, type: 'red', released: false, delay: 0, initialPosition: { x: 7, y: 3 }, stepsMoved: 0 },
        { x: 8, y: 3, type: 'blue', released: false, delay: 1000, initialPosition: { x: 8, y: 3 }, stepsMoved: 0 },
        { x: 7, y: 4, type: 'orange', released: false, delay: 2000, initialPosition: { x: 7, y: 4 }, stepsMoved: 0 },
        { x: 8, y: 4, type: 'green', released: false, delay: 3000, initialPosition: { x: 8, y: 4 }, stepsMoved: 0 }
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
    setGameOver,
    setGhostsBlueEyed, 
    ghostsBlueEyed
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
    if (collisionWithGhost && !ghostsBlueEyed) {
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

    // Update the map for pellet and fruit interaction
    const updatedMap = map.map((row, rowIndex) =>
        row.map((cell, cellIndex) => {
            if (rowIndex === y && cellIndex === x) {
                // Clear the previous Pacman position
                return 0;
            }
            if (rowIndex === newY && cellIndex === newX) {
                if (cell === 3) { // Pacman eats a pellet
                    setScore(prevScore => prevScore + 10);
                    return 0; // Replace pellet with an empty path
                } else if (cell === 5) { // Pacman eats the fruit
                    setScore(prevScore => prevScore + 100);
                    setGhostsBlueEyed(true); // Set ghosts to blue-eyed mode
                    return 0; // Replace fruit with an empty path
                }
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
const getValidMoves = (x, y, map) => {
    const moves = [];

    // Move up
    if (y > 0 && map[y - 1][x] !== 1) {
        moves.push({ direction: 'up', x, y: y - 1 });
    }
    // Move down
    if (y < map.length - 1 && map[y + 1][x] !== 1) {
        moves.push({ direction: 'down', x, y: y + 1 });
    }
    // Move left
    if (x > 0 && map[y][x - 1] !== 1) {
        moves.push({ direction: 'left', x: x - 1, y });
    }
    // Move right
    if (x < map[0].length - 1 && map[y][x + 1] !== 1) {
        moves.push({ direction: 'right', x: x + 1, y });
    }

    return moves;
};

// Helper function to calculate Manhattan distance between two points
const calculateDistance = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2);

export const moveGhosts = (ghosts, map, setGhosts, pacmanPosition, ghostsBlueEyed) => {
    setGhosts(currentGhosts =>
        currentGhosts.map(ghost => {
            const { x, y, initialPosition, direction, stepsMoved, type } = ghost;
            let nextMove;

            // Step 1: Move the ghost away from its initial position for the first two steps
            if (stepsMoved < 2) {
                const possibleMoves = getValidMoves(x, y, map);
                if (initialPosition.x < x && possibleMoves.some(move => move.direction === 'right')) {
                    nextMove = possibleMoves.find(move => move.direction === 'right');
                } else if (initialPosition.y < y && possibleMoves.some(move => move.direction === 'down')) {
                    nextMove = possibleMoves.find(move => move.direction === 'down');
                } else {
                    // Choose a random move if right or down is not possible
                    nextMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                }
            } else {
                // Step 2: Follow their unique movement strategy
                const possibleMoves = getValidMoves(x, y, map);

                switch (type) {
                    case 'red': // Red ghost chases Pacman directly
                        possibleMoves.sort((a, b) => calculateDistance(a.x, a.y, pacmanPosition.x, pacmanPosition.y) - calculateDistance(b.x, b.y, pacmanPosition.x, pacmanPosition.y));
                        nextMove = possibleMoves[0];
                        break;

                    case 'blue': // Blue ghost moves randomly until close to Pacman
                        const distanceToPacman = calculateDistance(x, y, pacmanPosition.x, pacmanPosition.y);
                        if (distanceToPacman <= 5) {
                            possibleMoves.sort((a, b) => calculateDistance(a.x, a.y, pacmanPosition.x, pacmanPosition.y) - calculateDistance(b.x, b.y, pacmanPosition.x, pacmanPosition.y));
                            nextMove = possibleMoves[0];
                        } else {
                            nextMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                        }
                        break;

                    case 'orange': // Orange ghost targets the left side of the map
                        possibleMoves.sort((a, b) => a.x - b.x);
                        nextMove = possibleMoves[0];
                        break;

                    case 'green': // Green ghost moves in a circular pattern
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
                        break;

                    default:
                        nextMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                        break;
                }
            }

            // Return the updated ghost state
            return {
                ...ghost,
                x: nextMove ? nextMove.x : x,
                y: nextMove ? nextMove.y : y,
                direction: nextMove ? nextMove.direction : direction,
                stepsMoved: stepsMoved < 2 ? stepsMoved + 1 : stepsMoved // Increment stepsMoved until it reaches 2
            };
        })
    );
};
