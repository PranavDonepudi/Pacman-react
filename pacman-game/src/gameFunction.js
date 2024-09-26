// gameFunctions.js

// Initialize the ghost positions
export function getInitialGhostPositions() {
    return [
        { x: 7, y: 3, type: 'red', released: false, delay: 0, initialPosition: { x: 7, y: 3 } },
        { x: 8, y: 3, type: 'blue', released: false, delay: 2000, initialPosition: { x: 8, y: 3 } }, // Reduced to 2 seconds
        { x: 7, y: 4, type: 'orange', released: false, delay: 4000, initialPosition: { x: 7, y: 4 } }, // Reduced to 4 seconds
        { x: 8, y: 4, type: 'green', released: false, delay: 6000, initialPosition: { x: 8, y: 4 } } // Reduced to 6 seconds
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
            return; // Exit if it's not a relevant key
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
    setNextDirection
) => {
    let { x, y } = pacmanPosition;
    let newX = x;
    let newY = y;

    // Change direction if the next direction is valid
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
        // Move in the current direction if `nextDirection` is not set
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

    // Update Pacman's position
    if (newX !== x || newY !== y) {
        setPacmanPosition({ x: newX, y: newY });
    }
};


// Function to move ghosts randomly
// Helper function to calculate Manhattan distance between two points
const calculateDistance = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2);

// Helper function to get valid moves (up, down, left, right) for a ghost
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

// Red ghost: Directly chases Pacman using the shortest path (Manhattan distance)
const chasePacman = (x, y, map, pacmanX, pacmanY, initialPosition) => {
    const possibleMoves = getValidMoves(x, y, map, initialPosition);
    possibleMoves.sort((a, b) => calculateDistance(a.x, a.y, pacmanX, pacmanY) - calculateDistance(b.x, b.y, pacmanX, pacmanY));
    return possibleMoves[0]; // Choose the move with the smallest distance to Pacman
};

// Blue ghost: Moves randomly unless within a certain distance of Pacman, then chases
const randomOrChase = (x, y, map, pacmanX, pacmanY, initialPosition) => {
    const possibleMoves = getValidMoves(x, y, map, initialPosition);
    const distanceToPacman = calculateDistance(x, y, pacmanX, pacmanY);
    
    // Chase Pacman if within a distance of 5, else move randomly
    if (distanceToPacman <= 5) {
        possibleMoves.sort((a, b) => calculateDistance(a.x, a.y, pacmanX, pacmanY) - calculateDistance(b.x, b.y, pacmanX, pacmanY));
        return possibleMoves[0];
    } else {
        return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    }
};

// Orange ghost: Targets the left side of the map but avoids Pacman if too close
const targetLeftAvoidPacman = (x, y, map, pacmanX, pacmanY, initialPosition) => {
    const possibleMoves = getValidMoves(x, y, map, initialPosition);
    const distanceToPacman = calculateDistance(x, y, pacmanX, pacmanY);

    if (distanceToPacman <= 3) {
        // Move away from Pacman
        possibleMoves.sort((a, b) => calculateDistance(b.x, b.y, pacmanX, pacmanY) - calculateDistance(a.x, a.y, pacmanX, pacmanY));
    } else {
        // Move toward the left side of the map (x = 0)
        possibleMoves.sort((a, b) => a.x - b.x);
    }

    return possibleMoves[0];
};

// Green ghost: Moves in a circular pattern (example: clockwise)
const circularMovement = (x, y, map, currentDirection) => {
    const possibleMoves = getValidMoves(x, y, map, { x: -1, y: -1 }); // Pass dummy initial position

    // Circular pattern logic
    const directionOrder = ['up', 'right', 'down', 'left']; // Clockwise
    let nextDirectionIndex = directionOrder.indexOf(currentDirection) + 1;
    if (nextDirectionIndex >= directionOrder.length) nextDirectionIndex = 0;

    // Try to find the next clockwise direction available
    for (let i = 0; i < directionOrder.length; i++) {
        const direction = directionOrder[(nextDirectionIndex + i) % directionOrder.length];
        const move = possibleMoves.find(move => move.direction === direction);
        if (move) {
            return move;
        }
    }

    // If no valid circular move, choose a random valid move
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
};

// Main ghost movement function
export const moveGhosts = (ghosts, map, setGhosts, pacmanPosition) => {
    setGhosts(currentGhosts =>
        currentGhosts.map(ghost => {
            if (!ghost.released) {
                setTimeout(() => {
                    setGhosts(prevGhosts =>
                        prevGhosts.map(g => (g.type === ghost.type ? { ...g, released: true } : g))
                    );
                }, ghost.delay);
                return ghost;
            }

            const { x: pacmanX, y: pacmanY } = pacmanPosition;
            const { x, y, initialPosition, direction } = ghost;
            let nextMove;

            // Apply unique movement logic for each ghost
            switch (ghost.type) {
                case 'red':
                    nextMove = chasePacman(x, y, map, pacmanX, pacmanY, initialPosition);
                    break;
                case 'blue':
                    nextMove = randomOrChase(x, y, map, pacmanX, pacmanY, initialPosition);
                    break;
                case 'orange':
                    nextMove = targetLeftAvoidPacman(x, y, map, pacmanX, pacmanY, initialPosition);
                    break;
                case 'green':
                    nextMove = circularMovement(x, y, map, direction);
                    break;
                default:
                    nextMove = { x, y }; // Stay still if no valid logic
            }

            return {
                ...ghost,
                x: nextMove.x,
                y: nextMove.y,
                direction: nextMove.direction || ghost.direction // Update direction if needed
            };
        })
    );
};


