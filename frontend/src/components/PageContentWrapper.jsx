'use client';

import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

export default function PageContentWrapper({ children }) {
    const pathname = usePathname();
    const { lang } = useLanguage();
    const isHome = pathname === '/';

    return (
        <main className={`${!isHome ? 'pt-32 md:pt-40' : ''} ${lang === 'bn' ? 'font-bn' : 'font-en'}`}>
            {children}
        </main>
    );
}
