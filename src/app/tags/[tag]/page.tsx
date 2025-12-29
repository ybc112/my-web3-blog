import { getAllPosts, getAllTags } from '@/lib/posts'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Hash, ArrowUpRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface Props {
  params: Promise<{ tag: string }>
}

export async function generateStaticParams() {
  const tags = getAllTags()
  return tags.map((tag) => ({ tag: encodeURIComponent(tag) }))
}

export async function generateMetadata({ params }: Props) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  return {
    title: `#${decodedTag} – YBC Web3`,
    description: `查看所有关于 ${decodedTag} 的文章`,
  }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).toUpperCase()
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  const allPosts = getAllPosts()
  const posts = allPosts.filter(post => post.tags.includes(decodedTag))

  if (posts.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-black selection:text-white">
      <Navbar />

      <main className="pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back */}
          <Link
            href="/tags"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-black transition-colors mb-12"
          >
            <ArrowLeft size={16} />
            所有标签
          </Link>

          {/* Header */}
          <header className="mb-16 pb-8 border-b border-zinc-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-black text-white flex items-center justify-center rounded-lg">
                <Hash size={24} />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                {decodedTag}
              </h1>
            </div>
            <p className="text-lg text-zinc-500">
              共 {posts.length} 篇文章
            </p>
          </header>

          {/* Posts List */}
          <section className="space-y-6">
            {posts.map((post, index) => (
              <Link key={post.slug} href={`/posts/${post.slug}`}>
                <article className="group p-6 border border-zinc-100 hover:border-zinc-300 hover:shadow-lg transition-all rounded-xl bg-white">
                  <div className="flex items-start gap-4">
                    <span className="text-3xl font-light text-zinc-200 font-mono group-hover:text-zinc-400 transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 text-xs text-zinc-400">
                        <span>{formatDate(post.date)}</span>
                        <span>•</span>
                        <span>{post.readingTime}</span>
                      </div>
                      <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                        {post.title}
                        <ArrowUpRight
                          size={18}
                          className="opacity-0 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all"
                        />
                      </h2>
                      <p className="text-zinc-500 line-clamp-2">{post.excerpt}</p>
                      <div className="flex gap-2 mt-3">
                        {post.tags.map((t) => (
                          <span
                            key={t}
                            className={`text-xs px-2 py-1 rounded ${
                              t === decodedTag
                                ? 'bg-black text-white'
                                : 'bg-zinc-100 text-zinc-600'
                            }`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
