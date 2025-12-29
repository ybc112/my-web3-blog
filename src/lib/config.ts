// 网站配置 - 修改这里的信息
export const siteConfig = {
  // 基本信息
  name: 'YBC Web3',
  title: 'YBC Web3 - Building Trustless Infrastructure',
  description: '全栈 Web3 开发者。专注底层协议研究、智能合约安全与去中心化存储方案。',
  url: 'https://ybc-web3-blog.pages.dev', // 部署后替换为实际域名

  // 社交链接
  social: {
    twitter: 'https://x.com/YBCYBC00',
    github: 'https://github.com/ybc112',
    mirror: 'https://mirror.xyz/', // 注册后填写
    farcaster: 'https://warpcast.com/', // 注册后填写
    lens: 'https://hey.xyz/', // 注册后填写
    dune: 'https://dune.com/', // 注册后填写
  },

  // 钱包地址（用于复制和打赏）
  walletAddress: '0xf1af895b184279210d4b82e03d96ef9deafe1f34',

  // ENS 域名
  ens: '0xf1af...1f34', // 购买ENS后替换

  // 邮件订阅服务配置（可选）
  newsletter: {
    provider: null, // 暂不启用，后续可配置 'buttondown' | 'convertkit' | 'mailchimp'
    buttondownUsername: '',
    convertkitFormId: '',
    mailchimpEndpoint: '',
  },
}
