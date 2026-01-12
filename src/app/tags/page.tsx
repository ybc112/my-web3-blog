import { getAllPosts, getAllTags } from '@/lib/posts'
import Link from 'next/link'
import { ArrowLeft, Tag, Hash, FileText, TrendingUp } from 'lucide-react'
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
  
  // 找出最大数量，用于计算热度
  const maxCount = Math.max(...Object.values(tagCounts))

  // 获取热度等级 (1-3)
  const getHeatLevel = (count: number) => {
    const ratio = count / maxCount
    if (ratio >= 0.7) return 3 // 热门
    if (ratio >= 0.4) return 2 // 中等
    return 1 // 普通
  }

  // 热门标签（前3个）
  const hotTags = sortedTags.slice(0, 3)
  const otherTags = sortedTags.slice(3)

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white text-zinc-900 font-sans selection:bg-black selection:text-white">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          {/* Back */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-black transition-colors mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            返回首页
          </Link>

          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-black text-white flex items-center justify-center rounded-2xl shadow-lg">
                <Tag size={28} />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight">标签分类</h1>
                <p className="text-zinc-500 mt-1">
                  共 {tags.length} 个标签，{posts.length} 篇文章
                </p>
              </div>
            </div>
          </header>

          {/* 热门标签 */}
          {hotTags.length > 0 && (
            <section className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp size={18} className="text-orange-500" />
                <h2 className="text-lg font-bold">热门标签</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {hotTags.map((tag, index) => (
                  <Link
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="group relative overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800 text-white p-6 rounded-2xl hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {/* 背景装饰 */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                    
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium px-2 py-1 bg-white/20 rounded-full">
                          #{index + 1} 热门
                        </span>
                        <Hash size={20} className="text-white/40" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{tag}</h3>
                      <p className="text-white/60 text-sm">
                        {tagCounts[tag]} 篇文章
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* 所有标签网格 */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <FileText size={18} className="text-zinc-400" />
              <h2 className="text-lg font-bold">全部标签</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {sortedTags.map((tag) => {
                const heatLevel = getHeatLevel(tagCounts[tag])
                return (
                  <Link
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className={`
                      group relative p-4 rounded-xl border transition-all duration-300
                      hover:shadow-lg hover:-translate-y-1
                      ${heatLevel === 3 
                        ? 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 hover:border-orange-300' 
                        : heatLevel === 2
                          ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300'
                          : 'bg-white border-zinc-200 hover:border-zinc-300'
                      }
                    `}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Hash 
                        size={16} 
                        className={`
                          ${heatLevel === 3 ? 'text-orange-400' : heatLevel === 2 ? 'text-blue-400' : 'text-zinc-300'}
                        `} 
                      />
                      {heatLevel === 3 && (
                        <span className="text-[10px] font-bold text-orange-500 bg-orange-100 px-1.5 py-0.5 rounded">
                          HOT
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-zinc-900 mb-1 truncate group-hover:text-black">
                      {tag}
                    </h3>
                    <p className="text-xs text-zinc-500">
                      {tagCounts[tag]} 篇
                    </p>
                  </Link>
                )
              })}
            </div>
          </section>

          {/* 统计信息 */}
          <section className="mt-16 p-6 bg-zinc-100 rounded-2xl">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-zinc-900">{posts.length}</p>
                <p className="text-sm text-zinc-500">总文章数</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-zinc-900">{tags.length}</p>
                <p className="text-sm text-zinc-500">标签数量</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-zinc-900">
                  {(posts.length / tags.length).toFixed(1)}
                </p>
                <p className="text-sm text-zinc-500">篇/标签</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
