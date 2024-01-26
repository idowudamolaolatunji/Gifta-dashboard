import React, { useEffect, useState } from 'react'
import WishListDashHeader from './WishListDashHeader'
import { useAuthContext } from '../../../Auth/context/AuthContext'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { PiFunnelBold, PiPlusBold, PiShareFatFill } from 'react-icons/pi';
import { RiDeleteBin6Line, RiEditLine } from 'react-icons/ri';
import { IoChevronBackOutline, IoEllipsisVerticalSharp, IoPricetagOutline } from 'react-icons/io5';
import { SlCalender } from "react-icons/sl";
import ProgressBar from '../../../Components/ProgressBar';
import { calculatePercentage, currencyConverter, dateConverter, expectedDateFormatter, numberConverter } from '../../../utils/helper';
import { FaCheck } from 'react-icons/fa6';
import WishInputUi from './WishInputUi';
import DeleteModalUi from './DeleteModalUi';
import paystackSvg from '../../../Assets/svgs/paystack.svg';
import SkelentonOne from '../../../Components/SkelentonOne';
import DashboardModal from '../../../Components/Modal';
import { ShareSocial } from 'react-share-social';
import Alert from '../../../Components/Alert';
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';
import GiftLoader from '../../../Assets/images/gifta-loader.gif';



const customStyle = {
	minHeight: "auto",
	maxWidth: "48rem",
	width: "48rem",
};

const shareCustomStyle = {
	root: {
		padding: 0,
		marginTop: '-1.2rem',
	},
	copyContainer: {
		fontWeight: 600,
		fontSize: '1.6rem',
		padding: '1rem',
	},
}

