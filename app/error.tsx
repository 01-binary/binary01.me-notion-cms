'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const GlobalErrorPage = ({ error, reset }: ErrorPageProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section
      className="
        flex h-[calc(100vh-128px-115px)] flex-col items-center justify-center
        gap-4 pb-[120px]
      "
    >
      <div className="text-xl">오류가 발생했어요! 😱</div>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="
            rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors
            hover:bg-blue-600
          "
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="
            rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors
            hover:bg-gray-300
            dark:bg-gray-700 dark:text-gray-200
            dark:hover:bg-gray-600
          "
        >
          홈으로
        </Link>
      </div>
    </section>
  );
};

export default GlobalErrorPage;
