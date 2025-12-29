import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Web3Provider from '@/components/Web3Provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'YBC Web3 - Building Trustless Infrastructure',
  description: '全栈 Web3 开发者。专注底层协议研究、智能合约安全与去中心化存储方案。',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} antialiased`}>
        {/* 点阵背景 */}
        <div className="fixed inset-0 z-0 pointer-events-none dot-pattern"></div>
        <div className="relative z-10">
          <Web3Provider>
            {children}
          </Web3Provider>
        </div>
      </body>
    </html>
  )
}
