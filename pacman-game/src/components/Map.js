import React from 'react';
import Cell from './Cell';
import './Map.css';

function Map({ map }) {
  return (
    <div className="map">
      {map.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, cellIndex) => (
            <Cell key={cellIndex} type={cell} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Map;
