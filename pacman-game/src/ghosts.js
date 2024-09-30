// ghosts.js
export function getInitialGhostPositions() {
    return [
        { 
            x: 7, 
            y: 3, 
            type: 'red', 
            released: false, 
            delay: 0, 
            initialPosition: { x: 7, y: 3 } 
        },
        { 
            x: 8, 
            y: 3, 
            type: 'blue', 
            released: false, 
            delay: 5000, 
            initialPosition: { x: 8, y: 3 } 
        },
        { 
            x: 7, 
            y: 4, 
            type: 'orange', 
            released: false, 
            delay: 10000,  
            initialPosition: { x: 7, y: 4 } 
        },
        { 
            x: 8, 
            y: 4, 
            type: 'green', 
            released: false, 
            delay: 15000, 
            initialPosition: { x: 8, y: 4 } 
        }
    ];
}
