import { AiFillLinkedin } from '@react-icons/all-files/ai/AiFillLinkedin';
import { AiOutlineGithub } from '@react-icons/all-files/ai/AiOutlineGithub';
import { HiMail } from '@react-icons/all-files/hi/HiMail';
import Image from 'next/image';
import Link from 'next/link';
import { siteConfig } from 'site.config';

import { DEFAULT_BLUR_BASE64 } from '../_constants';

interface IntroProps {
  profileUrl: string;
}

const Intro = ({ profileUrl }: IntroProps) => {
  return (
    <section>
      <article
        className="
          flex gap-4
          md:gap-6
        "
      >
        <Image
          className="size-[110px] rounded-full object-cover"
          src={profileUrl}
          width={110}
          height={110}
          alt={'Intro Picture'}
          placeholder="blur"
          blurDataURL={DEFAULT_BLUR_BASE64}
        />
        <section className="flex flex-col justify-around gap-1">
          <section className="flex flex-col gap-2">
            <span
              className="
                rounded-lg bg-[#ebeefe] p-1 text-[18px] font-normal
                whitespace-nowrap text-[#005995]
                dark:bg-[#1e3a5f] dark:text-[#64b5f6]
              "
            >
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

export default Intro;
