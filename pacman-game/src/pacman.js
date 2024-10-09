// Define the handleCollisionAndUpdate function
const handleCollisionAndUpdate = (
    newX,
    newY,
    ghosts,
    setPacmanPosition,
    setDirection,
    setMap,
    setGhosts,
    mapLevel1,
    getInitialGhostPositions,
    setLives,
    setGameOver,
    ghostsBlueEyed
) => {
    // Check for collisions with ghosts
    const collisionWithGhost = ghosts.some(ghost => ghost.x === newX && ghost.y === newY);
    if (collisionWithGhost && !ghostsBlueEyed) {
        // Handle collision: Decrease lives and reset game state
        setLives(prevLives => {
            const updatedLives = prevLives - 1;
            if (updatedLives <= 0) {
                setGameOver(true); // Trigger game over if no lives left
            } else {
                // Reset positions only if the game is not over
                resetGamePositions(setPacmanPosition, setDirection, setMap, setGhosts, mapLevel1, getInitialGhostPositions);
            }
            return updatedLives;
        });
        return;
    }

    // Other game logic for updating score, eating pellets, etc., can be placed here
};

// Helper function to reset game positions after collision
const resetGamePositions = (setPacmanPosition, setDirection, setMap, setGhosts, mapLevel1, getInitialGhostPositions) => {
    setPacmanPosition({ x: 8, y: 12 }); // Reset Pacman's position
    setDirection('right'); // Reset direction
    setMap(mapLevel1); // Reset the map
    setGhosts(getInitialGhostPositions()); // Reset ghosts' positions
};

// Existing movePacman function
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

    // Collision detection and state handling
    handleCollisionAndUpdate(
        newX,
        newY,
        ghosts,
        setPacmanPosition,
        setDirection,
        setMap,
        setGhosts,
        mapLevel1,
        getInitialGhostPositions,
        setLives,
        setGameOver,
        ghostsBlueEyed
    );

    // Update Pacman's position
    if (newX !== x || newY !== y) {
        setPacmanPosition({ x: newX, y: newY });
    }
};
