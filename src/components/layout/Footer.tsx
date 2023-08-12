import dayjs from 'dayjs';

import { siteConfig } from 'site.config';

const Footer = () => {
  const currentYear = dayjs().year();
  return (
    <footer className="mx-auto mt-[70px] mb-6 max-w-[1024px]">
      <section className="text-center text-[14px] text-[#37352F]">
        Copyright {currentYear} {siteConfig.author}
      </section>
    </footer>
  );
};

export default Footer;
