import fauLogoSvg from '../assets/FAU_Logo_Bildmarke.svg';

/**
 * Renders the FAU styled footer
 *
 * @category React Component
 */
export function Footer(): JSX.Element {
  return (
    <footer className="bg-fau-red text-white py-8 md:text-sm">
      <div className="footer-row flex flex-wrap px-8 max-w-7xl m-auto">
        <div className="footer-logo w-80 pb-4">
          <img height="55px" width="144px" src={fauLogoSvg} alt="FAU Logo" />
        </div>
        <div className="footer-address mr-4 pb-4">
          <address itemType="http://schema.org/PostalAddress">
            <meta
              itemProp="name"
              content="Friedrich-Alexander-Universität Erlangen-Nürnberg"
            />
            <span>
              Friedrich-Alexander-Universität
              <br />
              Erlangen-Nürnberg
            </span>
            <br />
            <span itemProp="streetAddress">Schlossplatz 4</span>
            <br />
            <span itemProp="postalCode">91054</span>{' '}
            <span itemProp="addressLocality">Erlangen</span>
            <br />
            <span itemProp="addressCountry"></span>
          </address>
        </div>
        <div className="footer-meta flex-grow">
          <nav aria-label="Kontakt, Impressum und Zusatzinformationen">
            <ul className="md:text-right">
              <li className="inline">
                <a
                  href="https://www.pw.rw.fau.de/impressum"
                  className="p-2 pl-0"
                >
                  Impressum
                </a>
              </li>
              <li className="inline">
                <a href="https://www.pw.rw.fau.de/datenschutz" className="p-2">
                  Datenschutz
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
