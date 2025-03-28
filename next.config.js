/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: ['tselaco.s3.af-south-1.amazonaws.com']
  },
  // PWA Configuration
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate'
          }
        ]
      }
    ]
  },
  // Enable PWA features
  async rewrites() {
    return [
      {
        source: '/sw.js',
        destination: '/_next/static/sw.js'
      }
    ]
  },
  experimental: {
    swcPlugins: false
  }
}

module.exports = nextConfig
