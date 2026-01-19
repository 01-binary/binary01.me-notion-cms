'use client';

import Image from 'next/image';
import { memo, useCallback, useState } from 'react';
import { siteConfig } from 'site.config';

import { DEFAULT_BLUR_BASE64 } from '@/assets/constants';

/** 최대 틸트 각도 (degrees) */
const MAX_TILT_ANGLE = 3;

/** 3D 카드 효과를 위한 perspective 값 (px) */
const CARD_PERSPECTIVE = 350;

/**
 * 마우스 위치에 따른 3D 틸트 회전 각도를 계산합니다.
 *
 * 선형 보간(linear interpolation) 알고리즘으로,
 * 컨테이너 중심을 기준으로 양쪽 끝까지 점진적으로 회전각이 변화합니다.
 *
 * 수식: 중심 위치를 기준으로 좌우 대칭인 일차함수
 * - 좌측 끝 (x=0): +MAX_TILT_ANGLE (양수, 왼쪽으로 기울어짐)
 * - 중심 (x=halfSize): 0도 (평평함)
 * - 우측 끝 (x=containerSize): -MAX_TILT_ANGLE (음수, 오른쪽으로 기울어짐)
 *
 * @param mousePosition - 마우스의 X 또는 Y 좌표 (컨테이너 기준, 0부터 시작)
 * @param containerSize - 컨테이너의 너비 또는 높이
 * @returns 회전 각도 (도 단위, -MAX_TILT_ANGLE ~ +MAX_TILT_ANGLE)
 *
 * @example
 * // 너비 300px 컨테이너에서
 * calculateTiltAngle(0, 300)     // 3 (좌측 끝)
 * calculateTiltAngle(150, 300)   // 0 (중심)
 * calculateTiltAngle(300, 300)   // -3 (우측 끝)
 */
const calculateTiltAngle = (mousePosition: number, containerSize: number): number => {
  const halfSize = containerSize / 2;
  // 기울기: 중심에서 양쪽 끝까지 MAX_TILT_ANGLE만큼 변하므로
  // 1픽셀당 (MAX_TILT_ANGLE / halfSize)도 변함. 음수인 이유: 우측으로 갈수록 음수 회전
  const slope = -MAX_TILT_ANGLE / halfSize;

  if (mousePosition <= halfSize) {
    // 좌측 영역: 좌측 끝(+MAX_TILT_ANGLE)에서 중심(0)으로 감소
    return MAX_TILT_ANGLE + slope * mousePosition;
  }
  // 우측 영역: 중심(0)에서 우측 끝(-MAX_TILT_ANGLE)으로 감소
  return slope * (mousePosition - halfSize);
};

interface PostCoverImageProps {
  src: string;
  alt: string;
  blurDataURL?: string;
}

/**
 * 3D 틸트 효과가 적용된 포스트 커버 이미지 컴포넌트
 *
 * - 마우스 hover 시 3D 카드 회전 효과
 * - 이미지 로드 실패 시 fallback UI 표시
 * - blur placeholder로 로딩 UX 개선
 */
const PostCoverImage = ({ src, alt, blurDataURL }: PostCoverImageProps) => {
  const [hasImageLoadError, setHasImageLoadError] = useState(false);

  /** 마우스 이동 시 3D 틸트 효과 적용 */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const rotateY = calculateTiltAngle(e.nativeEvent.offsetX, target.offsetWidth);
    const rotateX = -calculateTiltAngle(e.nativeEvent.offsetY, target.offsetHeight);
    target.style.transform = `perspective(${CARD_PERSPECTIVE}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }, []);

  /** 마우스가 벗어나면 카드 원위치 */
  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = `perspective(${CARD_PERSPECTIVE}px) rotateX(0deg) rotateY(0deg)`;
  }, []);

  const handleImageError = useCallback(() => {
    setHasImageLoadError(true);
  }, []);

  return (
    <div
      className="
        relative h-[190px] w-full overflow-hidden rounded-2xl
        shadow-[2px_2px_8px_4px_hsla(0,0%,6%,.1)]
      "
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {!hasImageLoadError ? (
        <Image
          className="
            object-cover transition-transform
            group-hover:scale-105 group-hover:brightness-125
          "
          src={src}
          alt={alt}
          fill
          placeholder="blur"
          blurDataURL={blurDataURL || DEFAULT_BLUR_BASE64}
          onError={handleImageError}
        />
      ) : (
        <div className="flex h-full items-center justify-center">
          <span className="text-[28px] font-bold">{siteConfig.blogName}</span>
        </div>
      )}
    </div>
  );
};

export default memo(PostCoverImage);
