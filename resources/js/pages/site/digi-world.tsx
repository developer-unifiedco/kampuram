import { SiteImage, WhatsAppLink, useSiteAsset } from '@/components/site/site-elements';
import { SiteLayout } from '@/components/site/site-layout';

interface DigiServiceItem {
    id: number;
    title: string;
    description: string;
    formats: string[];
    image: string | null;
}

interface DigiWorldProps {
    services?: DigiServiceItem[];
}

export default function DigiWorld({ services }: DigiWorldProps) {
    const asset = useSiteAsset();

    return (
        <SiteLayout page="digi-world">
            <section className="hero digi-hero" aria-labelledby="hero-title">
                <SiteImage className="hero-photo" src="assets/creative-studio.jpg" alt="" width={1600} height={1067} fetchPriority="high" />
                <div className="hero-shade"></div>
                <div className="hero-content">
                    <h1 id="hero-title">
                        Kampuram <em>Digi World</em>
                    </h1>
                    <p>Social media ads, graphic design and video production in Manjeri.</p>
                    <div className="digi-hero-actions">
                        <a className="button button-orange" href="#work">
                            See design &amp; video examples{' '}
                            <svg aria-hidden="true">
                                <use href="#arrow" />
                            </svg>
                        </a>
                        <a className="digi-hero-link" href="#services">
                            Explore services
                        </a>
                    </div>
                </div>
            </section>

            <section className="digi-services section-space" id="services" aria-labelledby="services-title">
                <div className="section-heading">
                    <h2 id="services-title">
                        Design for print.
                        <br />
                        Content for your screen.
                    </h2>
                    <p>
                        From a visiting card to a video advertisement,
                        <br /> tell us what you need to communicate.
                    </p>
                </div>
                <div className="digi-service-grid">
                    {services && services.length > 0 ? (
                        services.map((service) => (
                            <article key={service.id} className="digi-service">
                                {service.image && (
                                    <SiteImage
                                        className="digi-service-image"
                                        src={service.image}
                                        alt={service.title}
                                        width={800}
                                        height={600}
                                        loading="lazy"
                                    />
                                )}
                                <h3>{service.title}</h3>
                                {service.description && <p>{service.description}</p>}
                                {service.formats && service.formats.length > 0 && (
                                    <ul className="service-formats">
                                        {service.formats.map((fmt, idx) => (
                                            <li key={idx}>{fmt}</li>
                                        ))}
                                    </ul>
                                )}
                                <WhatsAppLink
                                    className="button button-whatsapp"
                                    aria-label={`Enquire about ${service.title} on WhatsApp`}
                                    message={`Hi, I would like to enquire about ${service.title} from Kampuram Digi World.`}
                                >
                                    <svg aria-hidden="true">
                                        <use href="#whatsapp" />
                                    </svg>{' '}
                                    Enquire on WhatsApp
                                </WhatsAppLink>
                            </article>
                        ))
                    ) : (
                        <>
                            <article className="digi-service">
                                <SiteImage
                                    className="digi-service-image"
                                    src="assets/advertising-creatives.jpg"
                                    alt="Illustrative advertising posters with a matching social media video on a phone"
                                    width={1536}
                                    height={1024}
                                    loading="lazy"
                                />
                                <h3>Social media ads</h3>
                                <p>
                                    Creative posters for offers, announcements, events and product promotions. Share the message and where you plan to post
                                    it.
                                </p>
                                <ul className="service-formats">
                                    <li>Promotional posts</li>
                                    <li>Event announcements</li>
                                    <li>Social media creatives</li>
                                </ul>
                                <WhatsAppLink
                                    className="button button-whatsapp"
                                    aria-label="Enquire about social media ads on WhatsApp"
                                    message="Hi, I would like to enquire about social media ads from Kampuram Digi World."
                                >
                                    <svg aria-hidden="true">
                                        <use href="#whatsapp" />
                                    </svg>{' '}
                                    Enquire on WhatsApp
                                </WhatsAppLink>
                            </article>
                            <article className="digi-service">
                                <SiteImage
                                    className="digi-service-image"
                                    src="assets/digi/print-design.svg"
                                    alt="Illustrative brochure and visiting card layout in ivory, orange and green"
                                    width={800}
                                    height={600}
                                    loading="lazy"
                                />
                                <h3>Graphic design</h3>
                                <p>
                                    Design for the information you want people to notice or keep. Send your text, logo and required size to discuss the
                                    layout.
                                </p>
                                <ul className="service-formats">
                                    <li>Posters, banners &amp; notices</li>
                                    <li>Brochures</li>
                                    <li>Visiting cards</li>
                                </ul>
                                <WhatsAppLink
                                    className="button button-whatsapp"
                                    aria-label="Enquire about graphic design on WhatsApp"
                                    message="Hi, I would like to enquire about graphic design from Kampuram Digi World."
                                >
                                    <svg aria-hidden="true">
                                        <use href="#whatsapp" />
                                    </svg>{' '}
                                    Enquire on WhatsApp
                                </WhatsAppLink>
                            </article>
                            <article className="digi-service">
                                <SiteImage
                                    className="digi-service-image"
                                    src="assets/demo/advertisement-preview.jpg"
                                    alt="Sample creative with a mobile video composition beside printed posters"
                                    width={800}
                                    height={600}
                                    loading="lazy"
                                />
                                <h3>Motion video and video production</h3>
                                <p>
                                    Put your message into motion for a promotion or introduction. Discuss a motion creative or video production around your
                                    brief.
                                </p>
                                <ul className="service-formats">
                                    <li>Motion creatives</li>
                                    <li>Video advertisements</li>
                                    <li>Video production</li>
                                </ul>
                                <WhatsAppLink
                                    className="button button-whatsapp"
                                    aria-label="Enquire about motion video and video production on WhatsApp"
                                    message="Hi, I would like to enquire about motion video and video production from Kampuram Digi World."
                                >
                                    <svg aria-hidden="true">
                                        <use href="#whatsapp" />
                                    </svg>{' '}
                                    Enquire on WhatsApp
                                </WhatsAppLink>
                            </article>
                        </>
                    )}
                </div>
            </section>

            <section className="digi-work section-space" id="work" aria-labelledby="work-title">
                <div className="section-heading">
                    <h2 id="work-title">Images &amp; motion</h2>
                    <p>
                        Illustrative design samples and a silent demo clip.
                        <br /> These are not completed client projects.
                    </p>
                </div>
                <div className="digi-work-grid">
                    <figure className="work-example">
                        <SiteImage
                            src="assets/digi/social-design.svg"
                            alt="Sample café social media design featuring a coffee cup and the words Fresh Every Day"
                            width={800}
                            height={600}
                            loading="lazy"
                        />
                        <figcaption>
                            <h3>A social media promotion</h3>
                            <p>A single message, a clear visual and space for your business details.</p>
                        </figcaption>
                    </figure>
                    <figure className="work-example">
                        <SiteImage
                            src="assets/digi/print-design.svg"
                            alt="Sample brochure and visiting card design showing coordinated type and colours"
                            width={800}
                            height={600}
                            loading="lazy"
                        />
                        <figcaption>
                            <h3>A coordinated print design</h3>
                            <p>Carry the same colours and type across your brochure, notice and visiting card.</p>
                        </figcaption>
                    </figure>
                    <figure className="work-example motion-example">
                        <div className="motion-player">
                            <video
                                controls
                                playsInline
                                muted
                                preload="none"
                                poster={asset('assets/demo/advertisement-preview.jpg')}
                                aria-label="Play silent sample advertisement video"
                            >
                                <source src={asset('assets/demo/advertisement-preview.mp4')} type="video/mp4" />
                                <a href={asset('assets/demo/advertisement-preview.mp4')}>Open the sample video</a>
                            </video>
                        </div>
                        <figcaption>
                            <h3>A video creative in motion</h3>
                            <p>Play this short, silent preview to see an example of movement in an advertisement.</p>
                            <WhatsAppLink className="text-link" message="Hi, I would like to discuss a video with Kampuram Digi World.">
                                Discuss a video{' '}
                                <svg aria-hidden="true">
                                    <use href="#arrow" />
                                </svg>
                            </WhatsAppLink>
                        </figcaption>
                    </figure>
                </div>
            </section>

            <section className="digi-brief section-space" aria-labelledby="brief-title">
                <div className="brief-copy">
                    <h2 id="brief-title">
                        Tell us about
                        <br />
                        your next project.
                    </h2>
                    <p>A few details help us understand the work before discussing a price and timeline. You can send them together on WhatsApp.</p>
                    <WhatsAppLink
                        className="button button-whatsapp"
                        message={'Hi, I would like to discuss a project with Kampuram Digi World.\nService: \nRequired date: \nDetails: '}
                    >
                        <svg aria-hidden="true">
                            <use href="#whatsapp" />
                        </svg>{' '}
                        Send your brief
                    </WhatsAppLink>
                </div>
                <div className="brief-checklist">
                    <article>
                        <h3>What is it for?</h3>
                        <p>An offer, an opening, an event or a business introduction. Tell us who the design needs to reach.</p>
                    </article>
                    <article>
                        <h3>Where will it appear?</h3>
                        <p>Share the print size or social media format. For a video, include the length you have in mind.</p>
                    </article>
                    <article>
                        <h3>What should we include?</h3>
                        <p>Send the wording, logo, photographs and any reference designs, along with your required date.</p>
                    </article>
                </div>
            </section>

            <section className="digi-faq section-space" aria-labelledby="faq-title">
                <h2 id="faq-title">Before you enquire</h2>
                <div className="faq-list">
                    <details>
                        <summary>Can I request something beyond the examples?</summary>
                        <p>
                            Yes. The examples show possible formats. Message us about your poster, banner, notice, brochure, visiting card or video
                            requirement.
                        </p>
                    </details>
                    <details>
                        <summary>How do I get a price?</summary>
                        <p>
                            Send the type of work, size or video length, content and required date. The team can then discuss the scope and quote
                            directly with you.
                        </p>
                    </details>
                    <details>
                        <summary>Can I visit to discuss the work?</summary>
                        <p>
                            Find us at Madari Tower, Near Civil Station, Kacherippadi, Manjeri. Call +91 94465 48500 or +91 93880 02975 before your
                            visit to arrange a suitable time.
                        </p>
                    </details>
                </div>
            </section>

            <section className="contact-section digi-contact" id="contact" aria-labelledby="contact-title">
                <div className="contact-copy">
                    <h2 id="contact-title">Contact Digi World</h2>
                    <dl className="digi-details">
                        <dt>Phone</dt>
                        <dd>
                            <a href="tel:+919446548500">+91 94465 48500</a>
                            <br />
                            <a href="tel:+919388002975">+91 93880 02975</a>
                        </dd>
                        <dt>Email</dt>
                        <dd>
                            <a href="mailto:kampuramdigiworld@gmail.com">kampuramdigiworld@gmail.com</a>
                        </dd>
                        <dt>Instagram</dt>
                        <dd>
                            <a href="https://www.instagram.com/kampuramdigiworld/" target="_blank" rel="noopener noreferrer">
                                @kampuramdigiworld
                            </a>
                        </dd>
                        <dt>Facebook</dt>
                        <dd>kampuram digiworld</dd>
                    </dl>
                </div>
                <div className="location-card">
                    <span className="location-icon">
                        <svg aria-hidden="true">
                            <use href="#pin" />
                        </svg>
                    </span>
                    <h3>Visit us in Manjeri</h3>
                    <address className="business-address">
                        Madari Tower, Near Civil Station
                        <br />
                        Kacherippadi, Manjeri – 676121
                        <br />
                        Malappuram District, Kerala, India
                    </address>
                    <a
                        className="text-link location-directions"
                        href="https://www.google.com/maps/search/?api=1&amp;query=Madari%20Tower%2C%20Near%20Civil%20Station%2C%20Kacherippadi%2C%20Manjeri%20676121%2C%20Malappuram%2C%20Kerala%2C%20India"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Find us on Google Maps{' '}
                        <svg aria-hidden="true">
                            <use href="#arrow" />
                        </svg>
                    </a>
                </div>
            </section>
        </SiteLayout>
    );
}
