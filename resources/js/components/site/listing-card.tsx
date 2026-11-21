import { formatCataloguePrice, type CatalogueSection, type Listing } from '@/lib/site/catalogue-utils';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Icon, SiteImage, useSiteAsset, WhatsAppLink } from './site-elements';

type ListingCardProps = {
    item: Listing;
    section: CatalogueSection;
    aspectRatio: string;
    allowVideo: boolean;
    delay: number;
    onVideoPlay: (video: HTMLVideoElement) => void;
};

export function ListingCard({ item, section, aspectRatio, allowVideo, delay, onVideoPlay }: ListingCardProps) {
    const asset = useSiteAsset();
    const card = useRef<HTMLElement>(null);
    const video = useRef<HTMLVideoElement>(null);
    const trigger = useRef<HTMLButtonElement>(null);
    const focusTrigger = useRef(false);
    const [imageFailed, setImageFailed] = useState(false);
    const [videoState, setVideoState] = useState<'poster' | 'playing' | 'error'>('poster');
    const isVideo = allowVideo && item.type === 'video';
    const poster = (isVideo && item.thumbnail?.path) || item.file.path;
    const price = formatCataloguePrice(item.price, section);

    useEffect(() => {
        const element = card.current;
        if (!element || !('IntersectionObserver' in window) || !element.animate) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let animation: Animation | undefined;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.unobserve(element);
                if (reducedMotion.matches || element.contains(document.activeElement)) return;

                animation = element.animate(
                    [
                        { opacity: 0, transform: 'translateY(18px)' },
                        { opacity: 1, transform: 'none' },
                    ],
                    {
                        duration: 550,
                        delay,
                        easing: 'cubic-bezier(.22,1,.36,1)',
                        fill: 'backwards',
                    },
                );
            },
            { threshold: 0.08 },
        );
        const stopIfReduced = () => {
            if (reducedMotion.matches) animation?.cancel();
        };

        observer.observe(element);
        reducedMotion.addEventListener('change', stopIfReduced);

        return () => {
            observer.disconnect();
            animation?.cancel();
            reducedMotion.removeEventListener('change', stopIfReduced);
        };
    }, [delay]);

    useEffect(() => {
        if (videoState === 'poster' && focusTrigger.current) {
            focusTrigger.current = false;
            trigger.current?.focus();
        }

        const player = video.current;
        if (videoState !== 'playing' || !player) return;

        player.focus();
        void player.play().catch(() => undefined);

        return () => {
            player.pause();
            player.removeAttribute('src');
            player.load();
        };
    }, [videoState]);

    return (
        <article className="listing-card" data-listing-id={item.id} ref={card}>
            <div className="listing-media" style={{ '--listing-ratio': aspectRatio.replace(':', ' / ') } as CSSProperties}>
                {imageFailed ? (
                    <div className="media-fallback">Preview unavailable</div>
                ) : (
                    <SiteImage
                        src={poster}
                        alt={item.alt}
                        width={800}
                        height={600}
                        loading="lazy"
                        decoding="async"
                        onError={() => setImageFailed(true)}
                    />
                )}
                {isVideo && videoState === 'poster' && (
                    <button
                        className="video-trigger"
                        type="button"
                        aria-label={`Play ${item.heading}`}
                        ref={trigger}
                        onClick={() => setVideoState('playing')}
                    >
                        <span className="play-disc">
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M6 3v18l16-9Z" />
                            </svg>
                        </span>
                        <span className="play-label">PLAY FILM</span>
                    </button>
                )}
                {videoState === 'playing' && (
                    <video
                        ref={video}
                        controls
                        playsInline
                        muted
                        preload="metadata"
                        src={asset(item.file.path)}
                        poster={asset(poster)}
                        aria-label={item.heading}
                        onPlay={(event) => onVideoPlay(event.currentTarget)}
                        onError={() => setVideoState('error')}
                    />
                )}
                {videoState === 'error' && (
                    <div className="video-error">
                        <p>This video couldn’t load. Please try again.</p>
                        <button
                            type="button"
                            onClick={() => {
                                focusTrigger.current = true;
                                setVideoState('poster');
                            }}
                        >
                            Try again
                        </button>
                    </div>
                )}
            </div>
            <div className="listing-body">
                <h3 className="listing-heading" title={item.heading}>
                    {item.heading}
                </h3>
                <p className="listing-description">{item.description}</p>
                <div className="listing-price-slot">{price && <p className="listing-price">{price}</p>}</div>
                <WhatsAppLink
                    className="button listing-enquiry"
                    aria-label={`Enquire on WhatsApp about ${item.heading}`}
                    message={`Hi, I am interested in: ${item.heading}`}
                >
                    <Icon name="whatsapp" />
                    WhatsApp enquiry
                    <Icon name="arrow" />
                </WhatsAppLink>
            </div>
        </article>
    );
}
