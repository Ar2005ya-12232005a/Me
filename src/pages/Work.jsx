import React from 'react'
import SelectedWorks from '../components/SelectedWorks'   // ← lowercase "w" now, matches your actual filename
import Posters from '../components/Posters'

const Work = () => {
  return (
    <div>
      <SelectedWorks />
      <Posters />
    </div>
  )
}

export default Work