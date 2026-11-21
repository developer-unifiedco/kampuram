import catalogue from './catalogue.json';

export type CatalogueSection = keyof typeof catalogue.settings.sections;
export type Listing = (typeof catalogue.listings)[number];

export const mediaFilters = [
    { key: 'all', label: 'All' },
    { key: 'images', label: 'Images' },
    { key: 'videos', label: 'Videos' },
] as const;

export type MediaFilter = (typeof mediaFilters)[number]['key'];

const searchText = (value: string) =>
    value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase();

export function searchListings(section: CatalogueSection, query: string, sourceListings?: Listing[]) {
    const terms = searchText(query).trim().split(/\s+/).filter(Boolean);
    const pool = sourceListings ?? catalogue.listings;

    return pool
        .filter((item) => item.section === section && item.status === 'published')
        .filter((item) => {
            const content = searchText(`${item.heading} ${item.description || ''}`);

            return terms.every((term) => content.includes(term));
        })
        .sort((a, b) => a.displayOrder - b.displayOrder || Date.parse(b.dateAdded) - Date.parse(a.dateAdded) || String(a.id).localeCompare(String(b.id)));
}

export function filterListings(listings: Listing[], filter: MediaFilter) {
    return filter === 'all' ? listings : listings.filter((item) => item.type === (filter === 'videos' ? 'video' : 'image'));
}

export function readCatalogueUrl(url: string, allowVideo: boolean) {
    const parameters = new URL(url, 'http://localhost').searchParams;
    const filter = parameters.get('filter');

    return {
        query: (parameters.get('q') ?? '').slice(0, 150),
        filter: allowVideo && (filter === 'images' || filter === 'videos') ? filter : 'all',
    } satisfies { query: string; filter: MediaFilter };
}

export function formatCataloguePrice(amount: number | null, section: CatalogueSection) {
    if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 0) return '';

    const value = amount.toLocaleString('en-IN', {
        useGrouping: false,
        minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
        maximumFractionDigits: 2,
    });

    return `₹ ${value}/-${section === 'cards' ? ' per card' : ''}`;
}
