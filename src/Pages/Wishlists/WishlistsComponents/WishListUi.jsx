import React, { useEffect, useState } from 'react'
import WishListDashHeader from './WishListDashHeader'
import { useAuthContext } from '../../../Auth/context/AuthContext'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { PiFunnelBold, PiPlusBold } from 'react-icons/pi';
import { RiDeleteBin6Line, RiEditLine } from 'react-icons/ri';
import { IoPricetagOutline } from 'react-icons/io5';
import { SlCalender } from "react-icons/sl";
import ProgressBar from '../../../Components/ProgressBar';
import { calculatePercentage, dateConverter, numberConverter } from '../../../utils/helper';
import { FaCheck } from 'react-icons/fa6';
import WishInputUi from './WishInputUi';
import DeleteModalUi from './DeleteModalUi';
import paystackSvg from '../../../Assets/svgs/paystack.svg';
import GiftLoader from '../../../Assets/images/gifta-loader.gif';

const id = 123456;

function WishListUi() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState('all');
    const [wishList, setWishList] = useState({});
    const [wishes, setWishes] = useState([]);
    const [checked, setChecked] = useState(false);
    const [selectedWish, setSelectedWish] = useState({});
    const [errMessage, setErrMessage] = useState('')

    const allWishes = wishes;
    const completedWishes = wishes.filter(wish => wish.isPaidFor === true)
    const wishArr = selectedTab === 'all' ? allWishes : completedWishes;

    const { user, token } = useAuthContext();
    const { wishListSlug } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    function handleSelectedWish(item) {
        navigate(`/dashboard/wishlists/${wishListSlug}/wish/edit?id=${item._id}`)
        setSelectedWish(item);
    }

    function handleChangeTab(tab) {
        setSelectedTab(tab)
    }

    useEffect(function() {
        async function handleFetchList() {
            try {
                setIsLoading(true)
                const res = await fetch(`http://localhost:3010/api/wishlists/user-wishlists/wishlists/${wishListSlug}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });
                if(!res.ok) throw new Error('Something went wrong!');
                const data = await res.json();
                console.log(res, data)
                if(data.status !== 'success') throw new Error(data.message)
                setWishList(data.data.wishList);
                setWishes(data.data.wishList.wishes)
            } catch(err) {
                console.log(err.message);
                setErrMessage(err.message)
            } finally {
                setIsLoading(false)
            }
        }
        handleFetchList()
    }, []);

  return (
    <>
        <WishListDashHeader />

        {isLoading && 
            <div className='gifting--loader'>
                <img src={GiftLoader} alt='loader' />
        </div>}
        
        <section className="section">
            <div className="section__container">
                {/* <button className='button' onClick={navigate(-1)}>Back</button> */}

                <div className="wish--lists">
                    <span className='lists--title'>{wishList.name}</span>
                    <div className="lists--tabs">
                        <div className="main--tabs">
                            <div className={`lists--tab ${selectedTab === 'all' ? 'tab--active' : ''}`} onClick={() => handleChangeTab('all')}>All <span>{allWishes.length}</span></div>
                            <div className={`lists--tab ${selectedTab === 'completed' ? 'tab--active' : ''}`} onClick={() => handleChangeTab('completed')}>Completed <span>{completedWishes.length}</span></div>
                        </div>
                        <div className="sub--tabs">
                            <Link to={`/dashboard/wishlists/${wishListSlug}/wish?new=${true}`}>
                                <div className="lists--tab"><PiPlusBold /> add wish</div>
                            </Link>
                            <div className="lists--tab"><PiFunnelBold /> Filter</div>
                        </div>
                    </div>
                    <ul className='lists--figure'>
                        {(wishArr && wishArr.length > 0) ? wishArr.map(wishItem => (
                            <li className={`lists--item ${(calculatePercentage(wishItem.amount, wishItem.amountPaid) === 100) ? 'lists--completed' : ''}`} key={wishItem._id}>
                                <span className='lists--item-top'>
                                    <span className='lists--content'>
                                        <span onClick={() => setChecked(!checked)} style={checked ? { backgroundColor: '#bb0505', boxShadow: 'none' } : {}}>{checked && <FaCheck style={{ color: '#fff' }} />}</span>
                                        <p style={checked ? { textDecoration: 'line-through'} : {}}>{wishItem.wish}</p>
                                    </span>
                                    <div className='lists--actions'>
                                        <span onClick={() => navigate(`/dashboard/wishlists/${wishListSlug}/wish/pay?id=${wishItem._id}`)}><img height={'17rem'} src={paystackSvg} /><p>Pay</p></span>
                                        <span onClick={() => handleSelectedWish(wishItem)}><RiEditLine /></span>
                                        <span onClick={() => navigate(`/dashboard/wishlists/${wishListSlug}/wish/delete?id=${wishItem._id}`)}><RiDeleteBin6Line /></span>
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
                        )): (
                            <li className='lists--message'>
                                {(!isLoading && errMessage) ? errMessage : 
                                    selectedTab === 'completed' ? 'No Completed Wishes!' : 'You\'ve No Wishes Yet!'}
                                    {(!isLoading && errMessage) ? (
                                        <picture>
                                            <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f6f8/512.webp" type="image/webp" />
                                            <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f6f8/512.gif" alt="🛸" width="32" height="32" />
                                        </picture>
                                    ) : (
                                        <picture>
                                            <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f61e/512.webp" type="image/webp" />
                                            <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f61e/512.gif" alt="😞" width="32" height="32" />
                                        </picture>
                                    )}
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </section>


        {location.pathname === `/dashboard/wishlists/${wishListSlug}/wish` && <WishInputUi />}
        {location.pathname === `/dashboard/wishlists/${wishListSlug}/wish/edit` && <WishInputUi wishDetails={selectedWish} />}
        {location.pathname === `/dashboard/wishlists/${wishListSlug}/wish/delete` && <DeleteModalUi />}
    </>
  )
}

export default WishListUi
