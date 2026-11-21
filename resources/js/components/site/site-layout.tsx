import { sitePages, type SitePage } from '@/lib/site/pages';
import { Head } from '@inertiajs/react';
import { useEffect, useLayoutEffect, useRef, useState, type PropsWithChildren } from 'react';
import { EnquiryFallback, Icon, SiteImage, SiteLink, useSiteAsset, WhatsAppButton, WhatsAppLink } from './site-elements';
import { useSiteMotion } from './use-site-motion';

const navigation: { page: SitePage; header: string; footer?: string; showLogo?: boolean }[] = [
    { page: 'home', header: 'Home' },
    { page: 'media', header: 'Kampuram Media', footer: 'Media', showLogo: true },
    { page: 'cards', header: 'Cards Kendra', showLogo: true },
    { page: 'books', header: 'Kampuram Books', footer: 'Books', showLogo: true },
    { page: 'digi-world', header: 'Digi World', showLogo: true },
    { page: 'contact', header: 'Contact' },
];

function IconLibrary({ phone }: { phone: boolean }) {
    return (
        <svg className="icon-library" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <symbol id="arrow" viewBox="0 0 24 24">
                <path d="M5 12h14M13 6l6 6-6 6" />
            </symbol>
            <symbol id="whatsapp" viewBox="0 0 24 24">
                <path d="M20.5 11.6a8.5 8.5 0 0 1-12.6 7.5L3 20.5l1.4-4.8a8.5 8.5 0 1 1 16.1-4.1Z" />
                <path d="M8.4 7.7c-.6.2-.8 1-.6 1.8.6 2.4 2.5 4.4 5 5.3.8.3 1.7.2 2.1-.4l.5-.9-2.3-1.1-.8.8c-1.1-.5-2-1.4-2.5-2.5l.6-.8-1-2.2Z" />
            </symbol>
            <symbol id="pin" viewBox="0 0 24 24">
                <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
                <circle cx="12" cy="10" r="2.5" />
            </symbol>
            {phone && (
                <symbol id="phone" viewBox="0 0 24 24">
                    <path d="m7 3 3 5-2.5 2.5a16 16 0 0 0 6 6L16 14l5 3c-1 4-3 5-6 4C9 19 5 15 3 9 2 6 3 4 7 3Z" />
                </symbol>
            )}
        </svg>
    );
}

function BrandImage({ page, footer = false }: { page: SitePage; footer?: boolean }) {
    const groupLogo = page === 'home' || page === 'contact';

    return (
        <SiteImage {...sitePages[page].logo} className={groupLogo ? 'group-logo' : undefined} loading={groupLogo && footer ? 'lazy' : undefined} />
    );
}

function SiteHeader({ page }: { page: SitePage }) {
    const [open, setOpen] = useState(false);
    const header = useRef<HTMLElement>(null);
    const toggle = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!open) return;

        const close = () => setOpen(false);
        const desktop = window.matchMedia('(min-width: 701px)');
        const closeOutside = (event: MouseEvent) => {
            if (event.target instanceof Node && !header.current?.contains(event.target)) close();
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                close();
                toggle.current?.focus();
            }
        };

        document.addEventListener('click', closeOutside);
        document.addEventListener('keydown', closeOnEscape);
        desktop.addEventListener('change', close);

        return () => {
            document.removeEventListener('click', closeOutside);
            document.removeEventListener('keydown', closeOnEscape);
            desktop.removeEventListener('change', close);
        };
    }, [open]);

    return (
        <header className="site-header" ref={header}>
            <SiteLink className="brand" to="home" aria-label="Kampuram Business Group home" onClick={() => setOpen(false)}>
                <BrandImage page={page} />
            </SiteLink>
            <button
                type="button"
                className="menu-toggle"
                ref={toggle}
                aria-controls="main-nav"
                aria-expanded={open}
                aria-label={open ? 'Close navigation' : 'Open navigation'}
                onClick={() => setOpen(!open)}
            >
                <span />
                <span />
            </button>
            <nav id="main-nav" aria-label="Main navigation" className={open ? 'is-open' : undefined}>
                {navigation.map((item) => {
                    const active = item.page === page;
                    const classes = [item.showLogo && 'nav-business', active && 'nav-home'].filter(Boolean).join(' ');

                    return (
                        <SiteLink
                            key={item.page}
                            to={item.page}
                            className={classes || undefined}
                            aria-current={active ? 'page' : undefined}
                            onClick={() => setOpen(false)}
                        >
                            {item.showLogo ? (
                                <>
                                    <span>{item.header}</span>
                                    <span className="nav-logo">
                                        <SiteImage {...sitePages[item.page].logo} alt="" />
                                    </span>
                                </>
                            ) : (
                                item.header
                            )}
                        </SiteLink>
                    );
                })}
            </nav>
        </header>
    );
}

