import React from 'react';

import { Item } from '@/interfaces';

import TagItem from '@/components/tag/TagItem';

interface Props {
  tags: Item['tags'];
}

const TagList = ({ tags }: Props) => {
  return (
    <ul className="flex flex-row flex-wrap gap-2 p-4">
      {tags.map((tag) => (
        <TagItem
          key={tag.id}
          tagItem={tag}
        />
      ))}
    </ul>
  );
};

export default TagList;
