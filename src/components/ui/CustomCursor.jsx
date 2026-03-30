import { useEffect, useRef, useState } from 'react';
import { useIsMobile } from '../../hooks/useMediaQuery';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const followerRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const isMobile = useIsMobile();
  const pos = useRef({ x: -100, y: -100 });
  const followerPos = useRef({ x: -100, y: -100 });
  const rafRef = useRef(null);

  useEffect(() => {
    if (isMobile) return;

    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const handleHover = () => setHovered(true);
    const handleUnhover = () => setHovered(false);

    window.addEventListener('mousemove', move);
    document.querySelectorAll('a, button, [role="button"]').forEach((el) => {
      el.addEventListener('mouseenter', handleHover);
      el.addEventListener('mouseleave', handleUnhover);
    });

    const lerp = (a, b, t) => a + (b - a) * t;

    const animate = () => {
      followerPos.current.x = lerp(followerPos.current.x, pos.current.x, 0.1);
      followerPos.current.y = lerp(followerPos.current.y, pos.current.y, 0.1);

      if (cursorRef.current) {
        cursorRef.current.style.left = `${pos.current.x}px`;
        cursorRef.current.style.top = `${pos.current.y}px`;
      }
      if (followerRef.current) {
        followerRef.current.style.left = `${followerPos.current.x}px`;
        followerRef.current.style.top = `${followerPos.current.y}px`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', move);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <div
        ref={cursorRef}
        style={{
          width: hovered ? '8px' : '16px',
          height: hovered ? '8px' : '16px',
          background: 'var(--color-primary)',
          borderRadius: '50%',
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference',
          transition: 'width 0.3s ease, height 0.3s ease',
        }}
      />
      <div
        ref={followerRef}
        style={{
          width: hovered ? '60px' : '40px',
          height: hovered ? '60px' : '40px',
          border: `1px solid ${hovered ? 'var(--color-primary)' : 'rgba(200,164,92,0.5)'}`,
          borderRadius: '50%',
          position: 'fixed',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease',
        }}
      />
    </>
  );
}
