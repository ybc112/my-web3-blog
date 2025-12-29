import { getAllPosts, getAllTags } from '@/lib/posts'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import BlogList from '@/components/BlogList'
import Sidebar from '@/components/Sidebar'
import TagCloud from '@/components/TagCloud'
import Footer from '@/components/Footer'
import { SearchTrigger } from '@/components/Search'

export default function Home() {
  const posts = getAllPosts()
  const tags = getAllTags()

  // 计算每个标签的文章数量
  const tagCounts: Record<string, number> = {}
  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  // 为搜索准备简化的 posts 数据
  const searchPosts = posts.map(p => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    tags: p.tags,
    date: p.date
  }))

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-black selection:text-white">
      <Navbar />
      {/* 搜索组件 - 固定在右下角 */}
      <div className="fixed bottom-6 right-6 z-40">
        <SearchTrigger posts={searchPosts} tags={tags} />
      </div>
      <Hero />
      <Stats articleCount={posts.length} />

      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <BlogList posts={posts} />
          <aside className="lg:col-span-4 space-y-8">
            <TagCloud tags={tags} tagCounts={tagCounts} />
            <Sidebar />
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}
