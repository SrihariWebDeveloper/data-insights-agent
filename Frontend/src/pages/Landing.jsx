import React from 'react'
import Hero from '../components/Hero.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import Features from '../components/Features.jsx'

const Landing = () => {
  return (
    <section className="space-y-20">
      <Hero />
      <div className="container">
        <HowItWorks />
        <Features />
      </div>
    </section>
  )
}

export default Landing
