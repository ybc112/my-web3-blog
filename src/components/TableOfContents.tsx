'use client'

import { useState, useEffect } from 'react'
import { List, ChevronDown } from 'lucide-react'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  content: string
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isExpanded, setIsExpanded] = useState(true)

  // 从 markdown 内容提取标题
  useEffect(() => {
    const extractedHeadings: TOCItem[] = []
    const lines = content.split('\n')

    lines.forEach((line) => {
      // 匹配 ## 和 ### 标题（排除代码块内的）
      const trimmedLine = line.trim()
      
      // 跳过代码块
      if (trimmedLine.startsWith('```')) return
      
      const h2Match = trimmedLine.match(/^## (.+)$/)
      const h3Match = trimmedLine.match(/^### (.+)$/)

      if (h2Match) {
        const text = h2Match[1].replace(/[`*_]/g, '').trim()
        // 生成与 rehype-slug 一致的 id
        const id = text
          .toLowerCase()
          .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/^-+|-+$/g, '')
        extractedHeadings.push({ id, text, level: 2 })
      } else if (h3Match) {
        const text = h3Match[1].replace(/[`*_]/g, '').trim()
        const id = text
          .toLowerCase()
          .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/^-+|-+$/g, '')
        extractedHeadings.push({ id, text, level: 3 })
      }
    })

    setHeadings(extractedHeadings)
  }, [content])

  // 滚动监听，高亮当前章节
  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0
      }
    )

    // 延迟执行，等待 DOM 渲染
    const timer = setTimeout(() => {
      headings.forEach(({ id }) => {
        const element = document.getElementById(id)
        if (element) {
          observer.observe(element)
        }
      })
    }, 300)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [headings])

  // 如果没有标题，不显示目录
  if (headings.length === 0) {
    return (
      <div className="bg-zinc-50 rounded-xl border border-zinc-100 p-4">
        <p className="text-sm text-zinc-400">暂无目录</p>
      </div>
    )
  }

  return (
    <nav className="bg-zinc-50 rounded-xl border border-zinc-100 overflow-hidden">
      {/* 标题栏 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-zinc-100/80 hover:bg-zinc-200/80 transition-colors"
      >
        <span className="flex items-center gap-2 text-sm font-bold text-zinc-700">
          <List size={16} />
          目录
          <span className="text-xs text-zinc-400 font-normal">({headings.length})</span>
        </span>
        <ChevronDown
          size={16}
          className={`text-zinc-400 transition-transform duration-200 ${isExpanded ? '' : '-rotate-90'}`}
        />
      </button>

      {/* 目录列表 */}
      {isExpanded && (
        <ul className="p-3 space-y-0.5 max-h-[60vh] overflow-y-auto">
          {headings.map((heading, index) => (
            <li key={`${heading.id}-${index}`}>
              <a
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.getElementById(heading.id)
                  if (element) {
                    const top = element.offsetTop - 100
                    window.scrollTo({ top, behavior: 'smooth' })
                    setActiveId(heading.id)
                  }
                }}
                className={`
                  block py-2 px-3 text-sm rounded-lg transition-all duration-200
                  ${heading.level === 3 ? 'ml-3 text-xs' : 'font-medium'}
                  ${activeId === heading.id
                    ? 'bg-blue-100 text-blue-700 border-l-2 border-blue-500'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  }
                `}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