function SiteFooter({ page }: { page: SitePage }) {
    const logo = <BrandImage page={page} footer />;

    return (
        <footer>
            <div className="footer-top">
                {page === 'home' ? (
                    <a className="brand" href="#top">
                        {logo}
                    </a>
                ) : (
                    <SiteLink className="brand" to="home">
                        {logo}
                    </SiteLink>
                )}
                <a href="#top" className="back-top">
                    Back to top
                </a>
            </div>
            <div className="footer-bottom">
                <span>
                    © <span id="year">{new Date().getFullYear()}</span> Kampuram Business Group. All rights reserved.
                </span>
                <nav aria-label="Footer navigation">
                    {navigation.map((item) => (
                        <SiteLink key={item.page} to={item.page} aria-current={item.page === page ? 'page' : undefined}>
                            {item.footer ?? item.header}
                        </SiteLink>
                    ))}
                </nav>
            </div>
        </footer>
    );
}

export function SiteLayout({ page, children }: PropsWithChildren<{ page: SitePage }>) {
    const info = sitePages[page];
    const asset = useSiteAsset();
    const dialog = useRef<HTMLDialogElement>(null);
    const [message, setMessage] = useState('');
    const FloatingEnquiry = page === 'contact' || page === 'digi-world' ? WhatsAppLink : WhatsAppButton;

    useLayoutEffect(() => {
        document.body.classList.add(info.bodyClass);

        return () => document.body.classList.remove(info.bodyClass);
    }, [info.bodyClass]);

    useSiteMotion(page === 'home' || page === 'contact' || page === 'digi-world');

    return (
        <EnquiryFallback.Provider
            value={
                page === 'home'
                    ? (text) => {
                          setMessage(text);
                          dialog.current?.showModal();
                      }
                    : null
            }
        >
            <Head title={info.title}>
                <meta head-key="theme-color" name="theme-color" content={info.themeColor} />
                <meta head-key="description" name="description" content={info.description} />
                <link head-key="site-icon" rel="icon" type="image/png" sizes="64x64" href={asset(info.icon)} />
                {info.styles.map((style) => (
                    <link key={style} head-key={style} rel="stylesheet" href={asset(style)} />
                ))}
            </Head>
            <a className="skip-link" href="#main">
                Skip to content
            </a>
            <IconLibrary phone={page === 'contact'} />
            <div className="site-shell" id="top">
                <SiteHeader page={page} />
                <main id="main">{children}</main>
                <SiteFooter page={page} />
            </div>
            <FloatingEnquiry className="floating-whatsapp" message={info.enquiry} aria-label="Chat on WhatsApp">
                <Icon name="whatsapp" />
                <span>WhatsApp</span>
            </FloatingEnquiry>
            {page === 'home' && (
                <dialog
                    id="contact-dialog"
                    ref={dialog}
                    aria-labelledby="dialog-title"
                    onClick={(event) => {
                        const bounds = event.currentTarget.getBoundingClientRect();
                        if (
                            event.clientX < bounds.left ||
                            event.clientX > bounds.right ||
                            event.clientY < bounds.top ||
                            event.clientY > bounds.bottom
                        ) {
                            event.currentTarget.close();
                        }
                    }}
                >
                    <button type="button" className="dialog-close" aria-label="Close dialog" onClick={() => dialog.current?.close()}>
                        ×
                    </button>
                    <span className="dialog-icon">
                        <Icon name="whatsapp" />
                    </span>
                    <h2 id="dialog-title">WhatsApp contact</h2>
                    <p id="dialog-message">{message}</p>
                    <p className="dialog-note">Please use the phone number on our Contact page.</p>
                    <button type="button" className="button button-orange dialog-done" onClick={() => dialog.current?.close()}>
                        Got it <Icon name="arrow" />
                    </button>
                </dialog>
            )}
        </EnquiryFallback.Provider>
    );
}
