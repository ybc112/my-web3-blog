import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import { createHash } from 'crypto'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export interface PostMeta {
  slug: string
  title: string
  date: string
  tags: string[]
  excerpt: string
  cover?: string
  readingTime: string
  contentHash: string // 添加内容哈希
}

export interface Post extends PostMeta {
  content: string
}

// 生成内容哈希（与前端 ethers.keccak256 兼容的简化版）
function generateContentHash(content: string): string {
  const hash = createHash('sha256').update(content).digest('hex')
  return `0x${hash.slice(0, 6)}...${hash.slice(-4)}`
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }
  
  const fileNames = fs.readdirSync(postsDirectory)
  const posts = fileNames
    .filter((name) => name.endsWith('.mdx'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      
      return {
        slug,
        title: data.title || slug,
        date: data.date || new Date().toISOString(),
        tags: data.tags || [],
        excerpt: data.excerpt || content.slice(0, 150) + '...',
        cover: data.cover,
        readingTime: readingTime(content).text,
        contentHash: generateContentHash(content),
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
  return posts
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)
  
  if (!fs.existsSync(fullPath)) {
    return null
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  
  return {
    slug,
    title: data.title || slug,
    date: data.date || new Date().toISOString(),
    tags: data.tags || [],
    excerpt: data.excerpt || content.slice(0, 150) + '...',
    cover: data.cover,
    readingTime: readingTime(content).text,
    contentHash: generateContentHash(content),
    content,
  }
}

export function getAllTags(): string[] {
  const posts = getAllPosts()
  const tags = new Set<string>()
  posts.forEach((post) => post.tags.forEach((tag) => tags.add(tag)))
  return Array.from(tags)
}

// 获取相邻文章（上一篇、下一篇）
export function getAdjacentPosts(slug: string): { prev: PostMeta | null; next: PostMeta | null } {
  const posts = getAllPosts()
  const currentIndex = posts.findIndex((post) => post.slug === slug)

  if (currentIndex === -1) {
    return { prev: null, next: null }
  }

  return {
    prev: currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null,
    next: currentIndex > 0 ? posts[currentIndex - 1] : null,
  }
}
