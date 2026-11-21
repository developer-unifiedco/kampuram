import { sitePages } from '@/lib/site/pages';
import { Icon, WhatsAppButton } from './site-elements';

export function EnquirySection({
    heading,
    description,
    page = 'home',
}: {
    heading: string;
    description: string;
    page?: 'home' | 'media' | 'cards' | 'books';
}) {
    return (
        <section className="contact-section" id="contact" aria-labelledby="contact-title">
            <div className="contact-copy">
                <h2 id="contact-title">{heading}</h2>
                <p>{description}</p>
                <WhatsAppButton className="button button-whatsapp" message={sitePages[page].enquiry}>
                    <Icon name="whatsapp" /> Chat on WhatsApp <Icon name="arrow" />
                </WhatsAppButton>
            </div>
            <div className="location-card">
                <span className="location-icon">
                    <Icon name="pin" />
                </span>
                <h3>Visit us in Manjeri</h3>
                <address className="business-address">
                    Madari Tower, Near Civil Station
                    <br />
                    Kacherippadi, Manjeri – 676121
                    <br />
                    Malappuram District, Kerala, India
                </address>
                <a className="contact-phone" href="tel:+919388002975">
                    +91 93880 02975
                </a>
                <a
                    className="text-link location-directions"
                    href="https://www.google.com/maps/search/?api=1&amp;query=Madari%20Tower%2C%20Near%20Civil%20Station%2C%20Kacherippadi%2C%20Manjeri%20676121%2C%20Malappuram%2C%20Kerala%2C%20India"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Find us on Google Maps <Icon name="arrow" />
                </a>
            </div>
        </section>
    );
}
