'use client';

import { useCallback } from 'react';

/** 최대 틸트 각도 (degrees) */
const MAX_TILT_ANGLE = 3;

/** 3D 카드 효과를 위한 perspective 값 (px) */
const CARD_PERSPECTIVE = 350;

/**
 * 마우스 위치에 따른 3D 틸트 회전 각도를 계산합니다.
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
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const rotateY = calculateTiltAngle(e.nativeEvent.offsetX, target.offsetWidth);
    const rotateX = -calculateTiltAngle(e.nativeEvent.offsetY, target.offsetHeight);
    target.style.transform = `perspective(${CARD_PERSPECTIVE}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = `perspective(${CARD_PERSPECTIVE}px) rotateX(0deg) rotateY(0deg)`;
  }, []);

  return { handleMouseMove, handleMouseLeave };
};

export default useTiltEffect;
