import React from 'react'
import Header from './Components/Header'
import CategoryPage from '../Marketplace/MarketComponent/MarketProducts'

function PublicMarketPlace() {
  return (
    <>

    <Header />

    <div style={{ padding: '2.4rem' }}>
        <CategoryPage type={'marketplace'} />
    </div>
      
    </>
  )
}

export default PublicMarketPlace
