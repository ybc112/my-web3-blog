import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains'
import { http } from 'wagmi'

export const config = getDefaultConfig({
  appName: 'YBC Web3 Blog',
  projectId: '7e80ea89720b6eedddfd13d58c0fb7b3',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
  transports: {
    // 使用公共 RPC 端点，避免 CORS 问题
    [mainnet.id]: http('https://eth.llamarpc.com'),
    [polygon.id]: http('https://polygon.llamarpc.com'),
    [optimism.id]: http('https://optimism.llamarpc.com'),
    [arbitrum.id]: http('https://arbitrum.llamarpc.com'),
    [base.id]: http('https://base.llamarpc.com'),
  },
})
