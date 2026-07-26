import React from 'react';
import { motion } from 'framer-motion';
import { motionTokens } from '../../motion/config';
import { useReducedMotion } from '../../motion/hooks/useReducedMotion';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

const offsets = {
  up: { y: 24 },
  down: { y: -24 },
  left: { x: 24 },
  right: { x: -24 },
  none: {},
};

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  className,
  direction = 'up',
}) => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: motionTokens.duration.slow,
        delay,
        ease: motionTokens.easing.sharp,
      }}
    >
      {children}
    </motion.div>
  );
};
