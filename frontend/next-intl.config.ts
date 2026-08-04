import { IntlConfig } from 'next-intl';

const config: NextIntlConfig = {
  locales: ['az', 'en', 'tr', 'ru'],
  defaultLocale: 'az',
  localeDetection: false, // Statik exportda dil avtomatik təyinini söndürürük
};

export default config;