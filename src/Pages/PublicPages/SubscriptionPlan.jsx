import React, { useEffect, useState } from 'react'
import Header from './Components/Header'
import { useNavigate } from 'react-router-dom';
import { BsCheck } from 'react-icons/bs';

import GiftLoader from '../../Assets/images/gifta-loader.gif';

import Modal from '../../Components/Modal';
import { PiWallet } from 'react-icons/pi';
import { ImCreditCard  } from 'react-icons/im';

import { PaystackButton } from 'react-paystack';
import { useAuthContext } from '../../Auth/context/AuthContext';
import Alert from '../../Components/Alert';
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';


const customStyle = {
    minHeight: "auto",
    maxWidth: "40rem",
    width: "40rem",
};

function SubscriptionPlan() {
    const [checkedMonthly, setCheckedMonthly] = useState(false);
    const [checkedYearly, setCheckedYearly] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const navigate = useNavigate();
    const { user, token } = useAuthContext();


    // HANDLE FETCH STATE RESET
    function handleReset() {
        setIsError(false);
        setMessage('')
        setIsSuccess(false);
    }

    // HANDLE ON FETCH FAILURE
    function handleFailure(mess) {
        setIsError(true);
        setMessage(mess)
        setTimeout(() => {
            setIsError(false);
            setMessage('')
        }, 3000);
    }

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

    let charges;
    function calcTotalAmount(amount) {
        const calcChargesAmount = (3 / 100) * amount;
        if (calcChargesAmount > 3000) {
            charges = 3000;
        } else {
            charges = calcChargesAmount;
        }
        return amount + charges;
    }

    const publicKey = "pk_test_ec63f7d3f340612917fa775bde47924bb4a90af7"
    const amountInKobo = calcTotalAmount(Number(checkedMonthly ? 1200 : 50000)) * 100;
    const componentProps = {
        email: user?.email,
        amount: amountInKobo,
        metadata: {
            name: user?.fullName,
        },
        publicKey,
        text: 
            <>
                <ImCreditCard style={{ color: 'bb0505', fontSize: '2rem' }} /> Pay from Bank
            </>
        ,
        onSuccess: ({ reference }) => {
            handleSubscriptionPay(reference);
            setShowModal(false);
        },
        onClose: () => handleFailure('Transaction Not Completed!'),
    };

    async function handleSubscriptionPay(reference) {
        try {
            handleReset();
            setIsLoading(true);


        } catch(err) {
            handleFailure(err.message)
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSubscriptionWallet() {
        try {
            setIsLoading(true);
            handleReset();

            // setShowModal(false)
        } catch (err) {
            handleFailure(err.message)
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <>
            {isLoading && (
                <div className='gifting--loader'>
                    <img src={GiftLoader} alt='loader' />
                </div>
            )}

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
                        <span className='payment--action payment--wallet' onClick={handleSubscriptionWallet}><PiWallet style={{ color: 'bb0505', fontSize: '2rem' }} /> Pay from Wallet</span>
                        <span className='payment--or'><p/>Or<p/></span>
                        <PaystackButton type='submit' className="payment--action payment--card" {...componentProps} />
                    </div>
                </Modal>
            )}


            {(isError || isSuccess) && (
                <Alert alertType={`${isSuccess ? "success" : isError ? "error" : ""}`}>
                    {isSuccess ? (
                        <AiFillCheckCircle className="alert--icon" />
                    ) : isError && (
                        <AiFillExclamationCircle className="alert--icon" />
                    )}
                    <p>{message}</p>
                </Alert>
            )}
        </>
    )
}

export default SubscriptionPlan
