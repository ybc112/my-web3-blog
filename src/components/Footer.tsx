import { siteConfig } from '@/lib/config'

export default function Footer() {
  return (
    <footer className="relative bg-white border-t border-zinc-100 py-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg mb-4">
            <div className="w-5 h-5 bg-black rounded-sm shadow shadow-zinc-300"></div>
            {siteConfig.name}
          </div>
          <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">
            数据所有权归创作者所有。<br />
            内容指纹已上传至 Polygon 网络。
          </p>
          <p className="text-xs text-zinc-400 mt-4 font-mono">
            {siteConfig.ens}
          </p>
        </div>
        
        <div className="flex gap-16 text-sm">
          <div className="flex flex-col gap-4">
            <span className="font-bold text-zinc-900">Protocol</span>
            <a href="/rss.xml" className="text-zinc-500 hover:text-black transition-colors">RSS Feed</a>
            <a href="/sitemap.xml" className="text-zinc-500 hover:text-black transition-colors">Sitemap</a>
            <a 
              href={`https://polygonscan.com/address/${siteConfig.walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-black transition-colors"
            >
              On-Chain Proofs
            </a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="font-bold text-zinc-900">Social</span>
            <a 
              href={siteConfig.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-black transition-colors"
            >
              Twitter
            </a>
            <a 
              href={siteConfig.social.farcaster}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-black transition-colors"
            >
              Farcaster
            </a>
            <a 
              href={siteConfig.social.mirror}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-black transition-colors"
            >
              Mirror
            </a>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-zinc-100">
        <p className="text-xs text-zinc-400 text-center">
          © {new Date().getFullYear()} {siteConfig.name}. Built with Next.js, deployed on Cloudflare Pages.
        </p>
      </div>
    </footer>
  )
}
