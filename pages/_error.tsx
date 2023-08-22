import { NextPage, NextPageContext } from 'next';

interface ErrorProps {
  statusCode: number | null;
}

const ErrorPage: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <section className="flex h-[calc(100vh_-_128px_-_115px)] flex-col items-center justify-center gap-1 pb-[120px]">
      {statusCode ? <div className="text-[60px] font-bold">{statusCode}</div> : null}
      <div>{statusCode === 404 ? '존재하지 않는 페이지입니다! 😳' : '오류가 발생했어요! 😱'}</div>
    </section>
  );
};

ErrorPage.getInitialProps = async ({ res, err }: NextPageContext): Promise<ErrorProps> => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? null;

  return {
    statusCode,
  };
};

export default ErrorPage;
