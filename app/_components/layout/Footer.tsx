import dayjs from 'dayjs';
import { siteConfig } from 'site.config';

const Footer = () => {
  const currentYear = dayjs().year();
  return (
    <footer className="mx-auto mt-[70px] mb-6 max-w-(--breakpoint-lg)">
      <section className="
        text-center text-[14px] text-[rgb(var(--color-text-secondary))]
      ">
        Copyright {currentYear} {siteConfig.author}
      </section>
    </footer>
  );
};

export default Footer;
