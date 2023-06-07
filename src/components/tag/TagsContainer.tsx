import React from 'react';

import { MultiSelectPropertyItemObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import TagList from '@/components/tag/TagList';

interface Props {
  tags: MultiSelectPropertyItemObjectResponse['multi_select'];
}

const TagsContainer = ({ tags }: Props) => {
  return (
    <section>
      <div className="mx-auto my-8 w-4/5 max-w-5xl rounded-2xl bg-gray-100">
        <TagList tags={tags} />
      </div>
    </section>
  );
};

export default TagsContainer;
