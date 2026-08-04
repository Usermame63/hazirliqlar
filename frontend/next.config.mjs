import withNextIntl from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

// 'withNextIntl' xüsusi funksiyasını DÜZGÜN çağırırıq. Qarşısında 'export default' yoxdur, içəridə olmalıdır!
export default withNextIntl(nextConfig);