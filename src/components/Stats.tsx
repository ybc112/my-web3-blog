import { Layers, LayoutGrid, CheckCircle2, ArrowUpRight } from 'lucide-react'

const GlobeIcon = ({ size, className }: { size: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="2" x2="22" y1="12" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
)

interface StatItem {
  label: string
  value: string
  icon: React.ComponentType<{ size: number; className?: string }>
  active?: boolean
}

export default function Stats({ articleCount }: { articleCount: number }) {
  const stats: StatItem[] = [
    { label: "Articles Published", value: String(articleCount), icon: Layers },
    { label: "Smart Contracts", value: "15+", icon: LayoutGrid },
    { label: "IPFS Status", value: "Online", icon: CheckCircle2, active: true },
    { label: "Network", value: "Mainnet", icon: GlobeIcon },
  ]

  return (
    <section className="relative border-b border-zinc-100 bg-white">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-zinc-100 border-x border-zinc-100">
        {stats.map((stat, i) => (
          <div key={i} className="p-8 group hover:bg-zinc-50 transition-colors cursor-default relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 text-zinc-400 group-hover:text-black transition-colors relative z-10">
              <stat.icon size={20} className={stat.active ? "text-green-600" : ""} />
              <ArrowUpRight 
                size={16} 
                className="opacity-0 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300" 
              />
            </div>
            <p className="text-3xl font-bold text-zinc-900 mb-1 relative z-10">{stat.value}</p>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest relative z-10">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
