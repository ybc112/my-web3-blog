'use client'

import { useState, useEffect } from 'react'
import { Newspaper, ChevronRight, ArrowUpRight, Check, AlertCircle, ExternalLink } from 'lucide-react'
import { siteConfig } from '@/lib/config'

interface NewsItem {
  id: number
  source: string
  content: string
  time: string
  url?: string
}

const elsewhereLinks = [
  { name: 'Mirror.xyz', url: siteConfig.social.mirror },
  { name: 'Lens Protocol', url: siteConfig.social.lens },
  { name: 'Dune Analytics', url: siteConfig.social.dune },
  { name: 'GitHub', url: siteConfig.social.github },
]

export default function Sidebar() {
  const [email, setEmail] = useState('')
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [newsFeeds, setNewsFeeds] = useState<NewsItem[]>([
    { id: 1, source: "Loading...", content: "正在获取最新动态...", time: "..." },
  ])

  // 获取 Web3 新闻（从 RSS 或 API）
  useEffect(() => {
    const fetchNews = async () => {
      try {
        // 尝试从多个来源获取新闻
        // 这里使用静态数据作为后备，你可以接入真实 API
        // 例如: The Block API, CoinDesk RSS, 或自建 RSS 聚合
        
        // 模拟从 API 获取
        const mockNews: NewsItem[] = [
          { 
            id: 1, 
            source: "Vitalik.eth", 
            content: "Layer 2 的互操作性是 2024 年的关键... 跨链桥的安全性需要重新评估。", 
            time: formatTimeAgo(new Date(Date.now() - 2 * 60 * 60 * 1000)),
            url: "https://twitter.com/VitalikButerin"
          },
          { 
            id: 2, 
            source: "Dune Analytics", 
            content: "Uniswap X 交易量突破历史新高，聚合器市场份额分析报告已出。", 
            time: formatTimeAgo(new Date(Date.now() - 5 * 60 * 60 * 1000)),
            url: "https://dune.com"
          },
          { 
            id: 3, 
            source: "EIP Watch", 
            content: "EIP-4844 坎昆升级最新测试网进度报告：Blob 交易测试顺利。", 
            time: formatTimeAgo(new Date(Date.now() - 24 * 60 * 60 * 1000)),
            url: "https://eips.ethereum.org"
          },
        ]
        
        setNewsFeeds(mockNews)
      } catch (error) {
        console.error('Failed to fetch news:', error)
      }
    }

    fetchNews()
    // 每5分钟刷新一次
    const interval = setInterval(fetchNews, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setSubscribeStatus('error')
      setTimeout(() => setSubscribeStatus('idle'), 2000)
      return
    }

    setSubscribeStatus('loading')
    
    try {
      // 根据配置的 provider 调用不同的订阅服务
      const { newsletter } = siteConfig
      
      if (newsletter.provider === 'buttondown' && newsletter.buttondownUsername) {
        // Buttondown API
        const response = await fetch(`https://api.buttondown.email/v1/subscribers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            tags: ['web3-blog'],
          }),
        })
        
        if (!response.ok) throw new Error('Subscription failed')
      } else {
        // 没有配置邮件服务，模拟成功
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('Newsletter subscription (mock):', email)
      }
      
      setSubscribeStatus('success')
      setEmail('')
      setTimeout(() => setSubscribeStatus('idle'), 3000)
    } catch (error) {
      console.error('Subscription error:', error)
      setSubscribeStatus('error')
      setTimeout(() => setSubscribeStatus('idle'), 2000)
    }
  }

  return (
    <div className="space-y-8 lg:sticky lg:top-28 h-fit" id="news">
      {/* 订阅 */}
      <div className="bg-black text-white p-8 rounded-sm shadow-xl shadow-zinc-200">
        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Subscribe
        </h3>
        <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
          每周一封 Web3 技术简报。无广告，仅干货。
        </p>
        <form onSubmit={handleSubscribe} className="space-y-3">
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com" 
            disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
            className="w-full bg-zinc-900 border border-zinc-800 text-white px-4 py-3 text-sm focus:outline-none focus:border-zinc-700 focus:bg-zinc-800 transition-all placeholder:text-zinc-600 rounded-sm disabled:opacity-50" 
          />
          <button 
            type="submit"
            disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
            className="w-full bg-white text-black font-bold py-3 text-sm hover:bg-zinc-200 transition-colors rounded-sm flex items-center justify-center gap-2 group disabled:opacity-70"
          >
            {subscribeStatus === 'loading' && 'Subscribing...'}
            {subscribeStatus === 'success' && (
              <>
                <Check size={16} className="text-green-600" />
                Subscribed!
              </>
            )}
            {subscribeStatus === 'error' && (
              <>
                <AlertCircle size={16} className="text-red-600" />
                Try Again
              </>
            )}
            {subscribeStatus === 'idle' && (
              <>
                Join Network
                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* 短讯 */}
      <div>
        <div className="flex items-center justify-between border-b border-black pb-2 mb-6">
          <h3 className="font-bold flex items-center gap-2">
            <Newspaper size={18} />
            Flash News
          </h3>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
        </div>
        <div className="space-y-8 relative before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gradient-to-b before:from-zinc-200 before:to-transparent">
          {newsFeeds.map((news) => (
            <div key={news.id} className="relative pl-6 group cursor-pointer">
              <div className="absolute left-0 top-1.5 w-[11px] h-[11px] bg-white border-2 border-zinc-300 group-hover:border-black group-hover:scale-110 transition-all rounded-full z-10"></div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded">{news.source}</span>
                <span className="text-[10px] text-zinc-400 font-mono">{news.time}</span>
              </div>
              {news.url ? (
                <a 
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-600 leading-snug group-hover:text-black transition-colors mt-2 block"
                >
                  {news.content}
                  <ExternalLink size={10} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ) : (
                <p className="text-sm text-zinc-600 leading-snug group-hover:text-black transition-colors mt-2">
                  {news.content}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 链接 */}
      <div className="bg-zinc-50 p-6 rounded-lg border border-zinc-100">
        <h3 className="font-bold border-b border-zinc-200 pb-2 mb-4 text-sm uppercase tracking-wider text-zinc-500">Elsewhere</h3>
        <ul className="space-y-1 text-sm">
          {elsewhereLinks.map((link) => (
            <li key={link.name}>
              <a 
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between group text-zinc-600 hover:text-black hover:bg-white hover:shadow-sm px-3 py-2 rounded transition-all"
              >
                {link.name}
                <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-zinc-400" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// 格式化时间为 "2h ago" 格式
function formatTimeAgo(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}
