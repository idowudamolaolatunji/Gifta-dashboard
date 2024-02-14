import React, { useEffect, useRef, useState } from 'react'
import WishListDashHeader from './WishListDashHeader'
import { useAuthContext } from '../../../Auth/context/AuthContext'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { PiFunnelBold, PiPlusBold, PiShareFatFill } from 'react-icons/pi';
import { RiDeleteBin6Line, RiEditLine } from 'react-icons/ri';
import { IoChevronBackOutline, IoEllipsisVerticalSharp, IoPricetagOutline } from 'react-icons/io5';
import { SlCalender } from "react-icons/sl";
import ProgressBar from '../../../Components/ProgressBar';
import { calculatePercentage, currencyConverter, dateConverter, expectedDateFormatter, getInitials, numberConverter, truncate } from '../../../utils/helper';
import { FaCheck } from 'react-icons/fa6';
import WishInputUi from './WishInputUi';
import DeleteModalUi from './DeleteModalUi';
import paystackSvg from '../../../Assets/svgs/paystack.svg';
import SkelentonOne from '../../../Components/SkelentonOne';
import DashboardModal from '../../../Components/Modal';
import { ShareSocial } from 'react-share-social';
import Alert from '../../../Components/Alert';
import { AiFillCheckCircle, AiFillExclamationCircle, AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import GiftLoader from '../../../Assets/images/gifta-loader.gif';
import { FiPlus, FiUsers } from "react-icons/fi";


import { BiMessageSquareDetail } from "react-icons/bi";
import PaymentLog from '../../../Components/PaymentLog';
import { MdReply } from 'react-icons/md';
import { IoMdSend } from 'react-icons/io';
import ReactTextareaAutosize from 'react-textarea-autosize';
import { TbPigMoney } from 'react-icons/tb';


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
    const [wishlistLogs, setWishlistLogs] = useState([]);
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
    const [showWishActionInfo, setWishShowActionInfo] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showLogsReplyModal, setShowLogsReplyModal] = useState(false);
    const [selectedLog, setSeletedLog] = useState({});
    const [replyMessage, setReplyMessage] = useState('');
    const [append, setAppend] = useState(false);
    const [isSent, setIsSent] = useState(false);

    useEffect(function() {
        if(isSent) {
            setAppend(true);
        }
    }, [isSent])



    // WISHLIST ACTIONS ON MOBILE
    const [showActionInfo, setShowActionInfo] = useState(false);
    const [showWishlistDeleteModal, setShowWishlistDeleteModal] = useState(false);
    const [showWishListEditModal, setShowWishListEditModal] = useState(false);


    useEffect(function () {
        return localStorage.setItem('wishNewModal', JSON.stringify(showNewModal));
    }, [showNewModal]);

    // function handle

    function handleShare(link, hasWish) {
        if (hasWish) {
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

    function handleReply(log) {
        setSeletedLog(log);
        setShowLogsReplyModal(true);
    }


    const allWishes = wishes;
    const completedWishes = wishes?.filter(wish => wish.isPaidFor === true)
    console.log(wishList)
    // console.log(allWishes, completedWishes, wishlistLogs)
    const wishArr = selectedTab === 'all' ? allWishes : selectedTab === 'completed' && completedWishes;

    const { user, token } = useAuthContext();

    const { wishListSlug } = useParams();
    // const location = useLocation();
    const navigate = useNavigate();


    function handleWish(item) {
        setWishShowActionInfo(true)
        setSelectedWishId(item._id);
        setSelectedWish(item);
    }
    function handleEditAction() {
        setWishShowActionInfo(false);
        setShowEditModal(true)
    }
    function handleDeleteAction() {
        setWishShowActionInfo(false);
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
            if (!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            if (data.status !== "success") {
                throw new Error(data.message);
            }
            setIsSuccess(true);
            setMessage(data.message);
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
        handleFetchList();
    }, []);


    useEffect(function () {
        async function handleFetchWishes() {
            try {
                console.log()
                setIsLoading(true)
                const res = await fetch(`https://test.tajify.com/api/wishlists/all-wishes/${wishList?._id}`, {
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

        if(wishList._id) {
            handleFetchWishes();
        }
    }, [wishList, helpReset]);



    useEffect(function () {
        async function handleFetchWishLogs() {
            try {
                console.log(wishList._id)
                setIsLoading(true)
                const res = await fetch(`https://test.tajify.com/api/wishlists/wishlist-log/logs/${wishList?._id}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                });
                if (!res.ok) throw new Error('Something went wrong!');
                const data = await res.json();
                if (data.status !== "success") throw new Error(data.message);
                console.log(data)

                setWishlistLogs(data.data.wishlistLogs);
            } catch (err) {
                console.log(err);
            } finally {
                setIsLoading(false)
            }
        }

        if(wishList._id) {
            handleFetchWishLogs();
        }
    }, [wishList]);


    async function handleSendMessge(e) {
        try {
            e.preventDefault();
            setIsSent(true);

        } catch(err) {
            console.log(err);
        }
    }



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
                                <div className={`lists--tab ${selectedTab === 'logs' ? 'tab--active' : ''}`} onClick={() => handleChangeTab('logs')}><FiUsers /> Contributors <span>{wishlistLogs?.length}</span></div>
                            </div>
                        </div>

                        {isLoading && (<SkelentonOne />)}

                        <ul className='lists--figure'>
                            {selectedTab !== 'logs' && (wishArr && wishArr?.length > 0 && !isLoading) ? wishArr?.map(wishItem => (
                                <li className={`lists--item ${(calculatePercentage(wishItem.amount, wishItem.amountPaid) === 100) ? 'lists--completed' : ''}`} key={wishItem._id} onClick={() => (calculatePercentage(wishItem.amount, wishItem.amountPaid) === 100) ? '' : handleWish(wishItem)}>
                                    <span className='lists--item-top'>
                                        <span className='lists--content'>
                                            <p>{truncate(wishItem.wish, 24)}</p>
                                        </span>
                                        {/* <div className='lists--actions'>
                                            <span onClick={() => handleSelectedWish(wishItem)}><RiEditLine /></span>
                                            <span onClick={() => handleSelectDeleteWish(wishItem)}><RiDeleteBin6Line /></span>
                                        </div> */}

                                        <ProgressBar amountPaid={`₦${numberConverter(wishItem.amountPaid)}`} progress={`${calculatePercentage(wishItem.amount, wishItem.amountPaid)}%`} />

                                    </span>
                                    <span className='lists--item-bottom'>
                                        <div className='lists--insight'>
                                            <span><IoPricetagOutline /><p>₦{numberConverter(wishItem.amount)}</p></span>
                                            <span><SlCalender /><p>{expectedDateFormatter(wishItem.deadLineDate)}</p></span>
                                            <span><TbPigMoney /><p>₦{numberConverter(wishItem.amountPaid)}</p></span>
                                        </div>
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


                            {selectedTab === 'logs' && (wishlistLogs && !isLoading) ? wishlistLogs.map(wishLog => (
                                <li className="list--contributors">
                                    <div className="contributor--top">
                                        <span className="contibutor__img-initials">
                                            {getInitials(wishLog.anonymous ? 'Anonymous' : wishLog.name)}
                                        </span>
                                        <p>{wishLog.anonymous ? 'Anonymous' : wishLog.name}</p>
                                    </div>
                                    <div className="contributor--middle">
                                        <p>{wishLog.message}</p>
                                        <li className='contributor--wish'>{truncate(wishLog.wish.wish)}</li>
                                    </div>
                                    <div className="contributor--bottom">
                                        <p>{dateConverter(wishLog.createdAt)}</p>
                                        <span onClick={() => !wishLog.anonymous && handleReply(wishLog)} className={`contributor--reply ${wishLog.anonymous ? 'reply--anno' : ''}`}><MdReply /> Reply</span>
                                    </div>
                                </li>
                            )) : (selectedTab === 'logs' && wishlistLogs.length < 1) && (
                                <li className='lists--message'>
                                    No Contributors
                                    <picture>
                                        <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f61e/512.webp" type="image/webp" />
                                        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f61e/512.gif" alt="😞" width="32" height="32" />
                                    </picture>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {selectedTab === 'all' && <div className="dashnoard--add-btn" onClick={() => setShowNewModal(true)}><FiPlus /></div>}
            </section>


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
                        socialTypes={['facebook', 'twitter', 'whatsapp', 'telegram', 'linkedin']}
                        onSocialButtonClicked={(data) => console.log(data)}
                        style={shareCustomStyle}
                    />
                </DashboardModal>
            )}

            {showLogsReplyModal && (
                <>
                    <div className='wish--overlay' onClick={() => setShowLogsReplyModal(false)} />
                    <form className={`wish--form wish--modal form--reply`}>
                        <div className="wish--form-heading">{`Replying to ${selectedLog.name}`}</div>
                        <div className='form--chat form--chat-left'>
                            <span className="contibutor__img-initials">
                                {getInitials(selectedLog.name)}
                            </span>
                            <div className="reply--box reply--left">
                                <p className='reply--name'>{selectedLog.name}</p>
                                <p className='reply--message'>{selectedLog.message}</p>
                                <li className='contributor--wish'>{truncate(selectedLog.wish.wish)}</li>
                            </div>
                        </div>
                        {append && (
                            <div className='form--chat form--chat-right'>
                                <div className="reply--box reply--right">
                                    <p className='reply--name'>You</p>
                                    <p className='reply--message'>{replyMessage}</p>
                                    <span className='reply--date'>{dateConverter(Date.now())}</span>
                                </div>

                                {(user?.image !== "") ? (
                                    <img
                                        alt={user?.fullName + "'s image"}
                                        src={`https://test.tajify.com/asset/users/${user?.image}`}
                                    /> 
                                ) : (
                                    <span className="contibutor__img-initials">
                                        {getInitials(user?.fullName || user.username)}
                                    </span>
                                )}
                            </div>
                        )}
                        <div className='form--send'>
                            <ReactTextareaAutosize className='form__textarea' defaultValue="Message..." value={replyMessage} onChange={e => setReplyMessage(e.target.value)} />
                            <button type="submit" className='reply--btn' onClick={(e) => handleSendMessge(e)}><IoMdSend /></button>
                        </div>
                    </form>
                </>
            )}


            {(showActionInfo) && (
                <>
                    <div className="overlay" onClick={() => setShowActionInfo(false)} style={{ zIndex: 2000 }} />
                    <div className="w-figure--action-box">
                        <span onClick={() => setShowWishListEditModal(true)}><AiOutlineEdit className='w-figure--action-icon' /> Edit</span>
                        <span onClick={() => setShowWishlistDeleteModal(true)}><AiOutlineDelete className='w-figure--action-icon' /> Delete</span>
                    </div>
                </>
            )}
            {(showWishActionInfo) && (
                <>
                    <div className="overlay" onClick={() => setWishShowActionInfo(false)} style={{ zIndex: 2000 }} />
                    <div className="w-figure--action-box">
                        <span onClick={() => handleEditAction()}><AiOutlineEdit className='w-figure--action-icon' /> Edit</span>
                        <span onClick={() => handleDeleteAction()}><AiOutlineDelete className='w-figure--action-icon' /> Delete</span>
                    </div>
                </>
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
