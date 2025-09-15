/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configure for Replit environment - allows cross-origin requests in development
  allowedDevOrigins: ['*.replit.dev', '127.0.0.1', 'localhost'],
}

export default nextConfig
