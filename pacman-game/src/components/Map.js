import React from 'react';
import Pacman from './Pacman';
import Ghost from './Ghost';

const Map = ({ map, pacmanPosition, pacmanDirection, animationFrame, ghosts, fruitPosition, ghostsBlueEyed }) => {
    return (
        <div className="map">
            {map.map((row, rowIndex) => (
                <div key={rowIndex} className="map-row">
                    {row.map((cell, cellIndex) => {
                        const isPacman = pacmanPosition.x === cellIndex && pacmanPosition.y === rowIndex;
                        const ghostAtPosition = ghosts.find(ghost => ghost.x === cellIndex && ghost.y === rowIndex);
                        const isFruit = fruitPosition && fruitPosition.x === cellIndex && fruitPosition.y === rowIndex;

                        if (isPacman) {
                            return (
                                <Pacman
                                    key={`${rowIndex}-${cellIndex}`}
                                    direction={pacmanDirection}
                                    animationFrame={animationFrame}
                                />
                            );
                        }

                        if (ghostAtPosition) {
                            return (
                                <Ghost
                                    key={`${rowIndex}-${cellIndex}`}
                                    ghost={ghostAtPosition}
                                    ghostsBlueEyed={ghostsBlueEyed}
                                />
                            );
                        }

                        if (isFruit) {
                            return <div key={`${rowIndex}-${cellIndex}`} className="fruit" />;
                        }

                        return (
                            <div key={`${rowIndex}-${cellIndex}`} className={`cell ${cell === 1 ? 'wall' : 'path'}`} />
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default Map;
