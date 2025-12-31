import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { PostMeta } from '@/lib/posts'

interface PostNavigationProps {
  prevPost: PostMeta | null
  nextPost: PostMeta | null
}

export default function PostNavigation({ prevPost, nextPost }: PostNavigationProps) {
  if (!prevPost && !nextPost) return null

  return (
    <nav className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12 pt-8 border-t border-zinc-100">
      {/* 上一篇 */}
      {prevPost ? (
        <Link
          href={`/posts/${prevPost.slug}`}
          className="group flex flex-col p-5 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:shadow-lg transition-all bg-white"
        >
          <span className="flex items-center gap-1 text-xs text-zinc-400 mb-2">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            上一篇
          </span>
          <span className="font-medium text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {prevPost.title}
          </span>
        </Link>
      ) : (
        <div />
      )}

      {/* 下一篇 */}
      {nextPost ? (
        <Link
          href={`/posts/${nextPost.slug}`}
          className="group flex flex-col items-end text-right p-5 rounded-xl border border-zinc-200 hover:border-zinc-300 hover:shadow-lg transition-all bg-white"
        >
          <span className="flex items-center gap-1 text-xs text-zinc-400 mb-2">
            下一篇
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </span>
          <span className="font-medium text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {nextPost.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  )
}
