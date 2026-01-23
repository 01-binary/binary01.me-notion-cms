'use client';

/** 최대 틸트 각도 (degrees) */
const MAX_TILT_ANGLE = 3;

/** 3D 카드 효과를 위한 perspective 값 (px) */
const CARD_PERSPECTIVE = 350;

/**
 * 마우스 위치에 따른 3D 틸트 회전 각도를 계산합니다.
 *
 * 컨테이너를 반으로 나누어 선형 보간:
 * - 왼쪽 절반 (0 → half): +MAX_TILT → 0 (왼쪽으로 기울어짐 → 평평)
 * - 오른쪽 절반 (half → full): 0 → -MAX_TILT (평평 → 오른쪽으로 기울어짐)
 *
 * 수학 공식: y = slope * x + b (선형 방정식)
 * - slope(기울기) = -MAX_TILT_ANGLE / halfSize
 *
 * @example
 * calculateTiltAngle(0, 100)   // → +3 (왼쪽 끝)
 * calculateTiltAngle(50, 100)  // → 0  (중앙)
 * calculateTiltAngle(100, 100) // → -3 (오른쪽 끝)
 */
const calculateTiltAngle = (mousePosition: number, containerSize: number): number => {
  const halfSize = containerSize / 2;
  const slope = -MAX_TILT_ANGLE / halfSize;

  if (mousePosition <= halfSize) {
    return MAX_TILT_ANGLE + slope * mousePosition;
  }
  return slope * (mousePosition - halfSize);
};

/**
 * 3D 틸트 효과를 위한 마우스 이벤트 핸들러를 반환합니다.
 */
const useTiltEffect = () => {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const rotateY = calculateTiltAngle(e.nativeEvent.offsetX, target.offsetWidth);
    const rotateX = -calculateTiltAngle(e.nativeEvent.offsetY, target.offsetHeight);
    target.style.transform = `perspective(${CARD_PERSPECTIVE}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = `perspective(${CARD_PERSPECTIVE}px) rotateX(0deg) rotateY(0deg)`;
  };

  return { handleMouseMove, handleMouseLeave };
};

export default useTiltEffect;
