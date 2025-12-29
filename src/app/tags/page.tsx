import { getAllPosts, getAllTags } from '@/lib/posts'
import Link from 'next/link'
import { ArrowLeft, Tag, Hash } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: '标签分类 – YBC Web3',
  description: '按标签浏览所有文章',
}

export default function TagsPage() {
  const posts = getAllPosts()
  const tags = getAllTags()

  // 统计每个标签的文章数量
  const tagCounts: Record<string, number> = {}
  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1
    })
  })

  // 按文章数量排序
  const sortedTags = tags.sort((a, b) => tagCounts[b] - tagCounts[a])

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-black selection:text-white">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-black transition-colors mb-12"
          >
            <ArrowLeft size={16} />
            Back
          </Link>

          {/* Header */}
          <header className="mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 flex items-center gap-4">
              <Tag size={40} />
              标签分类
            </h1>
            <p className="text-xl text-zinc-600 leading-relaxed">
              共 {tags.length} 个标签，{posts.length} 篇文章
            </p>
          </header>

          {/* Tags Cloud */}
          <section className="mb-16">
            <div className="flex flex-wrap gap-3">
              {sortedTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="group flex items-center gap-2 px-4 py-2 bg-zinc-100 hover:bg-black hover:text-white transition-all rounded-full border border-zinc-200 hover:border-black"
                >
                  <Hash size={14} className="text-zinc-400 group-hover:text-white" />
                  <span className="font-medium">{tag}</span>
                  <span className="text-xs bg-zinc-200 group-hover:bg-zinc-700 px-2 py-0.5 rounded-full">
                    {tagCounts[tag]}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* All Tags with Posts */}
          <section className="space-y-12">
            {sortedTags.map((tag) => {
              const tagPosts = posts.filter(post => post.tags.includes(tag))
              return (
                <div key={tag} className="border-b border-zinc-100 pb-8">
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <span className="text-zinc-300">#</span>
                    {tag}
                    <span className="text-sm font-normal text-zinc-400">({tagPosts.length})</span>
                  </h2>
                  <ul className="space-y-3">
                    {tagPosts.map((post) => (
                      <li key={post.slug}>
                        <Link
                          href={`/posts/${post.slug}`}
                          className="group flex items-center justify-between py-2 hover:bg-zinc-50 -mx-3 px-3 rounded-lg transition-colors"
                        >
                          <span className="font-medium group-hover:text-blue-600 transition-colors">
                            {post.title}
                          </span>
                          <span className="text-sm text-zinc-400">
                            {new Date(post.date).toLocaleDateString('zh-CN')}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
