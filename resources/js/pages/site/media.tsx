import { Catalogue } from '@/components/site/catalogue';
import { EnquirySection } from '@/components/site/enquiry-section';
import { SiteImage } from '@/components/site/site-elements';
import { SiteLayout } from '@/components/site/site-layout';

export default function Media() {
    return (
        <SiteLayout page="media">
            <section className="hero ads-hero" aria-labelledby="ads-title">
                <SiteImage
                    className="hero-photo"
                    src="assets/advertising-creatives.jpg"
                    alt="Illustrative Kerala cultural, café and local-story advertising creatives"
                    width={1536}
                    height={1024}
                    fetchPriority="high"
                />
                <div className="hero-shade"></div>
                <div className="hero-content">
                    <h1 id="ads-title">
                        Kampuram Media
                        <br />
                        <em>Advertisements</em>
                    </h1>
                    <p>Creative ads for print, digital and outdoor</p>
                </div>
                <div className="ads-brand-stamp">
                    <SiteImage
                        src="assets/kampuram-ad-media-trimmed.png"
                        width={1046}
                        height={750}
                        alt="Kampuram Admedia — newspaper, TV, radio ad agency"
                    />
                </div>
            </section>

            <Catalogue section="media" />
            <EnquirySection page="media" heading="Advertising enquiries" description="Ask about print, digital or outdoor advertising." />
        </SiteLayout>
    );
}
