import React, { useRef } from 'react';
import { useLanguage } from '@/Context/LanguageContext';
import { 
  Heart, 
  Stethoscope, 
  TestTube, 
  Scan, 
  Pill, 
  Scissors, 
  Baby, 
  Users, 
  Smile,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const OurService = () => {
  const { t } = useLanguage();
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = 400;
      const newScrollPosition = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const services = [
    {
      icon: Heart,
      title: t('emergencyServiceTitle'),
      description: t('emergencyServiceDesc'),
      color: 'from-[var(--six)] to-[var(--six)]',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      icon: Stethoscope,
      title: t('outpatientTitle'),
      description: t('outpatientDesc'),
           color: 'from-[var(--six)] to-[var(--six)]',

      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: TestTube,
      title: t('laboratoryTitle'),
      description: t('laboratoryDesc'),
      color: 'from-[var(--six)] to-[var(--six)]',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: Scan,
      title: t('radiologyTitle'),
      description: t('radiologyDesc'),
          color: 'from-[var(--six)] to-[var(--six)]',

      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600'
    },
    {
      icon: Pill,
      title: t('pharmacyTitle'),
      description: t('pharmacyDesc'),
      color: 'from-[var(--six)] to-[var(--six)]',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: Scissors,
      title: t('surgeryTitle'),
      description: t('surgeryDesc'),
      color: 'from-[var(--six)] to-[var(--six)]',
      bgColor: 'var(--six)',
      iconColor: 'text-orange-900'
    },
    {
      icon: Baby,
      title: t('maternityTitle'),
      description: t('maternityDesc'),
      color: 'from-[var(--six)] to-[var(--six)]',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600'
    },
    {
      icon: Users,
      title: t('pediatricsTitle'),
      description: t('pediatricsDesc'),
      color: 'from-[var(--six)] to-[var(--six)]',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600'
    },
    {
      icon: Smile,
      title: t('dentalTitle'),
      description: t('dentalDesc'),
            color: 'from-[var(--six)] to-[var(--six)]',

      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600'
    }
  ];

  return (
    <div className='py-20 px-4 bg-gradient-to-b from-white to-gray-50'>
      <div className='container mx-auto max-w-7xl'>
        {/* Header Section */}
        <div className='text-center mb-16'>
          <h1 className='text-4xl md:text-5xl font-extrabold text-[var(--six)] mb-4'>
            {t('ourServicesTitle')}
          </h1>
          <p className='text-lg md:text-xl text-gray-600 max-w-3xl mx-auto'>
            {t('ourServicesSubtitle')}
          </p>
          <div className='w-24 h-1 bg-gradient-to-r from-[var(--five)] to-[var(--four)] mx-auto mt-6 rounded-full'></div>
        </div>

        {/* Services Carousel */}
        <div className='relative'>
          {/* Scroll Buttons */}
          <button
            onClick={() => scroll('left')}
            className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 hidden md:block'
            aria-label='Scroll left'
          >
            <ChevronLeft className='w-6 h-6 text-[var(--six)]' />
          </button>
          
          <button
            onClick={() => scroll('right')}
            className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300 hover:scale-110 hidden md:block'
            aria-label='Scroll right'
          >
            <ChevronRight className='w-6 h-6 text-[var(--six)]' />
          </button>

          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            className='flex overflow-x-auto gap-8 pb-4 scroll-smooth scrollbar-hide snap-x snap-mandatory'
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div 
                  key={index}
                  className='group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-transparent hover:-translate-y-2 flex-shrink-0 w-[320px] md:w-[380px] snap-start'
                >
                  {/* Gradient Header */}
                  <div className={`h-2 bg-gradient-to-r ${service.color}`}></div>
                  
                  {/* Card Content */}
                  <div className='p-6'>
                    {/* Icon */}
                    <div className={`${service.bgColor} w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-8 h-8 ${service.iconColor}`} />
                    </div>

                    {/* Title */}
                    <h3 className='text-xl font-bold text-gray-800 mb-3 group-hover:text-[var(--six)] transition-colors'>
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className='text-gray-600 leading-relaxed'>
                      {service.description}
                    </p>
                  </div>

                  {/* Hover Effect Bottom Border */}
                  <div className={`h-1 bg-gradient-to-r ${service.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
                </div>
              );
            })}
          </div>

          {/* Scroll Indicator */}
          <div className='flex justify-center gap-2 mt-6 md:hidden'>
            {services.map((_, index) => (
              <div key={index} className='w-2 h-2 rounded-full bg-gray-300'></div>
            ))}
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default OurService;  