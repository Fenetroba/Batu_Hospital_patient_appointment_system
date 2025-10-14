import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from '@/Context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="mt-20 relative bg-[var(--six)] text-white overflow-hidden">
      {/* Background Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--six)]/50 to-[var(--six)]" />

      {/* Content */}
      <div className="relative container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              BATU <span className="text-[var(--two)]">HOSPITAL</span>
            </h3>
            <p className="text-gray-300 mb-4">
              {t('aboutSection')}
            </p>
            <div className="flex gap-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-300"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-[var(--two)] transition-colors">
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-[var(--two)] transition-colors">
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-gray-300 hover:text-[var(--two)] transition-colors">
                  {t('ourTeam')}
                </Link>
              </li>
              <li>
                <Link to="/location" className="text-gray-300 hover:text-[var(--two)] transition-colors">
                  {t('location')}
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-300 hover:text-[var(--two)] transition-colors">
                  {t('appointments')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t('services')}</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">{t('emergencyService')}</li>
              <li className="text-gray-300">{t('outpatient')}</li>
              <li className="text-gray-300">{t('laboratory')}</li>
              <li className="text-gray-300">{t('radiology')}</li>
              <li className="text-gray-300">{t('pharmacy')}</li>
              <li className="text-gray-300">{t('surgery')}</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">{t('contactUs')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[var(--two)] flex-shrink-0 mt-1" />
                <span className="text-gray-300">
                  Batu City, East Shewa Zone<br />
                  Oromia Region, Ethiopia
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[var(--two)] flex-shrink-0" />
                <span className="text-gray-300">+251 22 XXX XXXX</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[var(--two)] flex-shrink-0" />
                <span className="text-gray-300">info@batuhospital.et</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[var(--two)] flex-shrink-0 mt-1" />
                <span className="text-gray-300">
                  Emergency: 24/7<br />
                  Outpatient: Mon-Fri 8AM-5PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-300 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} {t('copyright')}
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-gray-300 hover:text-[var(--two)] transition-colors">
                {t('privacyPolicy')}
              </Link>
              <Link to="/terms" className="text-gray-300 hover:text-[var(--two)] transition-colors">
                {t('termsOfService')}
              </Link>
              <Link to="/contact" className="text-gray-300 hover:text-[var(--two)] transition-colors">
                {t('contact')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;