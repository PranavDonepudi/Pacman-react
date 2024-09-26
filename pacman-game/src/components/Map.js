import React from 'react';
import Cell from './Cell';
import './Map.css';

function Map({ map }) {
    // Define an array of ghost types
    const ghostTypes = ['red', 'blue', 'orange', 'green'];
    let ghostIndex = 0; // Index to cycle through ghost types

    return (
        <div className="map">
            {map.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    {row.map((cell, cellIndex) => {
                        let ghostType = null;

                        // If the cell is a ghost, assign a ghost type
                        if (cell === 4) {
                            ghostType = ghostTypes[ghostIndex % ghostTypes.length];
                            ghostIndex++; // Increment the index to get the next ghost type
                        }

                        return (
                            <Cell key={cellIndex} type={cell} ghostType={ghostType} />
                        );
                    })}
                </div>
            ))}
        </div>
    );
}

export default Map;
