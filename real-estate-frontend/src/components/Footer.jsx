import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Buy',
      links: [
        { name: 'Homes for Sale', href: '/listings?purpose=for-sale' },
        { name: 'New Homes', href: '/listings?property-type=new-construction' },
        { name: 'Open Houses', href: '/open-houses' },
        { name: 'Recent Home Sales', href: '/recent-sales' },
        { name: 'Foreclosures', href: '/foreclosures' },
      ],
    },
    {
      title: 'Rent',
      links: [
        { name: 'Apartments for Rent', href: '/listings?property-type=apartment&purpose=for-rent' },
        { name: 'Houses for Rent', href: '/listings?property-type=house&purpose=for-rent' },
        { name: 'All Rentals', href: '/listings?purpose=for-rent' },
        { name: 'Rental Buildings', href: '/rental-buildings' },
      ],
    },
    {
      title: 'Commercial',
      links: [
        { name: 'Commercial Properties', href: '/commercial' },
        { name: 'Offices for Sale', href: '/commercial/offices' },
        { name: 'Retail for Sale', href: '/commercial/retail' },
        { name: 'Land for Sale', href: '/commercial/land' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Blog', href: '/blog' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'Sitemap', href: '/sitemap' },
      ],
    },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Use', href: '/terms' },
    { name: 'Fair Housing', href: '/fair-housing' },
    { name: 'Accessibility', href: '/accessibility' },
    { name: 'Do Not Sell My Info', href: '/do-not-sell' },
  ];

  const socialLinks = [
    { icon: <FaFacebook className="h-5 w-5" />, href: 'https://facebook.com' },
    { icon: <FaTwitter className="h-5 w-5" />, href: 'https://twitter.com' },
    { icon: <FaInstagram className="h-5 w-5" />, href: 'https://instagram.com' },
    { icon: <FaLinkedin className="h-5 w-5" />, href: 'https://in.linkedin.com/company/leank-kei-services-india-pvt-ltd' },
    { icon: <FaYoutube className="h-5 w-5" />, href: 'https://youtube.com' },
  ];

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold">Real Estate</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Find your dream home with our award-winning service and the most complete source of homes for sale & real estate near you.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={`Follow us on ${social.href.split('//')[1]}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer links */}
          {footerLinks.map((section, index) => (
            <div key={index} className="mt-6 md:mt-0">
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Real Estate. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center mt-4 md:mt-0">
              {legalLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="text-gray-400 hover:text-white text-sm mx-3 mb-2 md:mb-0 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="mt-6 text-center md:text-left">
            <p className="text-xs text-gray-500">
              The information being provided is for consumers' personal, non-commercial use and may not be used for any purpose other than to identify prospective properties consumers may be interested in purchasing.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              All information is deemed reliable but not guaranteed and should be independently verified.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
