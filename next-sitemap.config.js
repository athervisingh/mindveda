/** @type {import('next-sitemap').IConfig} */
const { allServices } = require('./lib/siteContent')

module.exports = {
  siteUrl: 'https://mindveda.in',
  generateRobotsTxt: true,
  exclude: ['/admin', '/admin/*', '/dashboard', '/cart', '/checkout', '/login', '/signup'],
  additionalPaths: async () => {
    return allServices.map(s => ({
      loc: `/book/${s.slug}`,
      changefreq: 'weekly',
      priority: 0.9,
      lastmod: new Date().toISOString(),
    }))
  },
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/admin', '/dashboard', '/api', '/cart', '/checkout'] },
    ],
  },
  changefreq: 'weekly',
  priority: 0.7,
}
