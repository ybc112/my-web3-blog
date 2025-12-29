'use client'

import { ConnectButton as RainbowConnectButton } from '@rainbow-me/rainbowkit'
import { Wallet } from 'lucide-react'

export default function ConnectButton() {
  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted
        const connected = ready && account && chain

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-black text-white border border-black rounded-full shadow-sm hover:shadow-md hover:bg-zinc-800 transition-all"
                  >
                    <Wallet size={16} />
                    Connect Wallet
                  </button>
                )
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-medium bg-red-500 text-white border border-red-500 rounded-full shadow-sm hover:shadow-md transition-all"
                  >
                    Wrong Network
                  </button>
                )
              }

              return (
                <div className="flex items-center gap-2">
                  <button
                    onClick={openChainModal}
                    className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-zinc-100 border border-zinc-200 rounded-full hover:bg-zinc-200 transition-all"
                  >
                    {chain.hasIcon && (
                      <div
                        className="w-4 h-4 rounded-full overflow-hidden"
                        style={{ background: chain.iconBackground }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            className="w-4 h-4"
                          />
                        )}
                      </div>
                    )}
                    <span className="hidden sm:inline">{chain.name}</span>
                  </button>

                  <button
                    onClick={openAccountModal}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-zinc-50 border border-zinc-200 rounded-full hover:bg-zinc-100 transition-all"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-blue-500"></div>
                    {account.displayName}
                    {account.displayBalance && (
                      <span className="hidden sm:inline text-zinc-500">
                        ({account.displayBalance})
                      </span>
                    )}
                  </button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </RainbowConnectButton.Custom>
  )
}
