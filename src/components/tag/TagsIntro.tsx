import React from 'react';

interface Props {
  title?: string;
  subtitle?: string;
}

const TagsIntro = ({ title = 'All Tags', subtitle = 'Tag Collection' }: Props) => {
  return (
    <section>
      <div className="mx-auto flex w-4/5 max-w-5xl flex-col gap-4 py-16">
        <p className="text-2xl font-medium text-gray-500">{subtitle}</p>

        <h2 className="text-7xl font-bold">{title}</h2>
      </div>
    </section>
  );
};

export default TagsIntro;
