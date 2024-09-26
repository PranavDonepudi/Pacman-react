import React from 'react';
import './Ghost.css';

function Ghost({ color, position }) {
  return (
    <div
      className="ghost"
      style={{
        backgroundColor: color,
        top: position.y * 40 + 'px',
        left: position.x * 40 + 'px',
      }}
    ></div>
  );
}

export default Ghost;
