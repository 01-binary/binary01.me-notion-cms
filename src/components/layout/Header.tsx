import React from 'react';

import Link from 'next/link';
import { FcSearch } from 'react-icons/fc';

const navLinkList = [
  {
    name: 'About',
    link: '/about',
  },
];

const Header = () => {
  return (
    <>
      <header className="fixed top-0 z-50 w-full min-w-[360px] bg-[hsla(0,0%,100%,.8)] backdrop-blur-lg">
        <nav className="mx-auto flex max-w-[1024px] items-center justify-between p-2">
          <h1 className="text-[20px] font-normal">
            <Link href={'/'}>binary01.me</Link>
          </h1>

          <ul className="flex items-center gap-2">
            {navLinkList.map(({ name, link }) => (
              <li
                key={name}
                className="cursor-pointer rounded-xl p-2 text-[18px] font-light hover:bg-gray-100"
              >
                <Link href={link}>{name}</Link>
              </li>
            ))}
            <li className="cursor-pointer rounded-xl p-2 text-[18px] font-light hover:bg-gray-100">
              <FcSearch size={'22px'} />
            </li>
          </ul>
        </nav>
      </header>
      <div className="h-[59px]" />
    </>
  );
};

export default Header;
