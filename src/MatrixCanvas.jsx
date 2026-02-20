import { useEffect, useRef, useCallback } from 'react';

/**
 * Matrix Digital Rain — HTML5 Canvas Component
 * 
 * Features:
 * - Characters: 0-9, A-Z, Japanese katakana
 * - Randomized column speed
 * - Trailing fade with rgba(0,0,0,0.05)
 * - Neon green gradient glow
 * - requestAnimationFrame with proper cleanup
 * - Window resize handling
 * - Mouse interaction: brightness pulse near cursor
 */

// Character set: digits + uppercase + katakana
const CHARS = '01';

const FONT_SIZE = 14;
const MOUSE_RADIUS = 180;
const MOUSE_BRIGHTNESS = 1.8;

export default function MatrixCanvas({ intensify = false }) {
    const canvasRef = useRef(null);
    const animFrameRef = useRef(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const columnsRef = useRef([]);
    const speedsRef = useRef([]);
    const lastTimeRef = useRef(0);
    const throttleMs = 33; // ~30fps for performance

    const initColumns = useCallback((width) => {
        const colCount = Math.ceil(width / FONT_SIZE);
        const columns = [];
        const speeds = [];
        for (let i = 0; i < colCount; i++) {
            columns[i] = Math.random() * -100; // Stagger start
            speeds[i] = 0.3 + Math.random() * 0.7; // Random speed multiplier
        }
        columnsRef.current = columns;
        speedsRef.current = speeds;
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initColumns(width);
        };

        resize();

        // Mouse tracking
        const onMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('resize', resize);

        const draw = (timestamp) => {
            animFrameRef.current = requestAnimationFrame(draw);

            // Throttle
            if (timestamp - lastTimeRef.current < throttleMs) return;
            lastTimeRef.current = timestamp;

            const columns = columnsRef.current;
            const speeds = speedsRef.current;
            const mouse = mouseRef.current;

            // Fade effect — the key to the trailing look
            const fadeAlpha = intensify ? 0.03 : 0.05;
            ctx.fillStyle = `rgba(5, 8, 15, ${fadeAlpha})`;
            ctx.fillRect(0, 0, width, height);

            ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`;

            for (let i = 0; i < columns.length; i++) {
                const x = i * FONT_SIZE;
                const y = columns[i] * FONT_SIZE;

                // Random character
                const char = CHARS[Math.floor(Math.random() * CHARS.length)];

                // Mouse proximity brightness
                const dx = x - mouse.x;
                const dy = y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const proximity = Math.max(0, 1 - dist / MOUSE_RADIUS);

                if (proximity > 0) {
                    // Bright pulse near cursor
                    const brightness = 159 + Math.floor(proximity * 96);
                    const alpha = 0.7 + proximity * 0.3 * MOUSE_BRIGHTNESS;
                    ctx.fillStyle = `rgba(0, 255, ${brightness}, ${Math.min(1, alpha)})`;
                    ctx.shadowColor = `rgba(0, 255, 159, ${proximity * 0.8})`;
                    ctx.shadowBlur = 12 * proximity;
                } else {
                    // Normal green with slight variation
                    const greenVal = 200 + Math.floor(Math.random() * 55);
                    const alpha = intensify ? (0.7 + Math.random() * 0.3) : (0.4 + Math.random() * 0.35);
                    ctx.fillStyle = `rgba(0, ${greenVal}, ${Math.floor(greenVal * 0.6)}, ${alpha})`;
                    ctx.shadowColor = 'transparent';
                    ctx.shadowBlur = 0;
                }

                ctx.fillText(char, x, y);

                // Leading bright character
                if (Math.random() < 0.02) {
                    ctx.fillStyle = intensify
                        ? 'rgba(180, 255, 230, 0.95)'
                        : 'rgba(200, 255, 230, 0.9)';
                    ctx.shadowColor = 'rgba(0, 255, 159, 0.6)';
                    ctx.shadowBlur = 8;
                    ctx.fillText(char, x, y);
                    ctx.shadowBlur = 0;
                }

                // Reset shadow
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;

                // Advance column
                const speed = intensify ? speeds[i] * 1.8 : speeds[i];
                columns[i] += speed;

                // Reset when off screen + random chance for visual variation
                if (y > height && Math.random() > 0.975) {
                    columns[i] = Math.random() * -20;
                    speeds[i] = 0.3 + Math.random() * 0.7;
                }
            }
        };

        animFrameRef.current = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(animFrameRef.current);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', resize);
        };
    }, [intensify, initColumns]);

    return (
        <canvas
            ref={canvasRef}
            className="matrix-canvas"
            aria-hidden="true"
        />
    );
}
