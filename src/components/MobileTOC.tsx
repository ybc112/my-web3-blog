'use client'

import { useState, useEffect } from 'react'
import { List, X, ChevronRight } from 'lucide-react'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface MobileTOCProps {
  content: string
}

export default function MobileTOC({ content }: MobileTOCProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>('')

  // 提取标题
  useEffect(() => {
    const extractedHeadings: TOCItem[] = []
    const lines = content.split('\n')
    let inCodeBlock = false

    lines.forEach((line) => {
      const trimmedLine = line.trim()
      
      if (trimmedLine.startsWith('```')) {
        inCodeBlock = !inCodeBlock
        return
      }
      
      if (inCodeBlock) return
      
      const h2Match = trimmedLine.match(/^## (.+)$/)
      const h3Match = trimmedLine.match(/^### (.+)$/)

      if (h2Match) {
        const text = h2Match[1].replace(/[`*_]/g, '').trim()
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

  // 滚动监听
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
      { rootMargin: '-80px 0px -70% 0px' }
    )

    const timer = setTimeout(() => {
      headings.forEach(({ id }) => {
        const element = document.getElementById(id)
        if (element) observer.observe(element)
      })
    }, 300)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [headings])

  // 关闭时禁止滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (headings.length === 0) return null

  const handleClick = (id: string) => {
    setIsOpen(false)
    setTimeout(() => {
      const element = document.getElementById(id)
      if (element) {
        const top = element.offsetTop - 80
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }, 100)
  }

  return (
    <>
      {/* 浮动按钮 - 仅移动端显示 */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-black text-white rounded-full shadow-lg flex items-center justify-center hover:bg-zinc-800 transition-all active:scale-95"
        aria-label="打开目录"
      >
        <List size={24} />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
          {headings.length}
        </span>
      </button>

      {/* 目录抽屉 */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* 遮罩 */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* 抽屉内容 */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[70vh] overflow-hidden animate-slide-up">
            {/* 头部 */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <List size={20} />
                文章目录
                <span className="text-sm font-normal text-zinc-400">({headings.length})</span>
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* 目录列表 */}
            <ul className="p-4 space-y-1 overflow-y-auto max-h-[calc(70vh-60px)]">
              {headings.map((heading, index) => (
                <li key={`${heading.id}-${index}`}>
                  <button
                    onClick={() => handleClick(heading.id)}
                    className={`
                      w-full text-left py-3 px-4 rounded-xl transition-all flex items-center gap-2
                      ${heading.level === 3 ? 'ml-4 text-sm' : 'font-medium'}
                      ${activeId === heading.id
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-500'
                        : 'text-zinc-600 hover:bg-zinc-50 active:bg-zinc-100'
                      }
                    `}
                  >
                    <ChevronRight size={14} className={activeId === heading.id ? 'text-blue-500' : 'text-zinc-300'} />
                    {heading.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}
