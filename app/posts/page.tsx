import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from 'site.config';

import { getCachedPostsMeta } from '@/utils/fetchNotionPostsMeta';

const PAGE_URL = `${siteConfig.url}/posts`;

export const metadata: Metadata = {
  title: 'Posts',
  description: `${siteConfig.blogName}의 모든 글 목록`,
  alternates: { canonical: PAGE_URL },
  openGraph: { url: PAGE_URL },
};

const linkClassName = [
  'flex items-baseline justify-between gap-4 rounded-lg px-2 py-3',
  'hover:bg-[hsla(44,6%,50%,.05)] dark:hover:bg-[hsla(0,0%,100%,.05)]',
].join(' ');

/**
 * 모든 글을 서버 HTML의 링크로 나열하는 전체 목록 페이지.
 *
 * 홈은 무한 스크롤이라 첫 HTML에 최신 글 일부만 담기므로,
 * 크롤러가 링크만 따라가도 모든 글에 닿을 수 있게 하는 경로입니다.
 */
const PostsPage = async () => {
  const posts = await getCachedPostsMeta();

  return (
    <section className="mx-auto max-w-[900px] px-4">
      <h1 className="text-[28px] font-bold">
        Posts{' '}
        <span
          className="
            text-[16px] font-normal text-[rgb(var(--color-text-secondary))]
          "
        >
          ({posts.length})
        </span>
      </h1>
      <div className="h-4" />
      <ul className="border-t border-[rgb(var(--color-border))] pt-2">
        {posts.map(({ id, slug, title, published }) => (
          <li key={id}>
            <Link
              href={`/posts/${slug}`}
              prefetch={false}
              className={linkClassName}
            >
              <span className="text-[16px] font-medium">{title}</span>
              <time
                className="
                  shrink-0 text-[12px] text-[rgb(var(--color-text-secondary))]
                "
              >
                {published}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PostsPage;
