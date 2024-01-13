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
import SkelentonOne from '../../../Components/SkelentonOne';


function WishListUi() {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('all');
    const [wishList, setWishList] = useState({});
    const [wishes, setWishes] = useState([]);
    const [checkedIds, setCheckedIds] = useState([]);
    const [selectedWishId, setSelectedWishId] = useState(null);
    const [selectedWish, setSelectedWish] = useState({});
    const [errMessage, setErrMessage] = useState('');
    const [helpReset, setHelpReset] = useState(false);

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
    
    function handleSelectDeleteWish(item) {
        navigate(`/dashboard/wishlists/${wishListSlug}/wish/delete?id=${item._id}`);
        setSelectedWish(item);
        setSelectedWishId(item._id);
    }

    function handleChangeTab(tab) {
        setSelectedTab(tab)
    }

    function handleCheck(id) {
        setCheckedIds(prev => {
            if(prev.find(prevId => prevId === id)) {
                return [...prev.filter(prevId => prevId !== id)];
            }
            return [...prev, id];
        });
    }

    async function handleDeleteWishItem() {
        try {

        } catch(err) {

        } finally {

        }
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
                setWishes(data.data.wishList?.wishes)
            } catch(err) {
                console.log(err.message);
                setErrMessage(err.message)
            } finally {
                setIsLoading(false)
            }
        }
        handleFetchList()
    }, [helpReset]);

  return (
    <>
        <WishListDashHeader />

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
                            {/* <div className="lists--tab"><PiFunnelBold /> Filter</div> */}
                        </div>
                    </div>
                    {isLoading && (<SkelentonOne />)}
                    <ul className='lists--figure'>
                        {(wishArr && wishArr.length > 0) ? wishArr?.map(wishItem => (
                            <li className={`lists--item ${(calculatePercentage(wishItem.amount, wishItem.amountPaid) === 100) ? 'lists--completed' : ''}`} key={wishItem._id}>
                                <span className='lists--item-top'>
                                    <span className='lists--content'>
                                        <span onClick={() => handleCheck(wishItem._id)} style={(checkedIds.find(id => id === wishItem._id)) ? { backgroundColor: '#bb0505', boxShadow: 'none' } : {}}>{(checkedIds.find(id => id === wishItem._id)) && <FaCheck style={{ color: '#fff' }} />}</span>
                                        <p style={(checkedIds.find(id => id === wishItem._id)) ? { textDecoration: 'line-through'} : {}}>{wishItem.wish}</p>
                                    </span>
                                    <div className='lists--actions'>
                                        {/* <span onClick={() => navigate(`/dashboard/wishlists/${wishListSlug}/wish/pay?id=${wishItem._id}`)}><img height={'17rem'} src={paystackSvg} /><p>Pay</p></span> */}
                                        {/* <span><img height={'17rem'} src={paystackSvg} /><p>Pay</p></span> */}
                                        <span onClick={() => handleSelectedWish(wishItem)}><RiEditLine /></span>
                                        <span onClick={() => handleSelectDeleteWish(wishItem)}><RiDeleteBin6Line /></span>
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
                        )) : (!isLoading && !errMessage && wishArr && wishArr.length === 0) && (
                            <li className='lists--message'>
                                {selectedTab === 'completed' ? 'No Completed Wishes!' : 'You\'ve No Wishes Yet!'}
                                <picture>
                                    <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f61e/512.webp" type="image/webp" />
                                    <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f61e/512.gif" alt="😞" width="32" height="32" />
                                </picture>
                            </li>
                        )}
                        {(errMessage) && (
                            <li className='lists--message'>
                                {errMessage} 
                                <picture>
                                    <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f6f8/512.webp" type="image/webp" />
                                    <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f6f8/512.gif" alt="🛸" width="32" height="32" />
                                </picture>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </section>


        {location.pathname === `/dashboard/wishlists/${wishListSlug}/wish` && <WishInputUi wishListId={wishList._id} type={'new'} setHelpReset={setHelpReset} />}
        {location.pathname === `/dashboard/wishlists/${wishListSlug}/wish/edit` && <WishInputUi wishDetails={selectedWish} wishListId={wishList._id} type={'edit'} setHelpReset={setHelpReset} />}
        {location.pathname === `/dashboard/wishlists/${wishListSlug}/wish/delete` && (
            <DeleteModalUi title={`Delete Wish!`}>
                <p className='modal--text'>Are you sure you want to delete this wish?</p>
                <span className='modal--info'>Note that everything relating data to this wish would also be deleted including transaction history!</span>
                <div className="modal--actions">
                    <span type="submit" className='delete--cancel' onClick={() => navigate(-1)}>Cancel</span>
                    <span type="button" className='delete--submit' onClick={handleDeleteWishItem}>Delete Wish</span>
                </div>
            </DeleteModalUi>
        )}
    </>
  )
}

export default WishListUi
