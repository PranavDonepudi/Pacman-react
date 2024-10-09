import { useEffect } from 'react';
import { determineGhostMove } from '../moveGhosts';

const useGhostMovement = (ghosts, map, setGhosts, pacmanPosition, ghostsBlueEyed, gameOver) => {
    useEffect(() => {
        if (gameOver) return;

        const moveGhosts = () => {
            setGhosts(currentGhosts =>
                currentGhosts.map(ghost => {
                    const { x, y, direction } = ghost;
                    const nextMove = determineGhostMove(
                        x, y, ghost.initialPosition, ghost.stepsMoved, ghost.type,
                        map, pacmanPosition, direction, ghostsBlueEyed
                    );

                    return {
                        ...ghost,
                        x: nextMove ? nextMove.x : x,
                        y: nextMove ? nextMove.y : y,
                        direction: nextMove ? nextMove.direction : direction,
                        stepsMoved: ghost.stepsMoved < 2 ? ghost.stepsMoved + 1 : ghost.stepsMoved
                    };
                })
            );
        };

        const intervalId = setInterval(moveGhosts, 500);

        return () => clearInterval(intervalId);
    }, [map, pacmanPosition, ghostsBlueEyed, gameOver, setGhosts]); // Ensure dependencies are correct
};

export default useGhostMovement;
