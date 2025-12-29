'use client'

import { useState, useEffect } from 'react'
import { Terminal, Zap } from 'lucide-react'
import Link from 'next/link'
import ConnectButton from './ConnectButton'
import { usePublicClient } from 'wagmi'
import { formatGwei } from 'viem'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [gasPrice, setGasPrice] = useState<string | null>(null)
  const publicClient = usePublicClient()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // 获取真实 Gas 价格
  useEffect(() => {
    const fetchGasPrice = async () => {
      if (!publicClient) return
      try {
        const price = await publicClient.getGasPrice()
        const gwei = Math.round(Number(formatGwei(price)))
        setGasPrice(String(gwei))
      } catch (error) {
        console.error('Failed to fetch gas price:', error)
        setGasPrice('--')
      }
    }

    fetchGasPrice()
    const interval = setInterval(fetchGasPrice, 12000) // 每12秒更新（约1个区块）
    return () => clearInterval(interval)
  }, [publicClient])

  const gasPriceNum = gasPrice ? parseInt(gasPrice) : 0

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 border-b ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-md border-zinc-200 py-3' 
        : 'bg-transparent border-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-sm shadow-lg shadow-zinc-200">
            <Terminal size={16} />
          </div>
          <span>YBC Web3</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-500 bg-white/50 px-6 py-2 rounded-full border border-zinc-100 backdrop-blur-sm shadow-sm">
          <Link href="/#blog" className="hover:text-black transition-colors">Writings</Link>
          <Link href="/tags" className="hover:text-black transition-colors">Tags</Link>
          <Link href="/archive" className="hover:text-black transition-colors">Archive</Link>
          <Link href="/about" className="hover:text-black transition-colors">About</Link>
          <div className="w-px h-4 bg-zinc-300 mx-2"></div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-400" title="Ethereum Gas Price">
            <Zap 
              size={12} 
              className={
                gasPriceNum < 20 
                  ? "text-green-500 fill-green-500" 
                  : gasPriceNum < 50 
                    ? "text-amber-500 fill-amber-500" 
                    : "text-red-500 fill-red-500"
              } 
            />
            <span className="text-zinc-600">{gasPrice ?? '...'} Gwei</span>
          </div>
        </div>
        
        <ConnectButton />
      </div>
    </nav>
  )
}
