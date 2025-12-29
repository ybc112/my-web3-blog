import { ArrowLeft, Github, Twitter, Mail } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AboutPage() {
  const skills = [
    { category: 'Smart Contracts', items: ['Solidity', 'Vyper', 'Foundry', 'Hardhat'] },
    { category: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind'] },
    { category: 'Web3', items: ['ethers.js', 'wagmi', 'viem', 'IPFS'] },
    { category: 'Infrastructure', items: ['Cloudflare', 'Vercel', 'AWS', 'Docker'] },
  ]

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-black selection:text-white">
      <Navbar />
      
      <main className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          {/* Back */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-black transition-colors mb-12"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
          
          {/* Header */}
          <header className="mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">About</h1>
            <p className="text-xl text-zinc-600 leading-relaxed">
              全栈 Web3 开发者，专注于底层协议研究、智能合约安全与去中心化存储方案。
            </p>
          </header>

          {/* Bio */}
          <section className="mb-16 pb-16 border-b border-zinc-100">
            <div className="prose max-w-none">
              <p>
                我是一名独立开发者，过去几年一直在区块链领域深耕。从最初的 DeFi 协议开发，
                到后来的智能合约安全审计，再到现在专注于去中心化基础设施建设。
              </p>
              <p>
                这个博客是我记录学习和思考的地方。所有内容都使用 MDX 编写，
                托管在 Cloudflare Pages 上，每篇文章的内容哈希都可以存证到 Polygon 链上。
              </p>
              <p>
                我相信开放、透明和去中心化的价值。如果你对 Web3 开发有任何问题，
                欢迎通过下方的社交媒体联系我。
              </p>
            </div>
          </section>

          {/* Skills */}
          <section className="mb-16 pb-16 border-b border-zinc-100">
            <h2 className="text-2xl font-bold tracking-tight mb-8">Stack</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {skills.map((skill) => (
                <div key={skill.category}>
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">
                    {skill.category}
                  </h3>
                  <ul className="space-y-2">
                    {skill.items.map((item) => (
                      <li key={item} className="text-sm text-zinc-600">{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold tracking-tight mb-8">Connect</h2>
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-4 border border-zinc-200 hover:border-black hover:bg-zinc-50 transition-all"
              >
                <Github size={20} />
                <span className="font-medium">GitHub</span>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-4 border border-zinc-200 hover:border-black hover:bg-zinc-50 transition-all"
              >
                <Twitter size={20} />
                <span className="font-medium">Twitter</span>
              </a>
              <a 
                href="mailto:hello@example.com"
                className="flex items-center gap-3 px-6 py-4 border border-zinc-200 hover:border-black hover:bg-zinc-50 transition-all"
              >
                <Mail size={20} />
                <span className="font-medium">Email</span>
              </a>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
