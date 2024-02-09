import React from 'react'
import DashHeader from '../DashBoard/DashboardComponents/DashHeader'
import DashTabs from '../DashBoard/DashboardComponents/DashTabs'

function index() {
    return (
        <>
            <DashHeader />
            <DashTabs />

            <section className="marketplace__section">
                <div className="section__container">
                    <div className="">Hello</div>
                </div>
            </section>

        </>
    )
}

export default index
