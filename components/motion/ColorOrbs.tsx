import React from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../motion/hooks/useReducedMotion';

const ORBS = [
  { color: 'rgba(242, 101, 34, 0.15)', size: 380, x: '8%', y: '12%', duration: 18, dx: 50, dy: 35, blur: 120 },
  { color: 'rgba(96, 125, 139, 0.12)', size: 320, x: '78%', y: '18%', duration: 22, dx: -40, dy: 50, blur: 100 },
  { color: 'rgba(197, 160, 101, 0.10)', size: 240, x: '65%', y: '72%', duration: 20, dx: 30, dy: -45, blur: 90 },
  { color: 'rgba(157, 172, 157, 0.08)', size: 280, x: '15%', y: '68%', duration: 24, dx: -35, dy: -30, blur: 110 },
  { color: 'rgba(96, 125, 139, 0.06)', size: 420, x: '45%', y: '45%', duration: 28, dx: 20, dy: 20, blur: 140 },
];

interface ColorOrbsProps {
  variant?: 'light' | 'dark';
}

export const ColorOrbs: React.FC<ColorOrbsProps> = ({ variant = 'light' }) => {
  const prefersReducedMotion = useReducedMotion();
  const opacity = variant === 'dark' ? 0.8 : 1;

  if (prefersReducedMotion) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: orb.color,
            opacity,
            filter: `blur(${orb.blur}px)`,
          }}
          animate={{
            x: [0, orb.dx, -orb.dx * 0.6, 0],
            y: [0, orb.dy, -orb.dy * 0.7, 0],
            scale: [1, 1.12, 0.92, 1],
            opacity: [opacity, opacity * 1.2, opacity * 0.8, opacity],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: [0.4, 0, 0.2, 1],
          }}
        />
      ))}
    </div>
  );
};
