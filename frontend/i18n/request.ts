import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  // İstifadəçinin seçdiyi dili çerezlərdən (cookies) oxuyuruq
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'az';

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});