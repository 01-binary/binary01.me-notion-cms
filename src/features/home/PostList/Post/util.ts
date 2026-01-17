/** 최대 틸트 각도 (degrees) */
const MAX_TILT_ANGLE = 3;

/**
 * 마우스 위치에 따른 3D 틸트 회전 각도를 계산합니다.
 *
 * "텐트" 형태의 선형 보간 곡선을 생성합니다:
 * - 왼쪽 가장자리 (x=0): +3도 (오른쪽으로 기울임)
 * - 중앙 (x=maxX/2): 0도 (평평함)
 * - 오른쪽 가장자리 (x=maxX): -3도 (왼쪽으로 기울임)
 *
 * 이를 통해 마우스를 따라가는 자연스러운 parallax 효과를 만듭니다.
 *
 * @param mousePosition - 요소 내 마우스 X 또는 Y 위치 (0 ~ containerSize)
 * @param containerSize - 컨테이너 요소의 너비 또는 높이 (px)
 * @returns 회전 각도 (degrees), 범위: [-3, 3]
 *
 * @example
 * // 300px 너비 카드의 왼쪽 가장자리에 마우스가 있을 때
 * calculateTiltAngle(0, 300) // 3 반환 (오른쪽으로 기울임)
 *
 * // 300px 너비 카드의 중앙에 마우스가 있을 때
 * calculateTiltAngle(150, 300) // 0 반환 (평평함)
 *
 * // 300px 너비 카드의 오른쪽 가장자리에 마우스가 있을 때
 * calculateTiltAngle(300, 300) // -3 반환 (왼쪽으로 기울임)
 */
export const calculateTiltAngle = (mousePosition: number, containerSize: number): number => {
  const halfSize = containerSize / 2;

  // 왼쪽/위쪽 절반: MAX_TILT_ANGLE에서 0으로 선형 보간
  // 오른쪽/아래쪽 절반: 0에서 -MAX_TILT_ANGLE로 선형 보간
  const leftSlope = -MAX_TILT_ANGLE / halfSize;
  const rightSlope = -MAX_TILT_ANGLE / halfSize;

  if (mousePosition <= halfSize) {
    return MAX_TILT_ANGLE + leftSlope * mousePosition;
  } else {
    return rightSlope * (mousePosition - halfSize);
  }
};
