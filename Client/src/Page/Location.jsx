import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Location = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--one)] to-[var(--two)] py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--six)] mb-4">
            Our Location
          </h1>
          <p className="text-gray-600 text-lg">
            Find us and get directions to Batu General Hospital
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
                    Address
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
                <div>
                  <h3 className="text-xl font-bold text-[var(--six)] mb-2">
                    Phone
                  </h3>
                  <p className="text-gray-600">
                    Emergency: +251 22 XXX XXXX<br />
                    Reception: +251 22 XXX XXXX<br />
                    Appointments: +251 22 XXX XXXX
                  </p>
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
                    Email
                  </h3>
                  <p className="text-gray-600">
                    info@batuhospital.et<br />
                    appointments@batuhospital.et
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
                    Working Hours
                  </h3>
                  <p className="text-gray-600">
                    Emergency: 24/7<br />
                    Outpatient: Mon-Fri 8:00 AM - 5:00 PM<br />
                    Saturday: 8:00 AM - 12:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Directions Section */}
        <div className="mt-12 bg-[var(--six)] rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-[var(--one)] mb-6">
            How to Get Here
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-bold text-[var(--five)] mb-2">By Car</h3>
              <p className="text-gray-600">
                Free parking available on-site. Follow signs to the main entrance.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-[var(--five)] mb-2">By Public Transport</h3>
              <p className="text-gray-600">
                Several bus routes stop near the hospital. Check local schedules.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-[var(--five)] mb-2">By Taxi</h3>
              <p className="text-gray-600">
                Taxis are readily available. Show the driver this address.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Location;Location