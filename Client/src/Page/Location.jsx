import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useLanguage } from '@/Context/LanguageContext';
import Language from '@/Components/Language/Language';
import Header from './Gusts/Header';
import Footer from './Gusts/Footer';

const Location = () => {
  const { t } = useLanguage();
  return (
    <div>
      <div className='bg-[var(--six)] h-[30px] flex justify-end items-center'><Language/></div>
      <Header />
    <div className="min-h-screen bg-gradient-to-b from-[var(--one)] to-[var(--two)] py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--six)] mb-4">
            {t('ourLocation')}
          </h1>
          <p className="text-gray-600 text-lg">
            {t('findUs')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Map Section */}
          <div className="bg-[var(--two)] rounded-2xl shadow-xl overflow-hidden">
            <div className="h-[400px] w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3959.0!2d39.0!3d8.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOMKwMzAnMDAuMCJOIDM5wrAwMCcwMC4wIkU!5e0!3m2!1sen!2set!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Batu Hospital Location"
              ></iframe>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            {/* Address Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-[var(--five)] p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--six)] mb-2">
                    {t('address')}
                  </h3>
                  <p className="text-gray-600">
                    Batu General Hospital<br />
                    Batu City, East Shewa Zone<br />
                    Oromia Region, Ethiopia
                  </p>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-[var(--five)] p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-[var(--five)] p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--six)] mb-2">
                    {t('email')}
                  </h3>
                  <p className="text-gray-600">
                    info@batuhospital.et<br />
                  
                  </p>
                </div>
              </div>
            </div>

            {/* Working Hours Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-[var(--five)] p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[var(--six)] mb-2">
                    {t('workingHours')}
                  </h3>
                  <p className="text-gray-600">
                    Emergency: 24/7<br />
                    Outpatient: Mon-Fri 2:00 AM - 11:00 PM<br />
                    Saturday: 2:00 AM - 11:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default Location;