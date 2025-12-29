import Link from 'next/link'
import { Tag, Hash, ChevronRight } from 'lucide-react'

interface TagCloudProps {
  tags: string[]
  tagCounts: Record<string, number>
}

export default function TagCloud({ tags, tagCounts }: TagCloudProps) {
  // 按文章数量排序，取前8个
  const sortedTags = [...tags].sort((a, b) => tagCounts[b] - tagCounts[a]).slice(0, 8)

  return (
    <div className="bg-gradient-to-br from-zinc-50 to-white p-6 rounded-xl border border-zinc-100">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3 mb-4">
        <h3 className="font-bold flex items-center gap-2 text-sm uppercase tracking-wider text-zinc-500">
          <Tag size={16} />
          标签分类
        </h3>
        <Link
          href="/tags"
          className="text-xs text-zinc-400 hover:text-black transition-colors flex items-center gap-1"
        >
          查看全部
          <ChevronRight size={12} />
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {sortedTags.map((tag) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className="group flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-black hover:text-white transition-all rounded-full border border-zinc-200 hover:border-black text-sm"
          >
            <Hash size={12} className="text-zinc-300 group-hover:text-zinc-400" />
            <span>{tag}</span>
            <span className="text-xs text-zinc-400 group-hover:text-zinc-300">
              {tagCounts[tag]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
