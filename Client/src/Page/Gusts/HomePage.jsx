import React from 'react'
import Header from './Header'
import HeroSection from './HeroSection'
import Footer from './Footer'
import Language from '@/Components/Language/Language'
import OurService from './OurService'

const HomePage = () => {
  return (
    <div>
      <div className='bg-[var(--six)] h-[30px] flex justify-end items-center'><Language/></div>
        <Header/>
        <HeroSection/>
        <OurService/>
        <Footer/>
    </div>
  )
}

export default HomePage