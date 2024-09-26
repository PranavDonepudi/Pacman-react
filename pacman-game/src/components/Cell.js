import React from 'react';
import pacmanUp1 from '../assets/Pacman/PacmanU1.png';
import pacmanUp2 from '../assets/Pacman/PacmanU2.png';
import pacmanDown1 from '../assets/Pacman/PacmanD1.png';
import pacmanDown2 from '../assets/Pacman/PacmanD2.png';
import pacmanLeft1 from '../assets/Pacman/PacmanL1.png';
import pacmanLeft2 from '../assets/Pacman/PacmanL2.png';
import pacmanRight1 from '../assets/Pacman/PacmanR1.png';
import pacmanRight2 from '../assets/Pacman/PacmanR2.png';
import ghostRedImage from '../assets/Ghost/ghost-red.png';
import ghostBlueImage from '../assets/Ghost/ghost-blue.png';
import ghostOrangeImage from '../assets/Ghost/ghost-orange.png';
import ghostGreenImage from '../assets/Ghost/ghost-green.png';
import blueEyedGhostImage from '../assets/Ghost/ghost-blue-eyed.png';
import fruitImage from '../assets/fruit.png'; 
import './Cell.css';

function Cell({ type, ghostType, pacmanDirection, animationFrame, ghostsBlueEyed }) {
    let className = 'cell';
    let content = null;

    // Choose Pacman image based on direction and animation frame
    const getPacmanImage = () => {
        switch (pacmanDirection) {
            case 'up':
                return animationFrame === 1 ? pacmanUp1 : pacmanUp2;
            case 'down':
                return animationFrame === 1 ? pacmanDown1 : pacmanDown2;
            case 'left':
                return animationFrame === 1 ? pacmanLeft1 : pacmanLeft2;
            case 'right':
                return animationFrame === 1 ? pacmanRight1 : pacmanRight2;
            default:
                return pacmanRight1;
        }
    };

    // Choose ghost image based on type and blue-eyed state
    const getGhostImage = () => {
        if (ghostsBlueEyed) {
            return blueEyedGhostImage;
        }
        switch (ghostType) {
            case 'red':
                return ghostRedImage;
            case 'blue':
                return ghostBlueImage;
            case 'orange':
                return ghostOrangeImage;
            case 'green':
                return ghostGreenImage;
            default:
                return ghostRedImage;
        }
    };

    // Set cell content and classes based on type
    if (type === 1) {
        className += ' wall';
    } else if (type === 0) {
        className += ' path';
    } else if (type === 2) {
        className += ' pacman';
        content = <img src={getPacmanImage()} alt="Pacman" className="pacman-image" />;
    } else if (type === 3) {
        className += ' pellet';
    } else if (type === 4) {
        className += ' ghost';
        content = <img src={getGhostImage()} alt={`${ghostType} Ghost`} className="ghost-image" />;
    } else if (type === 5) {
        className += ' fruit';
        content = <img src={fruitImage} alt="Fruit" className="fruit-image" />;
    }

    return <div className={className}>{content}</div>;
}

export default Cell;
