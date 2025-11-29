/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://nestjs-kepegawaian-production.up.railway.app/:path*", // API backend
      },
    ];
  },
};

export default nextConfig;
