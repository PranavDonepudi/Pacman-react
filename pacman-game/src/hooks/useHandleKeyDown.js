import { useEffect } from 'react';

const useHandleKeyDown = (setNextDirection) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.key) {
                case 'ArrowUp':
                    setNextDirection('up');
                    break;
                case 'ArrowDown':
                    setNextDirection('down');
                    break;
                case 'ArrowLeft':
                    setNextDirection('left');
                    break;
                case 'ArrowRight':
                    setNextDirection('right');
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [setNextDirection]);
};

export default useHandleKeyDown;
