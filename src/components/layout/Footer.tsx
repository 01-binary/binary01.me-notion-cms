import { siteConfig } from 'site.config';

const Footer = () => {
  return (
    <footer className="mx-auto mt-[70px] mb-6 max-w-[1024px]">
      <section className="text-center text-[14px] text-[#37352F]">
        Copyright 2023 {siteConfig.author}
      </section>
    </footer>
  );
};

export default Footer;
