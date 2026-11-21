import catalogue from '@/lib/site/catalogue.json';
import type { SitePage } from '@/lib/site/pages';
import { Link, usePage, type InertiaLinkProps } from '@inertiajs/react';
import { createContext, useContext, type ComponentProps } from 'react';

type SiteProps = {
    siteAssetUrl: string;
    siteRoutes: Record<SitePage, string>;
    whatsappNumber?: string;
};

export const EnquiryFallback = createContext<((message: string) => void) | null>(null);

export function useSiteAsset() {
    const { siteAssetUrl } = usePage<SiteProps>().props;

    return (path: string) => {
        if (!path) return '';
        if (path.startsWith('/') || path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }
        return `${siteAssetUrl}/${path}`;
    };
}

export function SiteImage({ src, ...props }: ComponentProps<'img'> & { src: string }) {
    const asset = useSiteAsset();

    return <img {...props} src={asset(src)} />;
}

export function SiteLink({ to, ...props }: Omit<InertiaLinkProps, 'href'> & { to: SitePage }) {
    const { siteRoutes } = usePage<SiteProps>().props;

    return <Link {...props} href={siteRoutes[to]} />;
}

export function Icon({ name }: { name: 'arrow' | 'whatsapp' | 'pin' | 'phone' }) {
    return (
        <svg aria-hidden="true">
            <use href={`#${name}`} />
        </svg>
    );
}

export function useWhatsAppUrl(message: string): string | undefined {
    const { whatsappNumber } = usePage<SiteProps>().props;
    const number = whatsappNumber || catalogue.settings.whatsappNumber;

    return /^[1-9]\d{6,14}$/.test(number) ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : undefined;
}

export function WhatsAppLink({ message, ...props }: Omit<ComponentProps<'a'>, 'href'> & { message: string }) {
    const url = useWhatsAppUrl(message);

    return <a {...props} href={url} target="_blank" rel="noopener noreferrer" />;
}

export function WhatsAppButton({ message, ...props }: ComponentProps<'button'> & { message: string }) {
    const showFallback = useContext(EnquiryFallback);
    const url = useWhatsAppUrl(message);

    return (
        <button
            {...props}
            type="button"
            data-whatsapp={message}
            onClick={() => {
                if (url) {
                    window.open(url, '_blank', 'noopener,noreferrer');
                } else {
                    showFallback?.(message);
                }
            }}
        />
    );
}
