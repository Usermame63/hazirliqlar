import { IntlConfig } from 'next-intl';

const config: IntlConfig = {
  locales: ['az', 'en', 'tr', 'ru'],
  defaultLocale: 'az',
  localeDetection: false,
};

export default config;