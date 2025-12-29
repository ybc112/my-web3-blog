# Web3 Blog

基于 Next.js + MDX 的个人技术博客，支持链上存证。

## 快速开始

```bash
npm install
npm run dev
```

访问 http://localhost:3000

## 写文章

在 `content/posts/` 目录创建 `.mdx` 文件：

```mdx
---
title: "文章标题"
date: "2025-12-27"
tags: ["web3", "solidity"]
excerpt: "文章摘要"
cover: "/images/cover.png"  # 可选
---

正文内容...
```

## 部署到 Cloudflare Pages

1. 推送代码到 GitHub
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
3. Pages → Create a project → Connect to Git
4. 构建设置：
   - Framework preset: Next.js
   - Build command: `npm run build`
   - Build output directory: `out`

## 功能

- ✅ MDX 文章支持
- ✅ 标签分类
- ✅ 阅读时间估算
- ✅ RSS 订阅
- ✅ Polygon 链上存证
- ✅ 暗色模式
- ✅ SEO 优化
