'use client'

import { useEffect, useRef } from 'react'

interface CommentsProps {
  slug: string
}

export default function Comments({ slug }: CommentsProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    // 清除旧的 giscus
    const existingScript = ref.current.querySelector('script')
    if (existingScript) {
      existingScript.remove()
    }
    const existingGiscus = ref.current.querySelector('.giscus')
    if (existingGiscus) {
      existingGiscus.remove()
    }

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.async = true
    script.crossOrigin = 'anonymous'

    script.setAttribute('data-repo', 'ybc112/my-web3-blog')
    script.setAttribute('data-repo-id', 'R_kgDOQwYbZQ')
    script.setAttribute('data-category', 'Announcements')
    script.setAttribute('data-category-id', 'DIC_kwDOQwYbZc4C0V4c')
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'top')
    script.setAttribute('data-theme', 'light')
    script.setAttribute('data-lang', 'zh-CN')
    script.setAttribute('data-loading', 'lazy')

    ref.current.appendChild(script)
  }, [slug])

  return (
    <div className="mt-16 pt-12 border-t border-zinc-100">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
        💬 评论与讨论
      </h3>
      <p className="text-sm text-zinc-500 mb-6">
        使用 GitHub 账号登录即可评论，欢迎讨论和提问！
      </p>
      <div ref={ref} className="giscus-container" />
    </div>
  )
}
