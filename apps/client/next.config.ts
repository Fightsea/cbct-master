import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['ui', 'utils', '@cbct/api', '@cbct/enum', '@cbct/utils', 'mui-color-input', '@kitware/vtk.js'],
  reactStrictMode: true,
  basePath: '',
  output: 'standalone',
  env: {
    NEXT_PUBLIC_AUTH_STORE_ENCRYPTION_KEY: process.env.AUTH_STORE_ENCRYPTION_KEY as string,
    NEXT_PUBLIC_API_ORIGIN: process.env.SERVER_ORIGIN as string,
    NEXT_PUBLIC_ASSET_PROVIDER_DOMAIN: process.env.ASSET_PROVIDER_DOMAIN as string
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.ASSET_PROVIDER_DOMAIN || '*.cloudfront.net'
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/proxy/:path*',
        destination: `https://${process.env.ASSET_PROVIDER_DOMAIN}/:path*`
      }
    ]
  }
}

export default nextConfig
