// components/Footer.tsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white text-black py-6 relative min-h-[200px] w-full overflow-hidden">
      <div 
        className="absolute inset-0 w-full h-full bg-[url('/wave-footer.svg')] bg-no-repeat bg-bottom bg-cover"
        style={{ 
          transform: 'scale(1.1)',
          bottom: '-1px'
        }}
      />
      <div className="container mx-auto px-4 relative">
        {/* Logo Section */}
        <div className="flex justify-center mb-6 relative z-10">
          <div className="bg-white rounded-lg p-1">
            <img
              src="/parkigo-logo.png"
              alt="Parkigo Logo"
              className="h-8 w-auto"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4 text-left">
          {/* About Section */}
          <div className="text-center md:text-left">
            <h3 className="text-base font-bold mb-2">About Parkigo</h3>
            <p className="text-sm">
              Find and reserve the perfect parking spot for your vehicle with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-base font-bold mb-2">Quick Links</h3>
            <ul className="space-y-1">
              <li>
                <a href="/about" className="text-sm hover:text-[#FCC502] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm hover:text-[#FCC502] transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="/faq" className="text-sm hover:text-[#FCC502] transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="text-center md:text-left">
            <h3 className="text-base font-bold mb-2">Legal</h3>
            <ul className="space-y-1">
              <li>
                <a href="/privacy" className="text-sm hover:text-[#FCC502] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-sm hover:text-[#FCC502] transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/cookies" className="text-sm hover:text-[#FCC502] transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="text-base font-bold mb-2">Contact Us</h3>
            <ul className="space-y-1">
              <li className="text-sm">
                <a href="mailto:info@parkigo.com" className="hover:text-[#FCC502] transition-colors">
                  info@parkigo.com
                </a>
              </li>
              <li className="text-sm">
                <a href="tel:+1234567890" className="hover:text-[#FCC502] transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-4 border-t border-black/10">
          <p className="text-center text-xs">
            {new Date().getFullYear()} Parkigo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;