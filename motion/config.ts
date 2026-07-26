export const motionTokens = {
  duration: { fast: 0.2, normal: 0.5, slow: 0.8, reveal: 1.2 },
  easing: {
    sharp: [0.16, 1, 0.3, 1] as const,
    smooth: [0.4, 0, 0.2, 1] as const,
  },
  stagger: 0.08,
};
