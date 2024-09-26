import React from 'react';

function Cell({ type }) {
  let className = 'cell';
  if (type === 1) className += ' wall';      // Wall
  if (type === 0) className += ' path';      // Path
  if (type === 2) className += ' pacman';    // Pacman
  if (type === 3) className += ' pellet';    // Pellet

  return <div className={className}></div>;
}

export default Cell;
