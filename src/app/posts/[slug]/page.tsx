import { getAllPosts, getPostBySlug } from '@/lib/posts'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Calendar, Clock, Tag } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HashProof from '@/components/HashProof'
import Comments from '@/components/Comments'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: 'Not Found' }

  return {
    title: `${post.title} – YBC Web3`,
    description: post.excerpt,
  }
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white text-zinc-900 font-sans selection:bg-blue-600 selection:text-white">
      <Navbar />

      <article className="pt-28 pb-20">
        {/* 文章头部 - 全宽背景 */}
        <header className="bg-white border-b border-zinc-100 pb-12 mb-12">
          <div className="max-w-4xl mx-auto px-6">
            {/* 返回按钮 */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-black transition-colors mb-8 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              返回文章列表
            </Link>

            {/* 标签 */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-full transition-colors"
                >
                  <Tag size={12} />
                  {tag}
                </Link>
              ))}
            </div>

            {/* 标题 */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6 text-zinc-900">
              {post.title}
            </h1>

            {/* 元信息 */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {formatDate(post.date)}
              </span>
              <span className="text-zinc-300">•</span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {post.readingTime}
              </span>
              <span className="text-zinc-300">•</span>
              <span className="flex items-center gap-1.5 text-green-600 font-medium">
                <CheckCircle2 size={14} />
                链上存证
              </span>
            </div>
          </div>
        </header>

        {/* 文章内容 - 更宽的布局 */}
        <div className="max-w-4xl mx-auto px-6">
          {/* 正文内容 */}
          <div className="prose prose-lg max-w-none">
            <MDXRemote source={post.content} />
          </div>

          {/* 文章结束分隔线 */}
          <div className="my-16 flex items-center gap-4">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent"></div>
            <span className="text-zinc-400 text-sm">END</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent"></div>
          </div>

          {/* 链上存证 */}
          <div className="mb-12">
            <HashProof content={post.content} />
          </div>

          {/* 标签云 */}
          <div className="bg-zinc-50 rounded-xl p-6 mb-12">
            <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">相关标签</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="inline-flex items-center gap-1.5 text-sm px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-700 rounded-lg border border-zinc-200 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>

          {/* 评论区 */}
          <Comments slug={slug} />

          {/* 底部导航 */}
          <div className="flex items-center justify-between pt-8 border-t border-zinc-100">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-black transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              返回首页
            </Link>
            <Link
              href="/archive"
              className="text-sm font-medium text-zinc-600 hover:text-black transition-colors"
            >
              查看更多文章 →
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  )
}
