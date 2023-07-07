/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: process.env.BLOG_URL,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
  generateIndexSitemap: false,
  priority: 1,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
};
