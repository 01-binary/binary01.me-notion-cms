import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineGithub, AiFillLinkedin } from 'react-icons/ai';
import { HiMail } from 'react-icons/hi';

import { GITHUB_ADDR, LINKEDIN_ADDR, MAIL_ADDR } from '@/assets/constants';

const Intro = () => {
  return (
    <section>
      <article className="flex gap-6">
        <div className="h-[110px] w-[110px]">
          <Image
            className="rounded-full"
            src={'http://via.placeholder.com/110x110'}
            width={110}
            height={110}
            alt={'Intro Picture'}
          />
        </div>
        <section className="flex flex-col justify-around gap-1">
          <section className="flex flex-col gap-2">
            <span className="whitespace-nowrap rounded-lg bg-[#ebeefe] p-1 text-[18px] font-normal text-[#005995]">
              @Jinsoo Lee(핀다/Web)
            </span>
            <span className="text-[16px]">Hi~👋 🧑🏻‍💻</span>
          </section>
          <section className="flex items-center gap-3">
            <Link
              href={GITHUB_ADDR}
              target="_blank"
            >
              <AiOutlineGithub size={'26px'} />
            </Link>
            <Link
              href={LINKEDIN_ADDR}
              target="_blank"
            >
              <AiFillLinkedin size={'26px'} />
            </Link>
            <Link href={MAIL_ADDR}>
              <HiMail size={'26px'} />
            </Link>
          </section>
        </section>
      </article>
    </section>
  );
};

export default Intro;
