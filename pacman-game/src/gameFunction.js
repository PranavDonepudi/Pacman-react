// gameFunctions.js

// Initialize the ghost positions
// ghosts.js
export function getInitialGhostPositions() {
    return [
        { 
            x: 7, 
            y: 3, 
            type: 'red', 
            released: false, 
            delay: 0, 
            initialPosition: { x: 7, y: 3 } 
        },
        { 
            x: 8, 
            y: 3, 
            type: 'blue', 
            released: false, 
            delay: 5000,  // Delay of 5 seconds
            initialPosition: { x: 8, y: 3 } 
        },
        { 
            x: 7, 
            y: 4, 
            type: 'orange', 
            released: false, 
            delay: 10000,  // Delay of 10 seconds
            initialPosition: { x: 7, y: 4 } 
        },
        { 
            x: 8, 
            y: 4, 
            type: 'green', 
            released: false, 
            delay: 15000,  // Delay of 15 seconds
            initialPosition: { x: 8, y: 4 } 
        }
    ];
}

// Handle keyboard events to change direction
export const handleKeyDown = (event, setNextDirection, currentDirection) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
    }

    let newDirection = currentDirection;
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
    setNextDirection(newDirection); // Store the new direction as the next direction to try
};

// Function to move Pacman
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
    getInitialGhostPositions
) => {
    let { x, y } = pacmanPosition;
    let newX = x;
    let newY = y;

    // Check if the next direction is valid; if so, update the direction and position
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
        setNextDirection(null); // Clear next direction after checking
    }

    // Attempt to move in the current direction
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

    // Check for collisions with ghosts
    const collisionWithGhost = ghosts.some(ghost => ghost.x === newX && ghost.y === newY);
    if (collisionWithGhost) {
        // Reduce lives by one and reset game state
        setLives(lives => lives - 1);
        setPacmanPosition({ x: 8, y: 12 });
        setDirection('right');
        setMap(mapLevel1);
        setGhosts(getInitialGhostPositions());
        return;
    }

    // Update the map to reflect Pacman's movement, but only allow Pacman to eat pellets (value 3)
    const updatedMap = map.map((row, rowIndex) =>
        row.map((cell, cellIndex) => {
            if (rowIndex === newY && cellIndex === newX && cell === 3) {
                setScore(prevScore => prevScore + 10); // Increment score
                return 0; // Pacman eats the pellet
            }
            if (rowIndex === pacmanPosition.y && cellIndex === pacmanPosition.x) {
                return 0; // Clear Pacman's previous position
            }
            return cell; // Keep other cells (walls, empty spaces) unchanged
        })
    );
    setMap(updatedMap);

    // Update Pacman's position
    setPacmanPosition({ x: newX, y: newY });
};

// Function to move ghosts randomly
export const moveGhosts = (ghosts, map, setGhosts) => {
    setGhosts(currentGhosts =>
        currentGhosts.map(ghost => {
            // Skip moving the ghost if it's not released yet
            if (!ghost.released) {
                // Introduce a delay before releasing each ghost (e.g., every 5 seconds)
                setTimeout(() => {
                    setGhosts(prevGhosts =>
                        prevGhosts.map(g => g.type === ghost.type ? { ...g, released: true } : g)
                    );
                }, ghost.delay);
                return ghost; // Do not move the ghost if it's not released
            }

            // Calculate new position based on random movement, avoiding walls and initial positions
            const directions = ['up', 'down', 'left', 'right'];
            let newDirection = directions[Math.floor(Math.random() * directions.length)];
            let { x, y, initialPosition } = ghost;
            let newX = x;
            let newY = y;

            switch (newDirection) {
                case 'up':
                    if (y > 0 && map[y - 1][x] !== 1 && !(initialPosition.x === x && initialPosition.y === y - 1)) {
                        newY -= 1;
                    }
                    break;
                case 'down':
                    if (y < map.length - 1 && map[y + 1][x] !== 1 && !(initialPosition.x === x && initialPosition.y === y + 1)) {
                        newY += 1;
                    }
                    break;
                case 'left':
                    if (x > 0 && map[y][x - 1] !== 1 && !(initialPosition.x === x - 1 && initialPosition.y === y)) {
                        newX -= 1;
                    }
                    break;
                case 'right':
                    if (x < map[0].length - 1 && map[y][x + 1] !== 1 && !(initialPosition.x === x + 1 && initialPosition.y === y)) {
                        newX += 1;
                    }
                    break;
                default:
                    break;
            }

            // Return the updated ghost position
            return { ...ghost, x: newX, y: newY };
        })
    );
};

