import { getAllPosts } from '@/lib/posts'
import Link from 'next/link'
import { ArrowLeft, Calendar, FileText, ChevronRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: '归档 – YBC Web3',
  description: '按时间浏览所有文章',
}

interface PostsByYear {
  [year: string]: {
    [month: string]: Array<{
      slug: string
      title: string
      date: string
      tags: string[]
    }>
  }
}

export default function ArchivePage() {
  const posts = getAllPosts()

  // 按年月分组
  const postsByYear: PostsByYear = {}
  posts.forEach(post => {
    const date = new Date(post.date)
    const year = date.getFullYear().toString()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')

    if (!postsByYear[year]) {
      postsByYear[year] = {}
    }
    if (!postsByYear[year][month]) {
      postsByYear[year][month] = []
    }
    postsByYear[year][month].push({
      slug: post.slug,
      title: post.title,
      date: post.date,
      tags: post.tags
    })
  })

  // 按年份降序排列
  const years = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a))

  const monthNames = [
    '一月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'
  ]

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
              <Calendar size={40} />
              文章归档
            </h1>
            <p className="text-xl text-zinc-600 leading-relaxed">
              共 {posts.length} 篇文章，按时间排列
            </p>
          </header>

          {/* Timeline */}
          <div className="space-y-12">
            {years.map((year) => (
              <section key={year} className="relative">
                {/* Year Header */}
                <div className="sticky top-24 z-10 bg-white py-2">
                  <h2 className="text-3xl font-bold text-zinc-900 flex items-center gap-3">
                    <span className="w-3 h-3 bg-black rounded-full"></span>
                    {year}
                    <span className="text-sm font-normal text-zinc-400">
                      ({Object.values(postsByYear[year]).flat().length} 篇)
                    </span>
                  </h2>
                </div>

                {/* Months */}
                <div className="ml-6 border-l-2 border-zinc-100 pl-8 pt-4 space-y-8">
                  {Object.keys(postsByYear[year])
                    .sort((a, b) => parseInt(b) - parseInt(a))
                    .map((month) => (
                      <div key={`${year}-${month}`}>
                        {/* Month Header */}
                        <h3 className="text-lg font-semibold text-zinc-700 mb-4 flex items-center gap-2">
                          <span className="w-2 h-2 bg-zinc-300 rounded-full -ml-[2.35rem]"></span>
                          {monthNames[parseInt(month) - 1]}
                        </h3>

                        {/* Posts */}
                        <ul className="space-y-3">
                          {postsByYear[year][month].map((post) => (
                            <li key={post.slug}>
                              <Link
                                href={`/posts/${post.slug}`}
                                className="group flex items-start gap-4 p-4 -ml-4 rounded-xl hover:bg-zinc-50 transition-colors"
                              >
                                <div className="w-10 h-10 flex items-center justify-center bg-zinc-100 rounded-lg group-hover:bg-zinc-200 transition-colors flex-shrink-0">
                                  <FileText size={18} className="text-zinc-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs text-zinc-400 font-mono">
                                      {new Date(post.date).getDate().toString().padStart(2, '0')}日
                                    </span>
                                    {post.tags.slice(0, 2).map(tag => (
                                      <span
                                        key={tag}
                                        className="text-xs px-2 py-0.5 bg-zinc-100 text-zinc-500 rounded"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                  <h4 className="font-medium text-zinc-900 group-hover:text-blue-600 transition-colors">
                                    {post.title}
                                  </h4>
                                </div>
                                <ChevronRight
                                  size={18}
                                  className="text-zinc-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all mt-2"
                                />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              </section>
            ))}
          </div>

          {/* Empty State */}
          {posts.length === 0 && (
            <div className="text-center py-16 text-zinc-500">
              <Calendar size={48} className="mx-auto mb-4 text-zinc-300" />
              <p>还没有发布任何文章</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
