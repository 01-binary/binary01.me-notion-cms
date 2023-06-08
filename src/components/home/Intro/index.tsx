import React from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineGithub, AiFillLinkedin } from 'react-icons/ai';
import { HiMail } from 'react-icons/hi';

const Intro = () => {
  return (
    <section className="mx-auto max-w-[868px]">
      <article className="flex gap-6">
        <Image
          className="rounded-full"
          src={'http://via.placeholder.com/110x110'}
          width={110}
          height={110}
          alt={'Intro Picture'}
        />
        <section className="flex flex-col justify-around gap-1">
          <section className="flex flex-col gap-2">
            <div>
              <span className="rounded-lg bg-[#ebeefe] p-1 text-[18px] font-normal text-[#005995]">
                @Jinsoo Lee(핀다/Web)
              </span>
            </div>
            <span className="text-[16px]">Hi~👋 🧑🏻‍💻 Frontend Engineer In Seoul</span>
          </section>
          <section className="flex items-center gap-2">
            <Link
              href={'https://github.com/01-binary'}
              target="_blank"
            >
              <AiOutlineGithub size={'24px'} />
            </Link>
            <AiFillLinkedin size={'24px'} />
            <HiMail size={'24px'} />
          </section>
        </section>
      </article>
    </section>
  );
};

export default Intro;
