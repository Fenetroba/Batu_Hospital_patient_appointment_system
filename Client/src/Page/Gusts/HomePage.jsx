import React from 'react'
import Header from './Header'
import HeroSection from './HeroSection'
import Footer from './Footer'
const HomePage = () => {
  return (
    <div>
      <div className='bg-[var(--six)] h-[30px] '></div>
        <Header/>
        <HeroSection/>
        <Footer/>
    </div>
  )
}

export default HomePage