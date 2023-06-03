import React from 'react';

import Link from 'next/link';
import { AiOutlineSearch } from 'react-icons/ai';

import IconButton from '@/components/common/IconButton';

const navLinks = [
  {
    name: 'Tags',
    link: '/tags',
  },
  {
    name: 'About',
    link: '/about',
  },
];

const Header = () => {
  return (
    <header className="fixed top-0 z-50 w-full bg-white">
      <nav className="mx-auto flex max-w-5xl flex-row justify-between p-4">
        <h1 className="text-4xl font-black">
          <Link href="/">MN</Link>
        </h1>

        <ul className="flex flex-row items-center gap-2">
          {navLinks.map(({ name, link }) => (
            <li
              key={name}
              className="font-medium text-gray-600"
            >
              <Link href={link}>
                <a className="rounded-md p-3 hover:bg-gray-100 hover:text-black">{name}</a>
              </Link>
            </li>
          ))}
          <li>
            <Link href="/search">
              <a>
                <IconButton
                  icon={
                    <AiOutlineSearch
                      size="1.5rem"
                      color="white"
                    />
                  }
                />
              </a>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
