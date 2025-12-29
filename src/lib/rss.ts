import RSS from 'rss'
import { getAllPosts } from './posts'
import fs from 'fs'
import path from 'path'
import { siteConfig } from './config'

export function generateRSS() {
  const posts = getAllPosts()
  const siteUrl = siteConfig.url

  const feed = new RSS({
    title: siteConfig.name,
    description: siteConfig.description,
    site_url: siteUrl,
    feed_url: `${siteUrl}/rss.xml`,
    language: 'zh-CN',
    pubDate: new Date(),
    copyright: `© ${new Date().getFullYear()} ${siteConfig.name}`,
    generator: 'Next.js + RSS',
    custom_namespaces: {
      'content': 'http://purl.org/rss/1.0/modules/content/',
    },
  })

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.excerpt,
      url: `${siteUrl}/posts/${post.slug}`,
      date: new Date(post.date),
      categories: post.tags,
      author: siteConfig.name,
      custom_elements: [
        { 'content:encoded': `<p>${post.excerpt}</p><p><a href="${siteUrl}/posts/${post.slug}">阅读全文 →</a></p>` },
      ],
    })
  })

  // 确保 public 目录存在
  const publicDir = path.join(process.cwd(), 'public')
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true })
  }

  const rssPath = path.join(publicDir, 'rss.xml')
  fs.writeFileSync(rssPath, feed.xml({ indent: true }))
  
  console.log(`✅ RSS feed generated: ${rssPath}`)
  console.log(`   ${posts.length} articles included`)
}

// 同时生成 sitemap
export function generateSitemap() {
  const posts = getAllPosts()
  const siteUrl = siteConfig.url

  const staticPages = ['', '/about']
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${siteUrl}${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
  ${posts.map(post => `
  <url>
    <loc>${siteUrl}/posts/${post.slug}</loc>
    <lastmod>${new Date(post.date).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`

  const publicDir = path.join(process.cwd(), 'public')
  const sitemapPath = path.join(publicDir, 'sitemap.xml')
  fs.writeFileSync(sitemapPath, sitemap.trim())
  
  console.log(`✅ Sitemap generated: ${sitemapPath}`)
}
