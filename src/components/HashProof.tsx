'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, Copy, ExternalLink, AlertCircle } from 'lucide-react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSwitchChain } from 'wagmi'
import { polygon } from 'wagmi/chains'
import { keccak256, toHex } from 'viem'
import { ConnectButton } from '@rainbow-me/rainbowkit'

interface HashProofProps {
  content: string
}

export default function HashProof({ content }: HashProofProps) {
  const [copied, setCopied] = useState(false)
  const { address, isConnected, chain } = useAccount()
  const { switchChain } = useSwitchChain()
  
  // 计算内容哈希
  const contentHash = keccak256(toHex(content))
  const shortHash = `${contentHash.slice(0, 10)}...${contentHash.slice(-8)}`

  const { 
    data: hash,
    writeContract,
    isPending: isWriting,
    error: writeError,
  } = useWriteContract()

  const { 
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  })

  const copyHash = () => {
    navigator.clipboard.writeText(contentHash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 发送带 data 的存证交易
  const handleProof = async () => {
    if (!isConnected || !address) return

    if (chain?.id !== polygon.id) {
      switchChain({ chainId: polygon.id })
      return
    }

    // 使用 window.ethereum 直接发送
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const txHash = await (window as any).ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: address,
            to: address,
            value: '0x0',
            data: contentHash,
          }],
        })
        console.log('Transaction sent:', txHash)
      } catch (error) {
        console.error('Transaction failed:', error)
      }
    }
  }

  return (
    <div className="bg-zinc-50 p-8 rounded-lg border border-zinc-100">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-sm flex-shrink-0">
          <CheckCircle2 size={20} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg mb-2">On-Chain Proof</h3>
          <p className="text-sm text-zinc-500 mb-6">
            将文章内容哈希写入 Polygon 链，证明内容在此时间点存在且未被篡改。
          </p>
          
          {/* Hash */}
          <div className="bg-white border border-zinc-200 p-4 mb-6 rounded-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Content Hash (Keccak-256)</span>
              <button
                onClick={copyHash}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-black transition-colors"
              >
                <Copy size={12} />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <code className="text-xs text-zinc-600 break-all font-mono block">
              {contentHash}
            </code>
          </div>
          
          {/* 状态显示 */}
          {isConfirmed && hash ? (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-sm">
              <CheckCircle2 size={20} className="text-green-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-green-800">Successfully Verified on Polygon</p>
                <a
                  href={`https://polygonscan.com/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-600 hover:underline flex items-center gap-1 mt-1"
                >
                  View on Polygonscan <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ) : isWriting || isConfirming ? (
            <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-sm">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-blue-800">
                {isWriting ? 'Confirm in wallet...' : 'Waiting for confirmation...'}
              </p>
            </div>
          ) : writeError ? (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-sm mb-4">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">Transaction failed. Please try again.</p>
            </div>
          ) : null}

          {/* 按钮 */}
          {!isConfirmed && !isWriting && !isConfirming && (
            <>
              {!isConnected ? (
                <div className="space-y-3">
                  <p className="text-sm text-zinc-500">Connect your wallet to verify this article on-chain.</p>
                  <ConnectButton />
                </div>
              ) : chain?.id !== polygon.id ? (
                <button
                  onClick={() => switchChain({ chainId: polygon.id })}
                  className="w-full bg-purple-600 text-white font-bold py-4 text-sm hover:bg-purple-700 transition-colors rounded-sm uppercase tracking-wider"
                >
                  Switch to Polygon
                </button>
              ) : (
                <button
                  onClick={handleProof}
                  className="w-full bg-black text-white font-bold py-4 text-sm hover:bg-zinc-800 transition-colors rounded-sm uppercase tracking-wider"
                >
                  Verify on Polygon (~$0.01)
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
