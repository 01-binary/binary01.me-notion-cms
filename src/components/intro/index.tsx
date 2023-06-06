import React from 'react';

import Link from 'next/link';

const Intro = () => {
  return (
    <section>
      <div className="mx-auto flex w-4/5 max-w-5xl flex-col gap-8 py-16 text-center md:items-start md:text-left">
        <div className="relative">
          <span className="absolute left-1/2 -bottom-2 h-6 w-6 -translate-x-1/2 rotate-45 bg-black" />
          <span className="relative rounded-lg bg-black py-2 px-4 font-bold text-white">WOW</span>
        </div>

        <h2 className="break-keep text-6xl font-black leading-[1.2]">Hello, World!</h2>

        <p className="text-xl font-light text-gray-400 md:max-w-xl">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis cupiditate ut in
          nesciunt, nulla minima necessitatibus?
        </p>

        <div>
          <Link href={'/about'}>
            <button className="rounded-3xl border border-black px-4 py-2 font-semibold hover:bg-black hover:text-white">
              About Me
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Intro;
