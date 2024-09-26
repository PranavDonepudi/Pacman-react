// gameFunctions.js

// Initialize the ghost positions
export const getInitialGhostPositions = () => {
    return [
        { x: 7, y: 3, type: 'red' },
        { x: 8, y: 3, type: 'blue' },
        { x: 7, y: 4, type: 'orange' },
        { x: 8, y: 4, type: 'green' }
    ];
};

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
