/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'muse-ai.oss-cn-hangzhou.aliyuncs.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.oss-cn-hangzhou.aliyuncs.com',
        pathname: '/**',
      },
    ],
    // 图片缓存时间（秒）- 60天
    minimumCacheTTL: 60 * 60 * 24 * 60,
    // 响应式断点
    deviceSizes: [640, 750, 828, 1080, 1200],
    // 图片尺寸
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    // 允许的格式
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = nextConfig
