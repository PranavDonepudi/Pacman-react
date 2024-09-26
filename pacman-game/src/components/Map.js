import React from 'react';
import Cell from './Cell';
import './Map.css';

function Map({ map, pacmanPosition, ghosts }) {
    return (
        <div className="map">
            {map.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    {row.map((cell, cellIndex) => {
                        let type = cell;
                        let ghostType = null;

                        // Check if this is Pacman's current position
                        if (rowIndex === pacmanPosition.y && cellIndex === pacmanPosition.x) {
                            type = 2; // Pacman's cell type
                        }

                        // Check if this cell contains a ghost
                        const ghostHere = ghosts.find(
                            (ghost) => ghost.x === cellIndex && ghost.y === rowIndex
                        );
                        if (ghostHere) {
                            type = 4; // Ghost's cell type
                            ghostType = ghostHere.type; // Get the ghost's type (color)
                        }

                        return <Cell key={cellIndex} type={type} ghostType={ghostType} />;
                    })}
                </div>
            ))}
        </div>
    );
}

export default Map;
