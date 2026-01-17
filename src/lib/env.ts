/**
 * 환경변수 중앙 관리 모듈
 *
 * 모든 환경변수 접근을 이 파일을 통해 수행합니다.
 * 모듈 로드 시점에 필수 환경변수를 검증하여 런타임 에러를 방지합니다.
 */

type EnvVarName =
  | 'NOTION_TOKEN'
  | 'NOTION_POST_DATABASE_ID'
  | 'NOTION_PROFILE_ID'
  | 'NOTION_ABOUT_ID'
  | 'BLOG_URL';

/**
 * 환경변수를 가져옵니다. 필수 변수가 없으면 에러를 던집니다.
 */
function getEnvVar(name: EnvVarName, required = true): string {
  const value = process.env[name];

  if (!value && required) {
    throw new Error(`Environment variable ${name} is not defined`);
  }

  return value ?? '';
}

/**
 * 타입 안전한 환경변수 객체
 *
 * @example
 * import { env } from '@/lib/env';
 * const databaseId = env.notionPostDatabaseId;
 */
export const env = {
  /** Notion API 토큰 */
  notionToken: getEnvVar('NOTION_TOKEN'),

  /** Notion 포스트 데이터베이스 ID */
  notionPostDatabaseId: getEnvVar('NOTION_POST_DATABASE_ID'),

  /** Notion 프로필 이미지 ID */
  notionProfileId: getEnvVar('NOTION_PROFILE_ID'),

  /** Notion About 페이지 ID */
  notionAboutId: getEnvVar('NOTION_ABOUT_ID'),

  /** 블로그 URL (선택적) */
  blogUrl: getEnvVar('BLOG_URL', false),
} as const;

export type Env = typeof env;
