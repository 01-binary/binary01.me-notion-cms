import { ReactNode } from 'react';

interface Props {
  icon: ReactNode;
}

const IconButton = ({ icon }: Props) => {
  return (
    <button
      type="button"
      className="rounded-md bg-black p-2 hover:bg-gray-700"
    >
      {icon}
    </button>
  );
};

export default IconButton;
