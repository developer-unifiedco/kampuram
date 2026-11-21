import { filterListings, mediaFilters, readCatalogueUrl, searchListings, type CatalogueSection, type Listing, type MediaFilter } from '@/lib/site/catalogue-utils';
import catalogue from '@/lib/site/catalogue.json';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { ListingCard } from './listing-card';
import { Icon } from './site-elements';

const sections = {
    media: {
        id: 'advertisements',
        heading: 'Advertising portfolio',
        searchId: 'ad-search',
        searchLabel: 'Search advertisements',
        note: 'Sample advertisements and prices.',
        searchAction: 'filter advertisements',
    },
    cards: {
        id: 'invitations',
        heading: 'Wedding invitation designs',
        searchId: 'card-search',
        searchLabel: 'Search wedding invitations',
        note: 'Sample invitation designs and prices.',
        searchAction: 'search invitations',
    },
    books: {
        id: 'books',
        heading: 'Book catalogue',
        searchId: 'book-search',
        searchLabel: 'Search books',
        note: 'Sample book titles, covers and prices.',
        searchAction: 'search books',
    },
};

const pageSize = catalogue.settings.listingPageSize;

function CatalogueSkeletons() {
    return Array.from({ length: 8 }, (_, index) => (
        <div className="listing-skeleton" aria-hidden="true" key={index}>
            <div className="skeleton-media" />
            <div className="skeleton-copy">
                <div className="skeleton-line" />
                <div className="skeleton-line short" />
                <div className="skeleton-button" />
            </div>
        </div>
    ));
}

