import React from 'react'
import Header from './Components/Header'
import { useNavigate } from 'react-router-dom';

function SubscriptionPlan() {
    const navigate = useNavigate();

    return (
        <>
            <Header />

            <section className='section wallet__section'>
                <div className="section__container">
                    <span onClick={() => navigate(-1)} className='wishlist--back-btn'>Back</span>

                    <div className="terms--container">
                        <h3 className="terms--heading">Plans.</h3>

                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam corporis, obcaecati iste similique vel distinctio! Consequuntur impedit expedita reprehenderit.</p>
                    </div>
                </div>
            </section>
        </>
    )
}

export default SubscriptionPlan
