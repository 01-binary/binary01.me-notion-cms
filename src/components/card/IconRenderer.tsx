import Image from 'next/image';

import { Item } from '@/interfaces';

interface Props {
  icon: Item['icon'];
}

const IconRenderer = ({ icon }: Props) => {
  if (!icon) return null;

  if (icon.type === 'emoji') return <span>{icon.emoji}</span>;

  const iconUrl = icon.type === 'file' ? icon.file.url : icon.external.url;

  return (
    <Image
      src={iconUrl}
      alt="icon"
      width={28}
      height={28}
      className="rounded-full"
    />
  );
};

export default IconRenderer;
