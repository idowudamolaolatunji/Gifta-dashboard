import React, { useEffect, useState } from 'react';

import Header from './Components/Header';
import { calculatePercentage, dateConverter, expectedDateFormatter, numberConverter } from '../../utils/helper';
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
import Alert from '../../Components/Alert';
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';


const customStyle = {
	minHeight: "auto",
	maxWidth: "45rem",
	width: "45rem",
};

const modalTexts = [
    "Fulfilling a wish isn't just about realizing a dream; it's about personal growth and the invaluable experiences gained along the way. 😊",
    "Every wish fulfilled is a journey embraced, full of lessons, challenges, and triumphant moments. 🌟",
    "In the pursuit of dreams, one discovers the strength within, turning wishes into inspiring chapters of personal evolution. 🚀",
    "Wishes materialize not just through actions but through the transformation and resilience found in the pursuit. 💪",
];


function SharedWishlist({}) {
    const { user, token } = useAuthContext();

    const [wishList, setWishList] = useState({});
    const [wishes, setWishes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingPay, setIsLoadingPay] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [index, setIndex] = useState(null);
    const [email, setEmail] = useState(user?.email || '');
    const [amount, setAmount] = useState('');

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [randomText, setRandomText] = useState('');

    const [helpReset, setHelpReset] = useState(false);
    const [selectedWishId, setSelectedWishId] = useState(null);

    const { shareableUrl } = useParams();

    function handlePay(index, id) {
        setShowModal(true)
        setIndex(index+1);
        handleRendomText()
        setSelectedWishId(id)
    }


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
    const amountInKobo = calcTotalAmount(Number(amount)) * 100;
    const componentProps = {
        email,
        amount: amountInKobo,
        publicKey,
        text: "Pay!",
        onSuccess: ({ reference }) => {
            handlePayment(reference)
            setShowModal(false);
        },
        onClose: () => handleFailure('Transaction Not Completed!'),
    };

    function handleRendomText() {
        const randomIndex = Math.floor(Math.random() * modalTexts.length);
        setRandomText(modalTexts[randomIndex]);
    };

    // HANDLE ON FETCH FAILURE
    function handleFailure(mess) {
        setIsError(true);
        setMessage(mess)
        setTimeout(() => {
            setIsError(false);
            setMessage('')
        }, 3000);
    }

    // HANDLE FETCH STATE RESET
    function handleReset() {
        setIsError(false);
        setMessage('')
        setIsSuccess(false);
    }

    // console.log({ wishListID: wishList._id, wishID: selectedWishId, userID: wishList?.user?._id })

    async function handlePayment(reference) {
        try {
            handleReset();
            setIsLoadingPay(true);
            setHelpReset(false);
            // const res = await fetch(`http://localhost:3010/api/wishlists/payment-verification/${reference}/${charges}`, {
            const res = await fetch(`https://test.tajify.com/api/wishlists/payment-verification/${reference}/${charges}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ wishListID: wishList._id, wishID: selectedWishId, userID: wishList?.user._id })
            });
            console.log(helpReset)
            if (!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            console.log(res, data)
            if(data.success === 'fail') {
                throw new Error(data?.message);
            }
            setIsSuccess(true);
            setMessage("Thank you for you payment!");
            setTimeout(() => {
                setHelpReset(true);
                setIsSuccess(false);
                setMessage("");
            }, 2000);

        } catch (err) {
            handleFailure(err.message)
        } finally {
            setIsLoadingPay(false);
        }
    }

    useEffect(function() {
        async function handleFetchList() {
            try {
                setIsLoadingPay(true);

                const res = await fetch(`https://test.tajify.com/api/wishlists/shared-wishlist/${shareableUrl}`, {
                // const res = await fetch(`http://localhost:3010/api/wishlists/shared-wishlist/${shareableUrl}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type" : "application/json"
                    },
                });
                if(!res.ok) throw new Error('Something went wrong!');
                const data = await res.json();
                if(data.status !== "success") throw new Error(data.message);
                setWishList(data.data.wishList);
            } catch(err) {
                console.log(err);
            } finally {
                setIsLoadingPay(false)
            }
        }
        handleFetchList();
    }, [])

    useEffect(function() {
        async function handleFetchWishes() {
            try {
                // const wishesRes = await fetch(`http://localhost:3010/api/wishlists/all-wishes/${wishList._id}`, {
                const wishesRes = await fetch(`https://test.tajify.com/api/wishlists/all-wishes/${wishList._id}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type" : "application/json"
                    },
                });
                if(!wishesRes.ok) throw new Error('Something went wrong!');
                const wishesData = await wishesRes.json();
                if(wishesData.status !== "success") throw new Error(wishesData.message);
    
                setWishes(wishesData.data.wishes);
            } catch(err) {
                console.log(err);
            } finally {
                setIsLoading(false)
            }
        }
        handleFetchWishes();
    }, [wishList, helpReset])

  return (
    <>
        <Header />

        <section className='section section__shareable'>
            <div className="section__container">
                <div className="wishlish--share">
                    {isLoadingPay && (
                        <div className='gifting--loader'>
                            <Spinner />
                        </div>
                    )}
                    {isLoading && (<SkelentonCard />)}
                    {(wishList && !isLoading) && (
                        <div className="share--top">
                            <img src={`https://test.tajify.com/asset/others/${wishList.image}`} alt={wishList.image} />
                            <div className="top--details">
                                <p className="wishlist--title">{wishList.name}.</p>
                                <span className='top--info'>
                                    <span>Contributors <TbUsersGroup />: <p>{wishList?.contributors || 0}</p></span>
                                    <span>Wishes subtotal<GiMoneyStack />: <p>₦{numberConverter(wishes.reduce((acc, wish) => acc + wish.amount, 0))}</p></span>
                                    <span>Accoumulated <GiTakeMyMoney />: <p>₦{numberConverter(wishes.reduce((acc, wish) => acc + wish.amountPaid, 0))}</p></span>
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
                        <p className="wish--title">{wishList?.user?.fullName || wishList?.user?.username}'s Wishes</p>
                        {isLoading && (<SkelentonOne />)}
                        <ul className='lists--figure'>
                            {(wishes && !isLoading) && wishes?.map(( wishItem, i ) => (
                                <li className={`lists--item ${(calculatePercentage(wishItem.amount, wishItem.amountPaid) === 100) ? 'lists--completed' : ''}`} key={wishItem._id}>
                                    <span className='lists--item-top'>
                                        <span className='lists--content'>
                                            <p>{wishItem.wish}</p>
                                        </span>
                                        <div className='lists--actions'>
                                            <div className='lists--pay-btn' onClick={() => handlePay(i, wishItem._id)}><img height={'17rem'} src={paystackSvg} /><p>Pay</p></div>                                           
                                        </div>
                                    </span>
                                    <span className='lists--item-bottom'>
                                        <div className='lists--insight'>
                                            <span><IoPricetagOutline /><p>₦{numberConverter(wishItem.amount)}</p></span>
                                            <span><SlCalender /><p>{expectedDateFormatter(wishItem.deadLineDate)}</p></span>
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
                <span className='modal--info'>{randomText}</span>
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

        <Alert alertType={`${isSuccess ? "success" : isError ? "error" : ""}`}>
            {isSuccess ? (
                <AiFillCheckCircle className="alert--icon" />
            ) : isError && (
                <AiFillExclamationCircle className="alert--icon" />
            )}
            <p>{message}</p>
        </Alert>

    </>
  )
}

export default SharedWishlist
