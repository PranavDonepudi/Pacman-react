import React from 'react';
import pacmanImage from '../assets/pacman.png';
import ghostRedImage from '../assets/Ghost/ghost-red.png';
import ghostBlueImage from '../assets/Ghost/ghost-blue.png';
import ghostOrangeImage from '../assets/Ghost/ghost-orange.png';
import ghostGreenImage from '../assets/Ghost/ghost-green.png'; // Assuming this is the yellow ghost
import './Cell.css';

function Cell({ type, ghostType }) {
    let className = 'cell';
    let content = null;

    if (type === 1) {
        className += ' wall';
    } else if (type === 0) {
        className += ' path';
    } else if (type === 2) {
        className += ' pacman';
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
