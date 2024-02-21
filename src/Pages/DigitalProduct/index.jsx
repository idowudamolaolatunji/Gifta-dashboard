import React from 'react'
import DashHeader from '../DashBoard/DashboardComponents/DashHeader'
import DashTabs from '../DashBoard/DashboardComponents/DashTabs'

function index() {
  return (
    <>
        <DashHeader />
        <DashTabs />

        <section className="wishlist__section section">
            <div className="section__container" style={{ position: 'relative' }}>
                <p className='modal--info'>Coming soon..</p>
            </div>
        </section>
      
    </>
  )
}

export default index
