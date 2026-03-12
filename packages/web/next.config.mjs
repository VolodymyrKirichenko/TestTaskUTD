/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@fullstack/shared'],
  output: 'export',
  basePath: process.env.GITHUB_PAGES === 'true' ? '/TestTaskUTD' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
