import React, { useEffect, useState } from 'react'
import Header from './Components/Header'
import { useNavigate } from 'react-router-dom';
import { BsCheck } from 'react-icons/bs';

import Modal from '../../Components/Modal';
import { PiWallet } from 'react-icons/pi';
import { ImCreditCard  } from 'react-icons/im';


const customStyle = {
    minHeight: "auto",
    maxWidth: "40rem",
    width: "40rem",
};

function SubscriptionPlan() {
    const [checkedMonthly, setCheckedMonthly] = useState(false);
    const [checkedYearly, setCheckedYearly] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    function handleChecked(plan) {
        if(plan === 'monthly') {
            setCheckedMonthly(!checkedMonthly);
            setCheckedYearly(false);
        } else {
            setCheckedYearly(!checkedYearly);
            setCheckedMonthly(false);
        }

        setTimeout(() => {
            setShowModal(true)
        }, 1000);
    }

    useEffect(function() {
        if(!showModal) {
            setCheckedMonthly(false);
            setCheckedYearly(false);
        }
    }, [showModal])

    console.log(checkedMonthly, checkedYearly)

    return (
        <>
            <Header />

            <section className='section wallet__section'>
                <div className="section__container">
                    <span onClick={() => navigate(-1)} className='wishlist--back-btn'>Back</span>

                    <div className="terms--container">
                        <h3 className="terms--heading">Plans.</h3>

                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quibusdam corporis.</p>


                        <div className="plans--box">
                            <figure className="plan-figure" onClick={() => handleChecked('monthly')}>
                                <p className="plans--title">Monthly</p>
                                <span className={`plans--check ${checkedMonthly ? 'checked' : ''}`}>{checkedMonthly && <BsCheck className='check--icon' />}</span>
                                <ul className="plans--infos">
                                    <li>Increased Profit Margins</li>
                                    <li>Competitive Advantage</li>
                                    <li>Lower prices can facilitate</li>
                                    <li>Proper pricing strategies</li>
                                    <li>Dynamic pricing models</li>
                                </ul>
                                <span className='plans--pricing'>
                                    <span className='plans--number'>₦1,200</span>
                                    <span>/ month</span>
                                </span>
                            </figure>
                            <figure className="plan-figure" onClick={() => handleChecked('yearly')}>
                                <p className="plans--title">Yearly</p>
                                <span className={`plans--check ${checkedYearly ? 'checked' : ''}`}>{checkedYearly && <BsCheck className='check--icon' />}</span>
                                <ul className="plans--infos">
                                    <li>Increased Profit Margins</li>
                                    <li>Competitive Advantage</li>
                                    <li>Lower prices can facilitate</li>
                                    <li>Proper pricing strategies</li>
                                    <li>Dynamic pricing models</li>
                                </ul>
                                <span className='plans--pricing'>
                                    <span className='plans--number'>₦50,000</span>
                                    <span>/ year</span>
                                </span>
                            </figure>
                        </div>
                    </div>
                </div>
            </section>


            {showModal && (
                <Modal customStyle={customStyle} setShowDashboardModal={setShowModal} title={'Choose a Payment Option!'}>
                    <span className='modal--info'>Subscription plan for a {checkedYearly ? 'Year' : 'Month'}. Note the subtotal for this plan {checkedMonthly ? '₦1,200' : '₦50,000'}. Proceed with caution!</span>

                    <div className="payment--option">
                        <span className='payment--action payment--wallet'><PiWallet style={{ color: 'bb0505', fontSize: '2rem' }} /> Pay from Wallet</span>
                        <span className='payment--or'><p/>Or<p/></span>
                        <span className='payment--action payment--card'><ImCreditCard style={{ color: 'bb0505', fontSize: '2rem' }} /> Pay from Bank</span>
                    </div>
                </Modal>
            )}
        </>
    )
}

export default SubscriptionPlan
