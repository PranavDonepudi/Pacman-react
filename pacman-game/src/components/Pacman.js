import React, { useEffect, useState } from 'react';
import pacmanGif from '../assets/Pacman/pacman.gif';
import pacmanUp1 from '../assets/Pacman/PacmanU1.png';
import pacmanUp2 from '../assets/Pacman/PacmanU2.png';
import pacmanDown1 from '../assets/Pacman/PacmanD1.png';
import pacmanDown2 from '../assets/Pacman/PacmanD2.png';
import pacmanLeft1 from '../assets/Pacman/PacmanL1.png';
import pacmanLeft2 from '../assets/Pacman/PacmanL2.png';
import pacmanRight1 from '../assets/Pacman/PacmanR1.png';
import pacmanRight2 from '../assets/Pacman/PacmanR2.png';

const Pacman = ({ pacmanPosition, pacmanDirection, animationFrame }) => {
    // Choose the appropriate image based on direction and animation frame
    let pacmanImage = pacmanGif; // Default is the GIF

    if (pacmanDirection === 'up') {
        pacmanImage = animationFrame === 1 ? pacmanUp1 : pacmanUp2;
    } else if (pacmanDirection === 'down') {
        pacmanImage = animationFrame === 1 ? pacmanDown1 : pacmanDown2;
    } else if (pacmanDirection === 'left') {
        pacmanImage = animationFrame === 1 ? pacmanLeft1 : pacmanLeft2;
    } else if (pacmanDirection === 'right') {
        pacmanImage = animationFrame === 1 ? pacmanRight1 : pacmanRight2;
    }

    // Style to position Pacman based on its current position on the map
    const pacmanStyle = {
        position: 'absolute',
        left: `${pacmanPosition.x * 32}px`, 
        top: `${pacmanPosition.y * 32}px`,
        width: '32px',
        height: '32px'
    };

    return (
        <img src={pacmanImage} alt="Pacman" style={pacmanStyle} />
    );
};

export default Pacman;