export function Catalogue({ section }: { section: CatalogueSection }) {
    const info = sections[section];
    const { allowVideo, aspectRatio } = catalogue.settings.sections[section];
    const page = usePage<{ listings?: Listing[] }>();
    const pageListings = page.props.listings;
    const [search, setSearch] = useState(() => readCatalogueUrl(page.url, allowVideo));
    const [input, setInput] = useState(search.query);
    const [visible, setVisible] = useState(pageSize);
    const [revision, setRevision] = useState(0);
    const [ready, setReady] = useState(false);
    const inputField = useRef<HTMLInputElement>(null);
    const allFilter = useRef<HTMLButtonElement>(null);
    const grid = useRef<HTMLDivElement>(null);
    const searchTimer = useRef<number>(undefined);
    const firstNew = useRef<number>(null);
    const { query, filter } = search;

    const foundBySearch = searchListings(section, query, pageListings);
    const matching = filterListings(foundBySearch, filter);
    const shown = Math.min(visible, matching.length);
    const label = filter === 'all' ? info.id : filter;
    const shownLabel = matching.length === 1 ? label.slice(0, -1) : label;
    const emptyTitle = query.trim() ? `No matching ${info.id}` : `No ${label} yet`;
    const allLoaded = visible > pageSize && shown >= matching.length;

    useEffect(() => {
        let secondFrame: number;
        const firstFrame = requestAnimationFrame(() => {
            secondFrame = requestAnimationFrame(() => setReady(true));
        });
        const path = window.location.pathname;
        const syncHistory = () => {
            if (window.location.pathname !== path) return;

            window.clearTimeout(searchTimer.current);
            const next = readCatalogueUrl(window.location.href, allowVideo);
            setInput(next.query);
            setSearch(next);
            setVisible(pageSize);
            setRevision((value) => value + 1);
        };

        window.addEventListener('popstate', syncHistory);

        return () => {
            cancelAnimationFrame(firstFrame);
            cancelAnimationFrame(secondFrame);
            window.clearTimeout(searchTimer.current);
            window.removeEventListener('popstate', syncHistory);
        };
    }, [allowVideo]);

    useEffect(() => {
        if (firstNew.current === null) return;

        const card = grid.current?.children[firstNew.current];
        if (card instanceof HTMLElement) {
            card.tabIndex = -1;
            card.focus({ preventScroll: true });
        }
        firstNew.current = null;
    }, [visible]);

    const applySearch = (value: string, nextFilter?: MediaFilter) => {
        window.clearTimeout(searchTimer.current);
        setSearch({ query: value, filter: nextFilter ?? filter });
        setVisible(pageSize);
        setRevision((current) => current + 1);

        const url = new URL(window.location.href);
        if (value.trim()) url.searchParams.set('q', value.trim());
        else url.searchParams.delete('q');

        if (nextFilter && allowVideo) url.searchParams.set('filter', nextFilter);
        if (nextFilter && !allowVideo) url.searchParams.delete('filter');

        if (url.href !== window.location.href) {
            const visit = { url: `${url.pathname}${url.search}${url.hash}`, preserveState: true, preserveScroll: true };
            if (nextFilter) router.push(visit);
            else router.replace(visit);
        }
    };

    const clearSearch = (resetFilter = false) => {
        setInput('');
        applySearch('', resetFilter ? 'all' : undefined);
        if (resetFilter && allowVideo) allFilter.current?.focus();
        else inputField.current?.focus();
    };

    const stopOtherVideos = (playing: HTMLVideoElement) => {
        grid.current?.querySelectorAll('video').forEach((video) => {
            if (video !== playing) video.pause();
        });
    };

    return (
        <section className="catalogue-section" id={info.id} aria-labelledby="catalogue-title">
            <div className="section-heading catalogue-heading">
                <h2 id="catalogue-title">{info.heading}</h2>
            </div>
            <div className="catalogue-toolbar">
                <form
                    className="catalogue-search"
                    role="search"
                    aria-label={info.searchLabel}
                    onSubmit={(event) => {
                        event.preventDefault();
                        applySearch(input);
                    }}
                >
                    <label className="visually-hidden" htmlFor={info.searchId}>
                        {info.searchLabel}
                    </label>
                    <svg aria-hidden="true" viewBox="0 0 24 24">
                        <circle cx="10.5" cy="10.5" r="6.5" />
                        <path d="m16 16 4 4" />
                    </svg>
                    <input
                        ref={inputField}
                        id={info.searchId}
                        type="search"
                        name="q"
                        placeholder={`${info.searchLabel}…`}
                        maxLength={150}
                        autoComplete="off"
                        aria-controls="listing-grid"
                        value={input}
                        onChange={(event) => {
                            const value = event.currentTarget.value;
                            setInput(value);
                            window.clearTimeout(searchTimer.current);
                            if (!(event.nativeEvent instanceof InputEvent && event.nativeEvent.isComposing)) {
                                searchTimer.current = window.setTimeout(() => applySearch(value), 180);
                            }
                        }}
                        onCompositionEnd={(event) => applySearch(event.currentTarget.value)}
                    />
                    <button
                        className="search-clear"
                        id="clear-search"
                        type="button"
                        aria-label="Clear search"
                        hidden={!input}
                        onClick={() => clearSearch()}
                    >
                        ×
                    </button>
                </form>
                {allowVideo && (
                    <div className="filter-pills" role="group" aria-label="Filter advertisements">
                        {mediaFilters.map(({ key, label }) => (
                            <button
                                key={key}
                                ref={key === 'all' ? allFilter : undefined}
                                type="button"
                                className={filter === key ? 'filter-pill is-active' : 'filter-pill'}
                                data-filter={key}
                                aria-pressed={filter === key}
                                onClick={() => applySearch(input, key)}
                            >
                                {label} <span data-count={key}>{filterListings(foundBySearch, key).length}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <p className="results-count catalogue-status" id="results-count" role="status" aria-live="polite">
                {ready
                    ? `Showing ${shown} of ${matching.length} ${shownLabel}${query.trim() ? ` for “${query.trim()}”` : ''}${allLoaded ? '. All results loaded.' : ''}`
                    : `Loading ${info.id}…`}
            </p>
            <div className="listing-grid" id="listing-grid" ref={grid} aria-busy={!ready} hidden={ready && matching.length === 0}>
                {ready ? (
                    matching
                        .slice(0, visible)
                        .map((item, index) => (
                            <ListingCard
                                key={`${revision}:${item.id}`}
                                item={item}
                                section={section}
                                aspectRatio={aspectRatio}
                                allowVideo={allowVideo}
                                delay={(index % 4) * 55}
                                onVideoPlay={stopOtherVideos}
                            />
                        ))
                ) : (
                    <CatalogueSkeletons />
                )}
            </div>
            <div className="catalogue-empty" id="catalogue-empty" hidden={!ready || matching.length > 0}>
                <h3 id="empty-title">{emptyTitle}</h3>
                <p>{query.trim() ? 'Try a different search term or clear your search.' : ''}</p>
                <button
                    type="button"
                    className="button button-orange"
                    id="reset-filter"
                    hidden={!query.trim() && filter === 'all'}
                    onClick={() => clearSearch(true)}
                >
                    {query.trim() ? 'Clear search & view all ' : 'View all advertisements '}
                    <Icon name="arrow" />
                </button>
            </div>
            <div className="load-more-row">
                <button
                    type="button"
                    className="button load-more"
                    id="load-more"
                    hidden={!ready || shown >= matching.length}
                    onClick={() => {
                        firstNew.current = shown;
                        setVisible(visible + pageSize);
                    }}
                >
                    Load more <Icon name="arrow" />
                </button>
            </div>
            <p className="sample-note">{info.note}</p>
            <noscript>
                <p className="noscript-message">
                    Enable JavaScript to browse and {info.searchAction}. You can still contact us using the phone number below.
                </p>
            </noscript>
        </section>
    );
}
