/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove risky build settings for production
  // eslint and typescript errors should be fixed, not ignored
  images: {
    unoptimized: true,
  },
  // Configure for Replit environment - allows cross-origin requests in development
  allowedDevOrigins: ['*.replit.dev', '127.0.0.1', 'localhost'],
  // Production-safe configuration
  output: 'standalone',
  // Server external packages for production optimization
  serverExternalPackages: ['@supabase/supabase-js'],
}

export default nextConfig
