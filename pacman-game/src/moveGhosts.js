// Function to get all possible moves for a ghost based on its current position and the map
const getValidMoves = (x, y, map) => {
    const moves = [];
    if (y > 0 && map[y - 1][x] !== 1) moves.push({ direction: 'up', x, y: y - 1 });
    if (y < map.length - 1 && map[y + 1][x] !== 1) moves.push({ direction: 'down', x, y: y + 1 });
    if (x > 0 && map[y][x - 1] !== 1) moves.push({ direction: 'left', x: x - 1, y });
    if (x < map[0].length - 1 && map[y][x + 1] !== 1) moves.push({ direction: 'right', x: x + 1, y });
    return moves;
};

// Calculate the Manhattan distance between two points
const calculateDistance = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2);

// Determine the next move for a ghost
export const determineGhostMove = (x, y, initialPosition, stepsMoved, type, map, pacmanPosition, currentDirection, ghostsBlueEyed) => {
    let validMoves = getValidMoves(x, y, map);
    let nextMove = null;

    // Define unique movement logic based on the ghost type
    switch (type) {
        case 'blinky': // Example: Always chase Pacman
            if (!ghostsBlueEyed) {
                // Sort moves based on distance to Pacman
                validMoves.sort((a, b) => calculateDistance(a.x, a.y, pacmanPosition.x, pacmanPosition.y) - calculateDistance(b.x, b.y, pacmanPosition.x, pacmanPosition.y));
            } else {
                // Frightened mode: Move randomly
                nextMove = validMoves[Math.floor(Math.random() * validMoves.length)];
            }
            break;
        // Other ghost types can go here...

        default:
            nextMove = validMoves[Math.floor(Math.random() * validMoves.length)]; // Random movement for any ghost type
    }

    if (!nextMove) {
        nextMove = validMoves[0]; // Fallback in case no valid moves were found
    }

    return nextMove;
};

// Main function to handle ghost movement
export const moveGhosts = (ghosts, map, setGhosts, pacmanPosition, ghostsBlueEyed) => {
    setGhosts(currentGhosts =>
        currentGhosts.map(ghost => {
            const { x, y, initialPosition, direction, stepsMoved, type } = ghost;

            // Get the next move for the ghost
            let nextMove = determineGhostMove(x, y, initialPosition, stepsMoved, type, map, pacmanPosition, direction, ghostsBlueEyed);

            return {
                ...ghost,
                x: nextMove ? nextMove.x : x,
                y: nextMove ? nextMove.y : y,
                direction: nextMove ? nextMove.direction : direction,
                stepsMoved: stepsMoved < 2 ? stepsMoved + 1 : stepsMoved
            };
        })
    );
};
