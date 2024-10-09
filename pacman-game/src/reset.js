// reset.js

export const resetGamePositions = (setPacmanPosition, setDirection, setMap, setGhosts, mapLevel1, getInitialGhostPositions) => {
    setPacmanPosition({ x: 8, y: 12 }); // Reset Pacman's position
    setDirection('right'); // Reset direction
    setMap(mapLevel1); // Reset the map
    setGhosts(getInitialGhostPositions()); // Reset ghosts' positions
};
