import React from 'react';
import { motion } from 'framer-motion';
import { motionTokens } from '../../motion/config';
import { useReducedMotion } from '../../motion/hooks/useReducedMotion';

interface TextRevealProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'p' | 'span';
  delay?: number;
  accentClass?: string;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className,
  as: Tag = 'span',
  delay = 0,
  accentClass,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const words = text.split(' ');

  if (prefersReducedMotion) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={className} aria-label={text}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className={`inline-block mr-[0.25em] last:mr-0 ${accentClass || ''}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: delay + index * 0.1,
            ease: motionTokens.easing.sharp,
          }}
          whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
};
