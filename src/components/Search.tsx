'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, FileText, Tag, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface SearchResult {
  slug: string
  title: string
  excerpt: string
  tags: string[]
  date: string
  type: 'post' | 'tag'
}

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  posts: Array<{
    slug: string
    title: string
    excerpt: string
    tags: string[]
    date: string
  }>
  tags: string[]
}

export function SearchModal({ isOpen, onClose, posts, tags }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 搜索逻辑
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const searchQuery = query.toLowerCase()
    const matchedPosts: SearchResult[] = posts
      .filter(post =>
        post.title.toLowerCase().includes(searchQuery) ||
        post.excerpt.toLowerCase().includes(searchQuery) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery))
      )
      .map(post => ({ ...post, type: 'post' as const }))
      .slice(0, 5)

    const matchedTags: SearchResult[] = tags
      .filter(tag => tag.toLowerCase().includes(searchQuery))
      .map(tag => ({
        slug: tag,
        title: `#${tag}`,
        excerpt: `查看所有 ${tag} 相关文章`,
        tags: [],
        date: '',
        type: 'tag' as const
      }))
      .slice(0, 3)

    setResults([...matchedPosts, ...matchedTags])
  }, [query, posts, tags])

  // 打开时聚焦
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
    if (!isOpen) {
      setQuery('')
    }
  }, [isOpen])

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  const handleSelect = () => {
    onClose()
    setQuery('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm">
      <div
        ref={containerRef}
        className="w-full max-w-xl mx-4 bg-white rounded-xl shadow-2xl overflow-hidden"
      >
        {/* 搜索输入 */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100">
          <Search size={20} className="text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文章、标签..."
            className="flex-1 text-lg outline-none placeholder:text-zinc-400"
          />
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-100 rounded transition-colors"
          >
            <X size={18} className="text-zinc-400" />
          </button>
        </div>

        {/* 搜索结果 */}
        <div className="max-h-[50vh] overflow-y-auto">
          {query && results.length === 0 ? (
            <div className="px-4 py-8 text-center text-zinc-500">
              没有找到相关内容
            </div>
          ) : results.length > 0 ? (
            <ul className="py-2">
              {results.map((result) => (
                <li key={`${result.type}-${result.slug}`}>
                  <Link
                    href={result.type === 'post' ? `/posts/${result.slug}` : `/tags/${encodeURIComponent(result.slug)}`}
                    onClick={handleSelect}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors group"
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-zinc-100 rounded-lg group-hover:bg-zinc-200 transition-colors">
                      {result.type === 'post' ? (
                        <FileText size={16} className="text-zinc-500" />
                      ) : (
                        <Tag size={16} className="text-zinc-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-zinc-900 group-hover:text-blue-600 transition-colors truncate">
                        {result.title}
                      </h3>
                      <p className="text-sm text-zinc-500 truncate">
                        {result.excerpt}
                      </p>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-zinc-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all mt-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-sm text-zinc-500">
              <p className="mb-3">快捷提示：</p>
              <ul className="space-y-1 text-zinc-400">
                <li>• 输入关键词搜索文章标题和内容</li>
                <li>• 输入标签名称快速筛选</li>
                <li>• 按 ESC 关闭搜索</li>
              </ul>
            </div>
          )}
        </div>

        {/* 底部提示 */}
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-50 border-t border-zinc-100 text-xs text-zinc-400">
          <span>↑↓ 导航</span>
          <span>↵ 选择</span>
          <span>ESC 关闭</span>
        </div>
      </div>
    </div>
  )
}

// 搜索按钮组件
export function SearchButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 text-sm text-zinc-500 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition-colors border border-zinc-200"
    >
      <Search size={14} />
      <span className="hidden sm:inline">搜索</span>
      <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono bg-white rounded border border-zinc-300">
        ⌘K
      </kbd>
    </button>
  )
}

// 搜索触发器（带全局快捷键）
export function SearchTrigger({
  posts,
  tags
}: {
  posts: Array<{
    slug: string
    title: string
    excerpt: string
    tags: string[]
    date: string
  }>
  tags: string[]
}) {
  const [isOpen, setIsOpen] = useState(false)

  // 全局快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <>
      <SearchButton onClick={() => setIsOpen(true)} />
      <SearchModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        posts={posts}
        tags={tags}
      />
    </>
  )
}
