import React from 'react';
import { useLanguage } from '@/Context/LanguageContext';
import { Users, Award, Heart, Clock, TrendingUp, Shield } from 'lucide-react';
import hospitalImage1 from '@/assets/files/image.png';
import hospitalImage2 from '@/assets/files/image copy 2.png';
import hospitalImage3 from '@/assets/files/image copy 3.png';
import hospitalImage4 from '@/assets/files/image copy 4.png';
import hospitalImage5 from '@/assets/files/image copy 5.png';
import hospitalImage6 from '@/assets/files/image copy 6.png';
import hospitalImage7 from '@/assets/files/image copy 7.png';
import hospitalImage8 from '@/assets/files/image copy 8.png';
import hospitalImage9 from '@/assets/files/image copy 9.png';

const Impressions = () => {
  const { t } = useLanguage();

  const stats = [
    {
      icon: Users,
      number: '50+',
      label: t('expertDoctors'),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Heart,
      number: '10,000+',
      label: t('patientsServed'),
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50'
    },
    {
      icon: Award,
      number: '25+',
      label: 'Years of Excellence',
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: Clock,
      number: '24/7',
      label: t('emergencyCare'),
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: TrendingUp,
      number: '95%',
      label: 'Success Rate',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Shield,
      number: '100%',
      label: 'Patient Safety',
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50'
    }
  ];

  const galleryImages = [
    { src: hospitalImage1, title: 'Modern Infrastructure', description: 'State-of-the-art medical facilities' },
    { src: hospitalImage2, title: 'Advanced Technology', description: 'Latest medical equipment' },
    { src: hospitalImage3, title: 'Patient Care', description: 'Compassionate healthcare' },
    { src: hospitalImage4, title: 'Emergency Services', description: '24/7 emergency care' },
    { src: hospitalImage5, title: 'Surgical Excellence', description: 'Expert surgical teams' },
    { src: hospitalImage6, title: 'Diagnostic Center', description: 'Advanced diagnostics' },
    { src: hospitalImage7, title: 'Recovery Rooms', description: 'Comfortable patient rooms' },
    { src: hospitalImage8, title: 'Medical Staff', description: 'Dedicated professionals' },
    { src: hospitalImage9, title: 'Healthcare Innovation', description: 'Leading medical care' }
  ];

  return (
    <div className='py-20 px-4 bg-gradient-to-b from-gray-50 to-white'>
      <div className='container mx-auto max-w-7xl'>
        

    

        {/* Image Gallery Section */}
        <div className='mb-16'>
          <h3 className='text-3xl md:text-4xl font-bold text-[var(--six)] mb-8 text-center'>
            Our Facilities
          </h3>
          
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {galleryImages.map((image, index) => (
              <div 
                key={index}
                className={`group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 ${
                  index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
                }`}
              >
                <img 
                  src={image.src} 
                  alt={image.title} 
                  className={`w-full ${index === 0 ? 'h-full' : 'h-64'} object-cover group-hover:scale-110 transition-transform duration-500`}
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <div className='absolute bottom-0 left-0 right-0 p-6 text-white'>
                    <h4 className={`${index === 0 ? 'text-2xl' : 'text-xl'} font-bold mb-2`}>{image.title}</h4>
                    <p className='text-sm'>{image.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default Impressions;