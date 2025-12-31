'use client'

import { useEffect } from 'react'

// 语言显示名称映射
const languageNames: Record<string, string> = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  tsx: 'TSX',
  jsx: 'JSX',
  rust: 'Rust',
  solidity: 'Solidity',
  sol: 'Solidity',
  bash: 'Bash',
  shell: 'Shell',
  sh: 'Shell',
  zsh: 'Zsh',
  python: 'Python',
  py: 'Python',
  go: 'Go',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  toml: 'TOML',
  sql: 'SQL',
  graphql: 'GraphQL',
  css: 'CSS',
  scss: 'SCSS',
  html: 'HTML',
  markdown: 'Markdown',
  md: 'Markdown',
  plaintext: 'Text',
  text: 'Text',
}

export default function CopyCodeButton() {
  useEffect(() => {
    const codeBlocks = document.querySelectorAll('.article-content pre')
    
    codeBlocks.forEach((pre) => {
      // 避免重复处理
      if (pre.getAttribute('data-enhanced')) return
      pre.setAttribute('data-enhanced', 'true')
      
      const preEl = pre as HTMLElement
      preEl.style.position = 'relative'
      
      // 获取代码元素和语言
      const codeEl = pre.querySelector('code')
      const code = codeEl?.textContent || ''
      
      // 从 class 中提取语言 (language-xxx)
      let language = ''
      if (codeEl?.className) {
        const match = codeEl.className.match(/language-(\w+)/)
        if (match) {
          language = match[1]
        }
      }
      
      // 创建工具栏
      const toolbar = document.createElement('div')
      toolbar.className = 'code-toolbar'
      toolbar.innerHTML = `
        <span class="code-lang">${languageNames[language] || language.toUpperCase() || 'CODE'}</span>
        <button class="code-copy-btn" title="复制代码">
          <svg class="copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          <svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:none">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span class="copy-text">复制</span>
        </button>
      `
      
      // 插入工具栏
      pre.insertBefore(toolbar, pre.firstChild)
      
      // 复制功能
      const copyBtn = toolbar.querySelector('.code-copy-btn') as HTMLButtonElement
      copyBtn?.addEventListener('click', async () => {
        await navigator.clipboard.writeText(code)
        
        const copyIcon = copyBtn.querySelector('.copy-icon') as SVGElement
        const checkIcon = copyBtn.querySelector('.check-icon') as SVGElement
        const copyText = copyBtn.querySelector('.copy-text') as HTMLSpanElement
        
        copyIcon.style.display = 'none'
        checkIcon.style.display = 'block'
        copyText.textContent = '已复制'
        copyBtn.classList.add('copied')
        
        setTimeout(() => {
          copyIcon.style.display = 'block'
          checkIcon.style.display = 'none'
          copyText.textContent = '复制'
          copyBtn.classList.remove('copied')
        }, 2000)
      })
    })
  }, [])

  return null
}
