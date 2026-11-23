import Link from 'next/link';

import type { PostMeta } from '@/interfaces';
import { getCachedPostsMeta } from '@/utils/fetchNotionPostsMeta';

const linkClassName = [
  'flex flex-col gap-1 rounded-2xl border border-[rgb(var(--color-border))] p-4',
  'hover:bg-[hsla(44,6%,50%,.05)] dark:hover:bg-[hsla(0,0%,100%,.05)]',
].join(' ');

interface AdjacentPostLinkProps {
  direction: 'older' | 'newer';
  post: PostMeta;
  className?: string;
}

const AdjacentPostLink = ({ direction, post, className = '' }: AdjacentPostLinkProps) => {
  return (
    <Link
      href={`/posts/${post.slug}`}
      prefetch={false}
      className={`
        ${linkClassName}
        ${className}
      `}
    >
      <span className="text-[12px] text-[rgb(var(--color-text-secondary))]">
        {direction === 'older' ? (
          <>
            <span aria-hidden="true">← </span>이전 글
          </>
        ) : (
          <>
            다음 글<span aria-hidden="true"> →</span>
          </>
        )}
      </span>
      <span className="text-[16px] font-medium">{post.title}</span>
    </Link>
  );
};

interface PostNavigationProps {
  slug: string;
}

/**
 * 글 아래에 이전(더 오래된) 글과 다음(더 최신) 글 링크를 보여줍니다.
 *
 * 목록은 날짜 내림차순이므로 앞 인덱스가 더 최신 글입니다.
 */
const PostNavigation = async ({ slug }: PostNavigationProps) => {
  const posts = await getCachedPostsMeta();
  const currentIndex = posts.findIndex((post) => post.slug === slug);

  if (currentIndex === -1) return null;

  const newerPost = posts[currentIndex - 1];
  const olderPost = posts[currentIndex + 1];

  if (!newerPost && !olderPost) return null;

  return (
    <nav
      aria-label="이전 글, 다음 글"
      className="
        mt-10 grid grid-cols-1 gap-4
        md:grid-cols-2
      "
    >
      {olderPost ? (
        <AdjacentPostLink
          direction="older"
          post={olderPost}
        />
      ) : null}
      {newerPost ? (
        <AdjacentPostLink
          direction="newer"
          post={newerPost}
          className="
            text-right
            md:col-start-2
          "
        />
      ) : null}
    </nav>
  );
};

export default PostNavigation;
