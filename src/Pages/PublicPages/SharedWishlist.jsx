import React, { useEffect, useState } from 'react';

import Header from './Components/Header';
import { calcTotalAmount, calculatePercentage, dateConverter, numberConverter } from '../../utils/helper';
import paystackSvg from '../../Assets/svgs/paystack.svg';
import SkelentonOne from '../../Components/SkelentonOne';
import { useParams } from 'react-router-dom';
import { SlCalender } from 'react-icons/sl';
import { IoPricetagOutline } from 'react-icons/io5';
import ProgressBar from '../../Components/ProgressBar';
import { GiMoneyStack, GiTakeMyMoney } from 'react-icons/gi';
import { TbUsersGroup } from 'react-icons/tb'
import SkelentonCard from '../../Components/SkelentonCard';
import DashboardModal from '../../Components/Modal';
import CurrencyInput from 'react-currency-input-field';
import { useAuthContext } from '../../Auth/context/AuthContext';
import { PaystackButton } from 'react-paystack';


const customStyle = {
	minHeight: "auto",
	maxWidth: "45rem",
	width: "45rem",
};


function SharedWishlist({}) {
    const { user, token } = useAuthContext();

    const [wishList, setWishList] = useState({});
    const [wishes, setWishes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMini, setIsLoadingMini] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [index, setIndex] = useState(null);
    const [email, setEmail] = useState(user?.email || '');
    const [amount, setAmount] = useState('');

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const { url } = useParams();
    const id  = '659bd9524ba2f9c1153de6af';

    function handlePay(index) {
        setShowModal(true)
        setIndex(index+1);
    }

    const publicKey = "pk_test_8fa5be5a113286b23f7775fe7f34c94ffd338c8c"
    const amountInKobo = calcTotalAmount(Number(amount)) * 100;
    const componentProps = {
        email,
        amount: amountInKobo,
        // metadata: {},
        publicKey,
        text: "Pay!",
        onSuccess: ({ reference }) => handlePayment(reference),
        onClose: () => handleFailure('Transaction Not Completed!'),
    };

    // HANDLE ON FETCH FAILURE
    function handleFailure(mess) {
        setIsError(true);
        setMessage(mess)
        setTimeout(() => {
            setIsError(false);
            setMessage('')
        }, timeout);
    }

    async function handlePayment(reference) {
        try {
            setIsLoadingMini(true);
            console.log(reference)
            

        } catch(err) {

        } finally {
            setIsLoadingMini(false)
        }
    }

    useEffect(function() {
        async function handleFetchList() {
            try {
                setIsLoading(true);

                const res = await fetch(`http://localhost:3010/api/wishlists/${id}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type" : "application/json"
                    },
                });
                if(!res.ok) throw new Error('Something went wrong!');
                const data = await res.json();
                if(data.status !== "success") throw new Error(data.message);
                
                setWishList(data.data.wishList);
                setWishes(data.data.wishList.wishes);
            } catch(err) {
                console.log(err);
            } finally {
                setIsLoading(false)
            }
        }
        handleFetchList();
    }, [])

  return (
    <>
        <Header />

        <section className='section section__shareable'>
            <div className="section__container">
                <div className="wishlish--share">
                    {isLoading && (<SkelentonCard />)}
                    {(wishList && !isLoading) && (
                        <div className="share--top">
                            <img src={`http://localhost:3010/asset/others/${wishList.image}`} alt={wishList.image} />
                            <div className="top--details">
                                <p className="wishlist--title">{wishList.name}.</p>
                                <span className='top--info'>
                                    <span>Contributors <TbUsersGroup />: <p>{'1k'}</p></span>
                                    <span>Wishlist subtotal<GiMoneyStack />: <p>₦{numberConverter(wishes.reduce((acc, wish) => acc + wish.amount, 0))}</p></span>
                                    <span>Accoumulated amount<GiTakeMyMoney />: <p>₦{numberConverter(wishes.reduce((acc, wish) => acc + wish.amountPaid, 0))}</p></span>
                                </span>
                                {/* <span className="top--insight">
                                    <span>date</span>
                                </span> */}
                                <span className='top--progress'>
                                    <ProgressBar progress={`${calculatePercentage(wishes.reduce((acc, wish) => acc + wish.amount, 0), wishes.reduce((acc, wish) => acc + wish.amountPaid, 0))}%`} />
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="share--bottom">
                        <p className="wish--title">{wishList?.user?.fullName || wishList?.user?.username}'s Wishes 🏆</p>
                        {isLoading && (<SkelentonOne />)}
                        <ul className='lists--figure'>
                            {(wishes && !isLoading) && wishes?.map(( wishItem, i ) => (
                                <li className={`lists--item ${(calculatePercentage(wishItem.amount, wishItem.amountPaid) === 100) ? 'lists--completed' : ''}`} key={wishItem._id}>
                                    <span className='lists--item-top'>
                                        <span className='lists--content'>
                                            <span style={{ border: 'none' }}>{i + 1}.</span>
                                            <p>{wishItem.wish}</p>
                                        </span>
                                        <div className='lists--actions'>
                                            <div className='lists--pay-btn' onClick={() => handlePay(i)}><img height={'17rem'} src={paystackSvg} /><p>Pay</p></div>                                           
                                        </div>
                                    </span>
                                    <span className='lists--item-bottom'>
                                        <div className='lists--insight'>
                                            <span><IoPricetagOutline /><p>₦{numberConverter(wishItem.amount)}</p></span>
                                            <span><SlCalender /><p>{dateConverter(wishItem.deadLineDate)}</p></span>
                                        </div>
                                        <ProgressBar progress={`${calculatePercentage(wishItem.amount, wishItem.amountPaid)}%`} />
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>


        {showModal && (
            <DashboardModal setShowDashboardModal={setShowModal} customStyle={customStyle} title={
                <>
                    Make a wish come true ❤️
                    <picture style={{ transform: 'translateY(-.6rem)'}}>
                        <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.webp" type="image/webp" />
                        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f389/512.gif" alt="🎉" width="32" height="32" />
                    </picture>
                </>
            }>
                <span className='modal--info'>Note that everything relating data to this wish would also be deleted including transaction history!</span>
                <form className="pay--form" onSubmit={e => e.preventDefault()} style={{ marginTop: '.8rem' }}>
                    <div className="form--item">
                        <label htmlFor="email" className="form--label">Email</label>
                        <input type="email" id='email' required placeholder='Email Address' name='email' value={email} onChange={e => setEmail(e.target.value)} className="form--input" />
                    </div>
                    <div className="form--item">
                        <label htmlFor="amount" className="form--label">Amount</label>
                        <CurrencyInput
                            className='form--input'
                            decimalsLimit={0}
                            prefix='₦ '
                            placeholder='Amount to pay'
                            defaultValue={amount}
                            value={amount}
                            onValueChange={(value, _) => setAmount(value)}
                            required
                        />
                    </div>
                    <div className="form--item">
                        {(email && amount) ? (
                            <PaystackButton type='submit' className="form--button" {...componentProps} />
                            
                        ) : (
                            <button type='submit' className="form--button">Pay!</button>
                        )}
                    </div>
                </form>
            </DashboardModal>
        )}

    </>
  )
}

export default SharedWishlist