function WishListUi() {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('all');
    const [wishList, setWishList] = useState({});
    const [wishes, setWishes] = useState([]);
    // const [checkedIds, setCheckedIds] = useState([]);
    const [selectedWishId, setSelectedWishId] = useState(null);
    const [selectedWish, setSelectedWish] = useState({});
    const [errMessage, setErrMessage] = useState('');
    const [helpReset, setHelpReset] = useState(false);
    const [share, setShare] = useState(false);
	const [url, setUrl] = useState('');

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const [showNewModal, setShowNewModal] = useState(function () {
        return JSON.parse(localStorage.getItem('wishNewModal')) || false;
    });
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    
    // WISHLIST ACTIONS ON MOBILE
    const [showActionInfo, setShowActionInfo] = useState(false);
	// const [showWishlistDeleteModal, setShowWishlistDeleteModal] = useState(false);
	// const [showWishListEditModal, setShowWishListEditModal] = useState(false);


    useEffect(function () {
        return localStorage.setItem('wishNewModal', JSON.stringify(showNewModal));
    }, [showNewModal]);

    // function handle

    function handleShare(link, hasWish) {
		if(hasWish) {
			setShare(true);
			setUrl(link);
		} else {
			handleFailure('No wish to share!');
			setShare(false);
			setUrl('');
		}
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

    // HANDLE FETCH STATE RESET
    function handleReset() {
        setIsError(false);
        setMessage('')
        setIsSuccess(false);
    }


    const allWishes = wishes;
    const completedWishes = wishes?.filter(wish => wish.isPaidFor === true)
    const wishArr = selectedTab === 'all' ? allWishes : completedWishes;

    const { user, token } = useAuthContext();

    const { wishListSlug } = useParams();
    // const location = useLocation();
    const navigate = useNavigate();

    function handleSelectedWish(item) {
        // navigate(`/dashboard/wishlists/${wishListSlug}/wish/edit?id=${item._id}`)
        setSelectedWish(item);
        setShowEditModal(true)
    }

    function handleSelectDeleteWish(item) {
        // navigate(`/dashboard/wishlists/${wishListSlug}/wish/delete?id=${item._id}`);
        setSelectedWish(item);
        setSelectedWishId(item._id);
        setShowDeleteModal(true)
    }

    function handleChangeTab(tab) {
        setSelectedTab(tab)
    }


    async function handleDeleteWishItem() {
        try {
            setIsLoading(true);
            handleReset();
            setHelpReset(false);
            const res = await fetch(`https://test.tajify.com/api/wishlists/delete-wish/${wishList._id}/${selectedWishId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            if(!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            if(data.status !== "success") {
                throw new Error(data.message);
            }
            setMessage(data.message);
			setIsSuccess(true);
			setTimeout(() => {
                showDeleteModal(false);
				setIsSuccess(false);
				setMessage("");
                setHelpReset(true);
			}, 1500);
        } catch (err) {
            handleFailure(err.message);
        } finally {
            setIsLoading(false);
        }
    }


    useEffect(function () {
        async function handleFetchList() {
            try {
                setIsLoading(true)
                // const res = await fetch(`http://localhost:3010/api/wishlists/user-wishlists/wishlists/${wishListSlug}`, {
                const res = await fetch(`https://test.tajify.com/api/wishlists/user-wishlists/wishlists/${wishListSlug}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!res.ok) throw new Error('Something went wrong!');
                const data = await res.json();
                console.log(res, data)
                if (data.status !== 'success') throw new Error(data.message)
                setWishList(data.data.wishList);
                setIsLoading(true)
            } catch (err) {
                setErrMessage(err.message);
                setIsLoading(false)
            }
        }
        handleFetchList()
    }, []);

    useEffect(function () {
        async function handleFetchWishes() {
            try {
                setIsLoading(true)
                // const res = await fetch(`http://localhost:3010/api/wishlists/all-wishes/${wishList._id}`, {
                const res = await fetch(`https://test.tajify.com/api/wishlists/all-wishes/${wishList._id}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
                if (!res.ok) throw new Error('Something went wrong!');
                const data = await res.json();
                if (data.status !== "success") throw new Error(data.message);

                setWishes(data.data.wishes);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false)
            }
        }
        handleFetchWishes();
    }, [wishList, helpReset]);


    
    return (
        <>
            <WishListDashHeader />

            <>
                {isLoading && (
                    <div className='gifting--loader'>
                        <img src={GiftLoader} alt='loader' />
                    </div>
                )}
            </>
            
            {/* {(showActionInfo) && (
                <>
                    <div className="overlay" onClick={() => setShowActionInfo(false)} style={{ zIndex: 3000 }} />
                    <div className="w-figure--action-box">
                        <ul>
                            <li onClick={() => setShowWishListEditModal(true)}>Edit</li>
                            <li onClick={() => setShowWishlistDeleteModal(true)}>Delete</li>
                        </ul>
                    </div>
                </>
            )} */}

            <section className="section">
                <div className="section__container">
                    <span onClick={() => navigate(-1)} className='wishlist--back-btn back-btn'>Back</span>


                    <div className="wish--lists list--container">
                        <span className='lists--title destop-title'>{wishList?.name}</span>

                        <div className="lists--head-box-mobile">
                            <img src={`https://test.tajify.com/asset/others/${wishList.image}`} alt={wishList?.name} />
                            <div>
                                <span onClick={() => navigate(-1)} className='wishlist--back-btn-mobile'><IoChevronBackOutline /></span>
                                <span className='lists--title'>{wishList?.name}</span>
                                <span className='lists--share-btn' onClick={() => handleShare(`https://app.getgifta.com/shared/${wishList.shortSharableUrl}`, wishes.length > 0)} >Share <PiShareFatFill /></span>
                                <span className='lists--date'>Created: {' '}{dateConverter(wishList.createdAt)}</span>

                                <IoEllipsisVerticalSharp className="figure--icon" style={{ color: '#fff' }} onClick={() => setShowActionInfo(!showActionInfo)} />
                            </div>
                        </div>

                        <div className="lists--tabs">
                            <div className="main--tabs">
                                <div className={`lists--tab ${selectedTab === 'all' ? 'tab--active' : ''}`} onClick={() => handleChangeTab('all')}>All <span>{allWishes?.length}</span></div>
                                <div className={`lists--tab ${selectedTab === 'completed' ? 'tab--active' : ''}`} onClick={() => handleChangeTab('completed')}>Completed <span>{completedWishes?.length}</span></div>
                            </div>
                            <div className="sub--tabs">
                                {/* <Link to={`/dashboard/wishlists/${wishListSlug}/wish?new=${true}`}> */}
                                <div className="lists--tab" onClick={() => setShowNewModal(true)}><PiPlusBold /> add{wishes?.length > 0 ? ' more' : ' '} wish</div>
                                {/* </Link> */}
                            </div>
                        </div>

                        {isLoading && (<SkelentonOne />)}

                        <ul className='lists--figure'>
                            {(wishArr && wishArr?.length > 0 && !isLoading) ? wishArr?.map(wishItem => (
                                <li className={`lists--item ${(calculatePercentage(wishItem.amount, wishItem.amountPaid) === 100) ? 'lists--completed' : ''}`} key={wishItem._id}>
                                    <span className='lists--item-top'>
                                        <span className='lists--content'>
                                            {/* <span onClick={() => handleCheck(wishItem._id)} style={(checkedIds.find(id => id === wishItem._id)) ? { backgroundColor: '#bb0505', boxShadow: 'none' } : {}}>{(checkedIds.find(id => id === wishItem._id)) && <FaCheck style={{ color: '#fff' }} />}</span> */}
                                            {/* <p style={(checkedIds.find(id => id === wishItem._id)) ? { textDecoration: 'line-through' } : {}}>{wishItem.wish}</p> */}
                                            <p>{wishItem.wish}</p>
                                        </span>
                                        <div className='lists--actions'>
                                            <span onClick={() => handleSelectedWish(wishItem)}><RiEditLine /></span>
                                            <span onClick={() => handleSelectDeleteWish(wishItem)}><RiDeleteBin6Line /></span>
                                        </div>
                                    </span>
                                    <span className='lists--item-bottom'>
                                        <div className='lists--insight'>
                                            <span><IoPricetagOutline /><p>₦{numberConverter(wishItem.amount)}</p></span>
                                            <span><SlCalender /><p>{expectedDateFormatter(wishItem.deadLineDate)}</p></span>
                                        </div>
                                        <ProgressBar amountPaid={`₦${numberConverter(wishItem.amountPaid)}`} progress={`${calculatePercentage(wishItem.amount, wishItem.amountPaid)}%`} />
                                    </span>
                                </li>

                            )) : (!isLoading && wishArr?.length === 0) && (
                                <li className='lists--message'>
                                    {selectedTab === 'completed' ? 'No Completed Wishes!' : 'You\'ve No Wishes Yet!'}
                                    <picture>
                                        <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f61e/512.webp" type="image/webp" />
                                        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f61e/512.gif" alt="😞" width="32" height="32" />
                                    </picture>
                                </li>
                            )}

                            {(!wishArr && errMessage) && (
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


            {/* {location.pathname === `/dashboard/wishlists/${wishListSlug}/wish` && <WishInputUi wishListId={wishList._id} type={'new'} setHelpReset={setHelpReset} />}
        {location.pathname === `/dashboard/wishlists/${wishListSlug}/wish/edit` && <WishInputUi wishDetails={selectedWish} wishListId={wishList._id} type={'edit'} setHelpReset={setHelpReset} />} */}


            {showNewModal && (
                <WishInputUi setShowModal={setShowNewModal} wishListId={wishList._id} type={'new'} setHelpReset={setHelpReset} />
            )}

            {showEditModal && (
                <WishInputUi wishDetails={selectedWish} setShowModal={setShowEditModal} wishListId={wishList._id} type={'edit'} setHelpReset={setHelpReset} />
            )}

            {showDeleteModal && (
                <DeleteModalUi title={`Delete Wish!`} setShowDeleteModal={setShowDeleteModal}>
                    <p className='modal--text'>Are you sure you want to delete this wish?</p>
                    <span className='modal--info'>Note that everything relating data to this wish would also be deleted including transaction history!</span>
                    <div className="modal--actions">
                        <span type="submit" className='delete--cancel' onClick={() => setShowDeleteModal(false)}>Cancel</span>
                        <span type="button" className='delete--submit' onClick={handleDeleteWishItem}>Delete Wish</span>
                    </div>
                </DeleteModalUi>
            )}

            {share && (
				<DashboardModal
					title={'Make your wish come true! Share Link'}
					setShowDashboardModal={setShare}
					customStyle={customStyle}
					>
					<ShareSocial  
						url={url}
						socialTypes= {['facebook','twitter', 'whatsapp', 'telegram', 'linkedin']}
						onSocialButtonClicked={ (data) => console.log(data)}  
						style={shareCustomStyle}
					/>
				</DashboardModal>
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

export default WishListUi
