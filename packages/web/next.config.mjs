/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@fullstack/shared'],
  ...(process.env.GITHUB_PAGES === 'true' && {
    output: 'export',
    basePath: '/TestTaskUTD',
    images: {
      unoptimized: true,
    },
  }),
};

export default nextConfig;
