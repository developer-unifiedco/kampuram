import { Catalogue } from '@/components/site/catalogue';
import { EnquirySection } from '@/components/site/enquiry-section';
import { SiteImage } from '@/components/site/site-elements';
import { SiteLayout } from '@/components/site/site-layout';

export default function Cards() {
    return (
        <SiteLayout page="cards">
            <section className="hero ads-hero" aria-labelledby="ads-title">
                <SiteImage
                    className="hero-photo"
                    src="assets/cards/ivory-gold.jpg"
                    alt="An ivory and gold wedding invitation with a matching envelope and ribbon"
                    width={1024}
                    height={1024}
                    fetchPriority="high"
                />
                <div className="hero-shade"></div>
                <div className="hero-content">
                    <h1 id="ads-title">
                        Cards <em>Kendra</em>
                    </h1>
                    <p>Wedding invitation cards for every style and budget</p>
                </div>
                <div className="ads-brand-stamp">
                    <SiteImage
                        src="assets/cardskendra-logo-trimmed.png"
                        width={1220}
                        height={990}
                        alt="Cards Kendra — exclusive wedding cards showroom"
                    />
                </div>
            </section>

            <Catalogue section="cards" />
            <EnquirySection page="cards" heading="Wedding invitation enquiries" description="Ask about an invitation design, materials or pricing." />
        </SiteLayout>
    );
}
