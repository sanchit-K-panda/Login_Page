import { useState, useCallback } from 'react';
import MatrixCanvas from './MatrixCanvas';
import LoginPanel from './LoginPanel';

export default function App() {
  const [matrixIntensify, setMatrixIntensify] = useState(false);
  const [screenGlitch, setScreenGlitch] = useState(false);

  const handleAuthResult = useCallback((success) => {
    if (success) {
      // Trigger screen glitch + matrix intensification
      setScreenGlitch(true);
      setMatrixIntensify(true);

      // Remove glitch class after animation
      setTimeout(() => setScreenGlitch(false), 600);
    }
  }, []);

  return (
    <div className={`app-container ${screenGlitch ? 'screen-glitch' : ''}`}>
      {/* Matrix Digital Rain Background */}
      <MatrixCanvas intensify={matrixIntensify} />

      {/* Scanlines Overlay */}
      <div className="scanlines" />

      {/* Login Panel */}
      <LoginPanel onAuthResult={handleAuthResult} />
    </div>
  );
}
