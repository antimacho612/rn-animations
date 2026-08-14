export const TAGS = {
  BASIC: '基本',
  PERFORMANCE: 'パフォーマンス',

  OPACITY: 'opacity',
  TRANSFORM: 'transform',

  SPRING: 'spring',

  LOOP: 'loop',
  PARALLEL: 'parallel',
  SEQUENCE: 'sequence',

  SHARED_VALUE: 'useSharedValue',
  INTERPOLATE: 'interpolate',

  GESTURE: 'gesture',
  LAYOUT_ANIMATION: 'layout animation',
  ENTERING: 'entering',
  SCROLL: 'scroll',
} as const;

export type Tag = (typeof TAGS)[keyof typeof TAGS];
