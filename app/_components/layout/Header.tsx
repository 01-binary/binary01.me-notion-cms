import Link from 'next/link';
import { siteConfig } from 'site.config';

import ThemeSelect from '../ThemeSelect';

const navLinkList = [
  {
    name: 'about',
    link: '/about',
  },
];

const Header = () => {
  return (
    <>
      <header
        className="
          fixed top-0 z-50 w-full min-w-[360px] bg-[rgb(var(--color-header-bg))]
          backdrop-blur-lg
        "
      >
        <nav
          className="
            mx-auto flex max-w-(--breakpoint-lg) items-center justify-between
            p-3
          "
        >
          <p className="text-[20px] font-medium">
            <Link href={'/'}>{siteConfig.blogName}</Link>
          </p>

          <ul className="flex items-center gap-2">
            {navLinkList.map(({ name, link }) => (
              <li key={name}>
                <Link
                  href={link}
                  prefetch={false}
                  className="
                    cursor-pointer rounded-xl p-2 text-[18px] font-normal
                    transition-colors
                    hover:bg-[rgb(var(--color-bg-tertiary))]
                  "
                >
                  {name}
                </Link>
              </li>
            ))}
            <li>
              <ThemeSelect />
            </li>
          </ul>
        </nav>
      </header>
      <div className="h-[90px]" />
    </>
  );
};

export default Header;
