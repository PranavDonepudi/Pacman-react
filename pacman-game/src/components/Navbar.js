import React from 'react';
import heartImage from '../assets/heart.png'; // Import the heart image
import './Navbar.css';

function Navbar({ lives, level }) {
    // Create an array of heart icons for the lives
    const renderLives = () => {
        let livesIcons = [];
        for (let i = 0; i < lives; i++) {
            livesIcons.push(
                <img
                    key={i}
                    src={heartImage}
                    alt="Heart"
                    className="heart-icon"
                />
            );
        }
        return livesIcons;
    };

    return (
        <div className="navbar">
            <div className="navbar-title">Pacman Game</div>
            <div className="navbar-info">
                <div className="level">Level: {level}</div>
                <div className="lives">
                    Lives: {renderLives()}
                </div>
            </div>
        </div>
    );
}

export default Navbar;
