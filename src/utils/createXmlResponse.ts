import { NextResponse } from 'next/server';

/**
 * XML 성공 응답을 생성합니다.
 *
 * @param xml - XML 문자열
 * @param cacheMaxAge - CDN 캐시 시간 (초), 기본값 300
 * @returns NextResponse with XML content
 */
export const createXmlResponse = (xml: string, cacheMaxAge = 300): NextResponse => {
  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': `public, s-maxage=${cacheMaxAge}, stale-while-revalidate=${cacheMaxAge * 2}`,
    },
  });
};

/**
 * XML 에러 응답을 생성합니다.
 *
 * @param message - 에러 메시지
 * @param error - 에러 객체 (콘솔 로깅용)
 * @returns NextResponse with error message
 */
export const createXmlErrorResponse = (message: string, error?: unknown): NextResponse => {
  if (error) {
    console.error(message, error);
  }
  return new NextResponse(`Internal Server Error: ${message}`, {
    status: 500,
    headers: { 'Content-Type': 'text/plain' },
  });
};
