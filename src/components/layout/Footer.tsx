import dayjs from 'dayjs';

import { siteConfig } from 'site.config';

const Footer = () => {
  const currentYear = dayjs().year();
  return (
    <footer className="mx-auto mb-6 mt-[70px] max-w-screen-lg">
      <section className="text-center text-[14px] text-[#37352F]">
        Copyright {currentYear} {siteConfig.author}
      </section>
    </footer>
  );
};

export default Footer;
