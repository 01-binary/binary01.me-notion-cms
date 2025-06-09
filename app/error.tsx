'use client';

import { useEffect } from 'react';

interface ErrorPageProps {
  error: Error & { digest?: string };
}

const GlobalErrorPage = ({ error }: ErrorPageProps) => {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex h-[calc(100vh_-_128px_-_115px)] flex-col items-center justify-center gap-4 pb-[120px]">
      <div className="text-xl">오류가 발생했어요! 😱</div>
    </section>
  );
};

export default GlobalErrorPage;
