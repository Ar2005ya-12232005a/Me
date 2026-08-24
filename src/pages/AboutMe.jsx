import React from 'react'
import AboutMeSection from '../components/AboutMeSection'
import FocusStatement from '../components/FocusStatement'
import GithubContributions from '../components/GithubContributions'

const AboutMe = () => {
  return (
    <div>
      <AboutMeSection />
      <GithubContributions/>
      <FocusStatement />
    </div>
  )
}

export default AboutMe