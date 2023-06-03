import React from 'react';

interface IconButtonProps {
  icon: React.ReactNode;
}

const IconButton = ({ icon }: IconButtonProps) => {
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
