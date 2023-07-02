/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: process.env.DEFAULT_URL,
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'daily',
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
