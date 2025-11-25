import React from 'react'
import Header from './Header'
import HeroSection from './HeroSection'
import Footer from './Footer'
import Language from '@/Components/Language/Language'
import OurService from './OurService'
import Impressions from './Impressions'
import AboutUs from './AboutUs'

const HomePage = ({isAuthenticated, currentUser}) => {
 
  return (
    <div>
      <div className='bg-[var(--six)] h-[30px] flex justify-end items-center'><Language/></div>
        <Header currentUser={currentUser} isAuth={isAuthenticated}/>
        <HeroSection/>
        <OurService/>
        <AboutUs/>
        <Impressions/>
        <Footer/>
    </div>
  )
}

export default HomePage