import { SiteImage, SiteLink, WhatsAppLink } from '@/components/site/site-elements';
import { SiteLayout } from '@/components/site/site-layout';

export default function Contact() {
    return (
        <SiteLayout page="contact">
            <section className="hero contact-hero" aria-labelledby="hero-title">
                <SiteImage
                    className="hero-photo"
                    src="assets/writer-desk.jpg"
                    alt="Illustrative Kerala-inspired writing desk beside a window overlooking greenery"
                    width={1536}
                    height={1024}
                    fetchPriority="high"
                />
                <div className="hero-shade"></div>
                <div className="hero-content">
                    <h1 id="hero-title">
                        Contact <em>Kampuram Business Group</em>
                    </h1>
                    <p>Madari Tower, Manjeri, Kerala</p>
                </div>
            </section>
            <section className="reach-section" id="reach-us" aria-labelledby="reach-title">
                <div className="reach-copy">
                    <h2 id="reach-title">Phone and WhatsApp</h2>
                    <div className="contact-methods">
                        <WhatsAppLink
                            className="contact-method whatsapp-method"
                            message="Hi, I would like to know more about Kampuram Business Group."
                        >
                            <span className="method-icon">
                                <svg aria-hidden="true">
                                    <use href="#whatsapp" />
                                </svg>
                            </span>
                            <span className="method-copy">
                                <strong>Chat on WhatsApp</strong>
                            </span>
                            <svg className="method-arrow" aria-hidden="true">
                                <use href="#arrow" />
                            </svg>
                        </WhatsAppLink>
                        <a className="contact-method" href="tel:+919388002975">
                            <span className="method-icon">
                                <svg aria-hidden="true">
                                    <use href="#phone" />
                                </svg>
                            </span>
                            <span className="method-copy">
                                <span className="method-label">PHONE</span>
                                <strong>+91 93880 02975</strong>
                            </span>
                            <svg className="method-arrow" aria-hidden="true">
                                <use href="#arrow" />
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="visit-panel">
                    <div className="visit-header">
                        <span className="location-icon">
                            <svg aria-hidden="true">
                                <use href="#pin" />
                            </svg>
                        </span>
                    </div>
                    <h2>Office address</h2>
                    <address>
                        <strong>Madari Tower</strong>
                        <span>Near Civil Station, Kacherippadi</span>
                        <span>Manjeri – 676121</span>
                        <span>Malappuram District, Kerala, India</span>
                    </address>
                    <a
                        className="button button-orange directions-button"
                        href="https://www.google.com/maps/search/?api=1&amp;query=Madari%20Tower%2C%20Near%20Civil%20Station%2C%20Kacherippadi%2C%20Manjeri%20676121%2C%20Malappuram%2C%20Kerala%2C%20India"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Get directions on Google Maps{' '}
                        <svg aria-hidden="true">
                            <use href="#arrow" />
                        </svg>
                    </a>
                </div>
            </section>
            <section className="contact-businesses" aria-labelledby="businesses-title">
                <div className="section-heading">
                    <h2 id="businesses-title">Our businesses</h2>
                </div>
                <div className="contact-business-links">
                    <SiteLink to="media">
                        <span className="business-link-logo">
                            <SiteImage src="assets/kampuram-ad-media-trimmed.png" width={1679} height={1320} alt="" loading="lazy" />
                        </span>
                        <span>
                            <strong>Kampuram Media</strong>
                            <small>Advertising &amp; creative work</small>
                        </span>
                        <svg aria-hidden="true">
                            <use href="#arrow" />
                        </svg>
                    </SiteLink>
                    <SiteLink to="cards">
                        <span className="business-link-logo">
                            <SiteImage src="assets/cardskendra-logo-trimmed.png" width={1220} height={990} alt="" loading="lazy" />
                        </span>
                        <span>
                            <strong>Cards Kendra</strong>
                            <small>Wedding invitations</small>
                        </span>
                        <svg aria-hidden="true">
                            <use href="#arrow" />
                        </svg>
                    </SiteLink>
                    <SiteLink to="books">
                        <span className="business-link-logo">
                            <SiteImage src="assets/kampuram-books.png" width={937} height={527} alt="" loading="lazy" />
                        </span>
                        <span>
                            <strong>Kampuram Books</strong>
                            <small>Books &amp; publications</small>
                        </span>
                        <svg aria-hidden="true">
                            <use href="#arrow" />
                        </svg>
                    </SiteLink>
                    <SiteLink to="digi-world">
                        <span className="business-link-logo">
                            <SiteImage src="assets/kampuram-logo-trimmed.png" width={700} height={264} alt="" loading="lazy" />
                        </span>
                        <span>
                            <strong>Kampuram Digi World</strong>
                            <small>Design &amp; video production</small>
                        </span>
                        <svg aria-hidden="true">
                            <use href="#arrow" />
                        </svg>
                    </SiteLink>
                </div>
            </section>
        </SiteLayout>
    );
}
