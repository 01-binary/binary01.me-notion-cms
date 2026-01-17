import Link from 'next/link';
import { siteConfig } from 'site.config';

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
          fixed top-0 z-50 w-full min-w-[360px] bg-[hsla(0,0%,100%,.8)]
          backdrop-blur-lg
        "
      >
        <nav
          className="
            mx-auto flex max-w-(--breakpoint-lg) items-center justify-between
            p-3
          "
        >
          <h1 className="text-[20px] font-medium">
            <Link href={'/'}>{siteConfig.blogName}</Link>
          </h1>

          <ul className="flex items-center gap-2">
            {navLinkList.map(({ name, link }) => (
              <Link
                key={name}
                href={link}
                prefetch={false}
              >
                <li
                  className="
                    cursor-pointer rounded-xl p-2 text-[18px] font-normal
                    hover:bg-gray-100
                  "
                >
                  {name}
                </li>
              </Link>
            ))}
          </ul>
        </nav>
      </header>
      <div className="h-[90px]" />
    </>
  );
};

export default Header;
