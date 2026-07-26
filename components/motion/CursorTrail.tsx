import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../motion/hooks/useReducedMotion';

interface CursorPoint {
  x: number;
  y: number;
  id: number;
  timestamp: number;
}

const TRAIL_COLORS = [
  'rgba(229, 93, 43, 0.6)',  // brand-touch (updated)
  'rgba(74, 111, 165, 0.5)',  // brand-accent (updated)
  'rgba(184, 149, 110, 0.4)',  // brand-gold (updated)
];

export const CursorTrail: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const [points, setPoints] = useState<CursorPoint[]>([]);
  const pointIdRef = useRef(0);
  const maxPoints = 15;
  const timeoutRef = useRef<number | undefined>(undefined);
  const isMovingRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      isMovingRef.current = true;
      
      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const newPoint: CursorPoint = {
        x: e.clientX,
        y: e.clientY,
        id: pointIdRef.current++,
        timestamp: Date.now(),
      };

      setPoints(prev => {
        const updated = [newPoint, ...prev].slice(0, maxPoints);
        return updated;
      });

      // Set timeout to detect when mouse stops
      timeoutRef.current = setTimeout(() => {
        isMovingRef.current = false;
        setPoints([]); // Clear points when mouse stops
      }, 100);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998] hidden md:block" aria-hidden="true">
      {points.map((point, index) => {
        const scale = 1 - (index / maxPoints) * 0.8;
        const opacity = 1 - (index / maxPoints) * 0.9;
        const size = 6 + (index / maxPoints) * 8; // Smaller sizes: 6-14px
        const color = TRAIL_COLORS[index % TRAIL_COLORS.length];
        
        return (
          <motion.div
            key={point.id}
            className="absolute rounded-full"
            style={{
              left: point.x - size / 2,
              top: point.y - size / 2,
              width: size,
              height: size,
              background: color,
              filter: 'blur(4px)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale, opacity }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        );
      })}
    </div>
  );
};
