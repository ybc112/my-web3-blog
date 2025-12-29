import { ArrowUpRight, CheckCircle2, Activity, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { PostMeta } from '@/lib/posts'

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }).toUpperCase()
}

export default function BlogList({ posts }: { posts: PostMeta[] }) {
  return (
    <div className="lg:col-span-8 space-y-12" id="blog">
      <div className="flex items-baseline justify-between border-b border-black pb-4 mb-8">
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Activity size={20} />
          Latest Research
        </h2>
        <span className="text-sm font-mono text-zinc-500">SORT BY: DATE</span>
      </div>
      
      <div className="flex flex-col gap-0">
        {posts.map((post, index) => (
          <Link href={`/posts/${post.slug}`} key={post.slug}>
            <article className="group py-10 border-b border-zinc-100 hover:bg-white -mx-6 px-6 transition-all cursor-pointer hover:shadow-lg hover:shadow-zinc-100 hover:scale-[1.01] rounded-xl duration-300 bg-white/50 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-baseline">
                <span className="text-4xl font-light text-zinc-200 font-mono group-hover:text-zinc-900 transition-colors duration-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3 text-xs font-bold tracking-wider uppercase">
                    <span className="text-zinc-900 bg-zinc-100 px-2 py-1 rounded-sm border border-zinc-200">
                      {post.tags[0] || 'Article'}
                    </span>
                    <span className="text-zinc-400 flex items-center gap-1">
                      {formatDate(post.date)} • {post.readingTime}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-zinc-900 mb-3 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                    {post.title}
                    <ArrowUpRight 
                      size={20} 
                      className="opacity-0 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 text-blue-600" 
                    />
                  </h3>
                  <p className="text-zinc-500 leading-relaxed mb-5 max-w-2xl group-hover:text-zinc-700 transition-colors">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm font-medium">
                    <span className="flex items-center gap-1.5 text-zinc-400 group-hover:text-black transition-colors px-2 py-1 -ml-2 rounded hover:bg-zinc-100">
                      Read Article
                    </span>
                    <span className="text-zinc-300">|</span>
                    <span className="flex items-center gap-1.5 text-zinc-400 font-mono text-xs bg-zinc-50 px-2 py-1 rounded border border-zinc-100" title="Content Hash">
                      <CheckCircle2 size={12} className="text-green-600" />
                      {post.contentHash}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
      
      {posts.length > 3 && (
        <button className="group w-full py-5 border border-zinc-200 text-zinc-500 hover:text-black hover:border-black transition-all text-sm font-bold uppercase tracking-widest mt-8 flex items-center justify-center gap-2">
          View Archive
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  )
}
