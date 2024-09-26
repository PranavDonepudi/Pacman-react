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
import './Cell.css';

function Cell({ type, ghostType, pacmanDirection, animationFrame }) {
    let className = 'cell';
    let content = null;

    if (type === 1) {
        className += ' wall';
    } else if (type === 0) {
        className += ' path';
    } else if (type === 2) {
        className += ' pacman';
        // Choose Pacman image based on direction and animation frame
        let pacmanImage;
        switch (pacmanDirection) {
            case 'up':
                pacmanImage = animationFrame === 1 ? pacmanUp1 : pacmanUp2;
                break;
            case 'down':
                pacmanImage = animationFrame === 1 ? pacmanDown1 : pacmanDown2;
                break;
            case 'left':
                pacmanImage = animationFrame === 1 ? pacmanLeft1 : pacmanLeft2;
                break;
            case 'right':
                pacmanImage = animationFrame === 1 ? pacmanRight1 : pacmanRight2;
                break;
            default:
                pacmanImage = pacmanRight1; // Default image
                break;
        }
        content = <img src={pacmanImage} alt="Pacman" className="pacman-image" />;
    } else if (type === 3) {
        className += ' pellet';
    } else if (type === 4) {
        className += ' ghost';
        // Choose the ghost image based on the ghostType prop
        switch (ghostType) {
            case 'red':
                content = <img src={ghostRedImage} alt="Red Ghost" className="ghost-image" />;
                break;
            case 'blue':
                content = <img src={ghostBlueImage} alt="Blue Ghost" className="ghost-image" />;
                break;
            case 'orange':
                content = <img src={ghostOrangeImage} alt="Orange Ghost" className="ghost-image" />;
                break;
            case 'green':
                content = <img src={ghostGreenImage} alt="Green Ghost" className="ghost-image" />;
                break;
            default:
                content = <img src={ghostRedImage} alt="Ghost" className="ghost-image" />;
                break;
        }
    }
    return <div className={className}>{content}</div>;
}

export default Cell;
