import { useEffect } from 'react';

const usePacmanMovement = (
    pacmanPosition,
    direction,
    nextDirection,
    map,
    setPacmanPosition,
    setDirection,
    gameOver
) => {
    useEffect(() => {
        if (gameOver) return;

        const movePacman = () => {
            let { x, y } = pacmanPosition;
            let newDirection = direction;

            // Use nextDirection if it is valid
            if (nextDirection) {
                newDirection = nextDirection;
                setDirection(newDirection);
            }

            // Determine the next position based on the current direction
            if (newDirection === 'right' && map[y][x + 1] !== 1) {
                x += 1;
            } else if (newDirection === 'left' && map[y][x - 1] !== 1) {
                x -= 1;
            } else if (newDirection === 'up' && map[y - 1][x] !== 1) {
                y -= 1;
            } else if (newDirection === 'down' && map[y + 1][x] !== 1) {
                y += 1;
            }

            // Update Pacman's position
            setPacmanPosition({ x, y });
        };

        const intervalId = setInterval(movePacman, 200);

        return () => clearInterval(intervalId);
    }, [pacmanPosition, direction, nextDirection, map, gameOver, setPacmanPosition, setDirection]);
};

export default usePacmanMovement;
