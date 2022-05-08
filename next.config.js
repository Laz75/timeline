/** @type {import('next').NextConfig} */

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval';
  style-src 'self' 'unsafe-inline' *.googleapis.com;
  font-src 'self' *.gstatic.com;  
  img-src 'self' data: blob: *.jimsteinman.it ;
  connect-src * ws: wss:;
`

const securityHeaders = [
  { // to allow prefetching
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  { // https only, unnecessary on Vercel (already on)
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  { // Unnecessary if we use CSP, but for older browsers can work.
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  { // Against XSS attacks with wrong content type
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
  }
]

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  optimizeFonts: true, // Apparently, this option on causes some issue in some systems
  swcMinify: true, // Still not production ready, but will soon be
  images: { // Added avif, not included in the default configuration
    formats: ["image/avif", "image/webp"],
    domains: ['www.jimsteinman.it']
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  }
}

module.exports = nextConfig
