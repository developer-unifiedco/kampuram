import { Catalogue } from '@/components/site/catalogue';
import { EnquirySection } from '@/components/site/enquiry-section';
import { SiteImage } from '@/components/site/site-elements';
import { SiteLayout } from '@/components/site/site-layout';

export default function Books() {
    return (
        <SiteLayout page="books">
            <section className="hero ads-hero" aria-labelledby="ads-title">
                <SiteImage
                    className="hero-photo"
                    src="assets/literary-books.jpg"
                    alt="Illustrative literary paperbacks and an open book on a warm wooden reading table"
                    width={1536}
                    height={1024}
                    fetchPriority="high"
                />
                <div className="hero-shade"></div>
                <div className="hero-content">
                    <h1 id="ads-title">
                        Kampuram <em>Books</em>
                    </h1>
                    <p>Publications, titles and new releases</p>
                </div>
                <div className="ads-brand-stamp">
                    <SiteImage src="assets/kampuram-books.png" width={937} height={527} alt="Kampuram Books logo" />
                </div>
            </section>

            <Catalogue section="books" />
            <EnquirySection page="books" heading="Book enquiries" description="Ask about a title or its availability." />
        </SiteLayout>
    );
}
