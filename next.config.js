/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'muse-ai.oss-cn-hangzhou.aliyuncs.com',
      'oss-cn-hangzhou.aliyuncs.com' // 阿里云OSS通用域名
    ],
  },
}

module.exports = nextConfig