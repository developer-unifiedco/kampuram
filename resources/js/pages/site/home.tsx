import { EnquirySection } from '@/components/site/enquiry-section';
import { SiteImage, SiteLink } from '@/components/site/site-elements';
import { SiteLayout } from '@/components/site/site-layout';

export default function Home() {
    return (
        <SiteLayout page="home">
            <section className="hero" aria-labelledby="hero-title">
                <SiteImage
                    className="hero-photo"
                    src="assets/writer-desk.jpg"
                    alt="A Kerala-inspired writer’s desk with an open notebook, fountain pen and well-loved books beside a window overlooking greenery"
                    fetchPriority="high"
                    width={1536}
                    height={1024}
                />
                <div className="hero-shade"></div>
                <div className="hero-content">
                    <h1 id="hero-title">
                        Kampuram <br />
                        <em>Business Group</em>
                    </h1>
                    <p className="hero-location">Based in Manjeri, Kerala.</p>
                    <p>
                        Explore advertising, wedding invitations and books, or talk to our Digi World team about graphic design and video production.
                    </p>
                    <a className="button button-orange" href="#businesses">
                        Explore our businesses{' '}
                        <svg aria-hidden="true">
                            <use href="#arrow" />
                        </svg>
                    </a>
                </div>
            </section>

            <section className="business-section section-space" id="businesses" aria-labelledby="business-title">
                <div className="section-heading">
                    <h2 id="business-title">Our businesses</h2>
                    <p>
                        Explore the catalogue or services
                        <br /> that match your enquiry.
                    </p>
                </div>
                <div className="business-grid">
                    <article className="business-card" id="media">
                        <div className="card-image">
                            <SiteImage
                                src="assets/advertising-creatives.jpg"
                                alt="Illustrative advertising posters featuring Kerala culture, a café campaign and a matching video-ad preview on a phone"
                                width={1536}
                                height={1024}
                                loading="lazy"
                            />
                        </div>
                        <div className="card-body">
                            <div className="business-identity">
                                <div className="business-logo">
                                    <SiteImage
                                        src="assets/kampuram-ad-media-trimmed.png"
                                        alt="Kampuram Admedia logo"
                                        width={1046}
                                        height={750}
                                        loading="lazy"
                                    />
                                </div>
                                <div className="business-heading">
                                    <h3>Kampuram Media</h3>
                                </div>
                            </div>
                            <p>Advertising for print, digital and outdoor media.</p>
                            <SiteLink className="card-link" to="media">
                                Explore advertisements{' '}
                                <span>
                                    <svg aria-hidden="true">
                                        <use href="#arrow" />
                                    </svg>
                                </span>
                            </SiteLink>
                        </div>
                    </article>
                    <article className="business-card" id="cards">
                        <div className="card-image">
                            <SiteImage
                                src="assets/invitations.svg"
                                alt="Illustrative cream wedding invitation with gold botanical details and a terracotta envelope"
                                width={900}
                                height={600}
                                loading="lazy"
                            />
                        </div>
                        <div className="card-body">
                            <div className="business-identity">
                                <div className="business-logo">
                                    <SiteImage
                                        src="assets/cardskendra-logo-trimmed.png"
                                        alt="Cards Kendra logo"
                                        width={1220}
                                        height={990}
                                        loading="lazy"
                                    />
                                </div>
                                <div className="business-heading">
                                    <h3>Cards Kendra</h3>
                                </div>
                            </div>
                            <p>Wedding invitation cards for every style and budget.</p>
                            <SiteLink className="card-link" to="cards">
                                Explore invitations{' '}
                                <span>
                                    <svg aria-hidden="true">
                                        <use href="#arrow" />
                                    </svg>
                                </span>
                            </SiteLink>
                        </div>
                    </article>
                    <article className="business-card" id="books">
                        <div className="card-image">
                            <SiteImage
                                src="assets/literary-books.jpg"
                                alt="Illustrative literary paperbacks with Kerala-inspired cover art and an open book on a wooden reading table"
                                width={1536}
                                height={1024}
                                loading="lazy"
                            />
                        </div>
                        <div className="card-body">
                            <div className="business-identity">
                                <div className="business-logo">
                                    <SiteImage src="assets/kampuram-books.png" alt="Kampuram Books logo" width={937} height={527} loading="lazy" />
                                </div>
                                <div className="business-heading">
                                    <h3>Kampuram Books</h3>
                                </div>
                            </div>
                            <p>Publications, titles and new releases.</p>
                            <SiteLink className="card-link" to="books">
                                Browse books{' '}
                                <span>
                                    <svg aria-hidden="true">
                                        <use href="#arrow" />
                                    </svg>
                                </span>
                            </SiteLink>
                        </div>
                    </article>
                    <article className="business-card" id="digi-world">
                        <div className="card-image">
                            <SiteImage src="assets/creative-studio.jpg" alt="" width={1600} height={1067} loading="lazy" />
                        </div>
                        <div className="card-body">
                            <div className="business-identity">
                                <div className="business-logo digi-logo">
                                    <SiteImage src="assets/kampuram-logo-trimmed.png" width={700} height={264} alt="" loading="lazy" />
                                </div>
                                <div className="business-heading">
                                    <h3>Kampuram Digi World</h3>
                                </div>
                            </div>
                            <p>Social media ads, graphic design, motion video and video production.</p>
                            <SiteLink className="card-link" to="digi-world">
                                Explore Digi World services{' '}
                                <span>
                                    <svg aria-hidden="true">
                                        <use href="#arrow" />
                                    </svg>
                                </span>
                            </SiteLink>
                        </div>
                    </article>
                </div>
            </section>

            <section className="about-section section-space" id="about" aria-labelledby="about-title">
                <figure className="group-story-image">
                    <SiteImage
                        src="assets/literary-books.jpg"
                        alt="Illustrative Kerala-inspired book covers and an open book on a reading table"
                        width={1536}
                        height={1024}
                        loading="lazy"
                    />
                    <figcaption>Books and literature are part of Kampuram’s story.</figcaption>
                </figure>
                <div className="about-copy">
                    <h2 id="about-title">About Kampuram Business Group</h2>
                    <p>
                        Our story is rooted in Manjeri, Kerala, and in a founder’s close connection to writing and literature. Today, Kampuram
                        Business Group brings together advertising, digital design, wedding invitations, and books.
                    </p>
                    <p>
                        Each business has its own focus: an advertisement for a local business, an invitation for a wedding, a video for social media,
                        or a book to spend time with. This website brings them together so you can browse and speak to us about what you need.
                    </p>
                    <p>Our aim is to help people and businesses communicate through thoughtful words, design and print.</p>
                    <SiteLink className="text-link" to="contact">
                        Meet us in Manjeri{' '}
                        <svg aria-hidden="true">
                            <use href="#arrow" />
                        </svg>
                    </SiteLink>
                </div>
            </section>

            <section className="collection-section section-space" aria-labelledby="collection-title">
                <div className="section-heading">
                    <h2 id="collection-title">A closer look</h2>
                    <p>Sample designs and covers from our catalogues.</p>
                </div>
                <div className="collection-grid">
                    <article className="collection-item">
                        <div className="collection-image">
                            <SiteImage
                                src="assets/demo/cafe-opening.svg"
                                alt="Sample café advertisement with bold green lettering and a coffee cup illustration"
                                width={800}
                                height={600}
                                loading="lazy"
                            />
                        </div>
                        <h3>Advertising in print and on screen</h3>
                        <p>Browse image creatives and video previews. Search by name or switch between images and videos.</p>
                        <SiteLink className="text-link" to="media">
                            Browse advertisements{' '}
                            <svg aria-hidden="true">
                                <use href="#arrow" />
                            </svg>
                        </SiteLink>
                    </article>
                    <article className="collection-item">
                        <div className="collection-image">
                            <SiteImage
                                src="assets/cards/ivory-gold.jpg"
                                alt="Sample ivory wedding invitation with gold detailing"
                                width={1024}
                                height={1024}
                                loading="lazy"
                            />
                        </div>
                        <h3>An invitation for your occasion</h3>
                        <p>Explore wedding card designs, compare styles and check the price per card where listed.</p>
                        <SiteLink className="text-link" to="cards">
                            Browse wedding cards{' '}
                            <svg aria-hidden="true">
                                <use href="#arrow" />
                            </svg>
                        </SiteLink>
                    </article>
                    <article className="collection-item">
                        <div className="collection-image book-preview">
                            <SiteImage
                                src="assets/books/monsoon-pages.svg"
                                alt="Illustrative Monsoon Pages book jacket"
                                width={900}
                                height={1200}
                                loading="lazy"
                            />
                            <SiteImage
                                src="assets/books/river-remembers.svg"
                                alt="Illustrative The River Remembers book jacket"
                                width={900}
                                height={1200}
                                loading="lazy"
                            />
                        </div>
                        <h3>Books to browse at your own pace</h3>
                        <p>See covers, read title descriptions, and enquire about a book directly from its listing.</p>
                        <SiteLink className="text-link" to="books">
                            Browse books{' '}
                            <svg aria-hidden="true">
                                <use href="#arrow" />
                            </svg>
                        </SiteLink>
                    </article>
                </div>
            </section>

            <section className="enquiry-guide section-space" aria-labelledby="enquiry-title">
                <div className="guide-intro">
                    <h2 id="enquiry-title">
                        Found something
                        <br />
                        you have in mind?
                    </h2>
                    <p>You can enquire about a listing or discuss a new design. There is no online checkout; talk to us on WhatsApp for details.</p>
                    <SiteLink className="text-link" to="digi-world">
                        Need a design or video?{' '}
                        <svg aria-hidden="true">
                            <use href="#arrow" />
                        </svg>
                    </SiteLink>
                </div>
                <div className="guide-items">
                    <article>
                        <h3>Send the name or reference</h3>
                        <p>Use a listing’s WhatsApp button to include its name automatically, or share an image of the style you like.</p>
                    </article>
                    <article>
                        <h3>Tell us the details</h3>
                        <p>
                            For invitations, include your quantity and wedding date. For design work, tell us the format, content and date you need
                            it.
                        </p>
                    </article>
                    <article>
                        <h3>Confirm before you proceed</h3>
                        <p>Ask about availability, the final price and timing directly with the team before placing an order.</p>
                    </article>
                </div>
            </section>

            <EnquirySection heading="Contact Kampuram Business Group" description="Call or message us about any of our businesses." />
        </SiteLayout>
    );
}
