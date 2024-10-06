import { memo } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineGithub, AiFillLinkedin } from 'react-icons/ai';
import { HiMail } from 'react-icons/hi';

import { siteConfig } from 'site.config';

const Intro = () => {
  const profileImage = `/api/profileImage`;

  return (
    <section>
      <article className="flex gap-4 md:gap-6">
        <Image
          className="h-[110px] w-[110px] rounded-full object-cover"
          src={profileImage}
          width={110}
          height={110}
          alt={'Intro Picture'}
        />
        <section className="flex flex-col justify-around gap-1">
          <section className="flex flex-col gap-2">
            <span className="whitespace-nowrap rounded-lg bg-[#ebeefe] p-1 text-[18px] font-normal text-[#005995]">
              {siteConfig.introName}
            </span>
            <span className="text-[16px]">{siteConfig.introDesc}</span>
          </section>
          <section className="flex items-center gap-3">
            <Link
              href={`https://github.com/${siteConfig.github}`}
              target="_blank"
            >
              <AiOutlineGithub size={'26px'} />
            </Link>
            <Link
              href={`https://www.linkedin.com/in/${siteConfig.linkedIn}`}
              target="_blank"
            >
              <AiFillLinkedin size={'26px'} />
            </Link>
            <Link href={`mailto:${siteConfig.mail}`}>
              <HiMail size={'26px'} />
            </Link>
          </section>
        </section>
      </article>
    </section>
  );
};

export default memo(Intro);
