'use client'

import { useState } from 'react'
import { Github, Twitter, Copy, Check } from 'lucide-react'
import { LucideIcon } from 'lucide-react'
import { siteConfig } from '@/lib/config'

function SocialButton({ icon: Icon, href, onClick }: { icon: LucideIcon; href?: string; onClick?: () => void }) {
  if (onClick) {
    return (
      <button 
        onClick={onClick}
        className="p-3 bg-white border border-zinc-200 rounded-full hover:bg-black hover:text-white hover:border-black hover:scale-110 transition-all duration-300 shadow-sm"
      >
        <Icon size={20} />
      </button>
    )
  }
  
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 bg-white border border-zinc-200 rounded-full hover:bg-black hover:text-white hover:border-black hover:scale-110 transition-all duration-300 shadow-sm"
    >
      <Icon size={20} />
    </a>
  )
}

export default function Hero() {
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    navigator.clipboard.writeText(siteConfig.walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <header className="relative pt-40 pb-20 px-6 border-b border-zinc-100 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-start md:items-end justify-between">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-zinc-500 mb-8 uppercase tracking-wider bg-zinc-50 inline-block px-3 py-1 rounded-full border border-zinc-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Open for Audit & Collaboration
            </div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] mb-8 text-zinc-900">
              Building <br />
              <span className="text-zinc-300">Trustless.</span>
            </h1>
            <p className="text-xl text-zinc-600 max-w-2xl leading-relaxed font-light pl-1 border-l-2 border-zinc-200">
              {siteConfig.description}
            </p>
          </div>
          
          <div className="flex gap-4">
            <SocialButton icon={Github} href={siteConfig.social.github} />
            <SocialButton icon={Twitter} href={siteConfig.social.twitter} />
            <SocialButton 
              icon={copied ? Check : Copy} 
              onClick={copyAddress}
            />
          </div>
        </div>
      </div>
    </header>
  )
}
