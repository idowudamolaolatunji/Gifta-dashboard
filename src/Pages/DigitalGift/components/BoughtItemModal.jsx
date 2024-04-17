import React, { useEffect } from 'react'

import { capitalizeFirstLetter, dateConverter, numberConverter, numberConverterSticker } from '../../../utils/helper';
import { AiFillCheckCircle, AiFillExclamationCircle, AiOutlineClose } from 'react-icons/ai';
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useState } from 'react';
import GiftLoader from '../../../Assets/images/gifta-loader.gif';
import { GoSearch } from "react-icons/go";


import { useAuthContext } from '../../../Auth/context/AuthContext';
import { createPortal } from 'react-dom';
import Alert from '../../../Components/Alert';
import SearchModal from './SearchModal';


function Loading() {
    return <p style={{ fontSize: '1.2rem' }}>Loading...</p>
}

function BoughtItemModal({ item, handleCloseModal, category }) {
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState('');

    const [codes, setCodes] = useState([]);
    const [isShown, setIsShown] = useState(false);
    const [isLoadingCodes, setIsLoadingCodes] = useState(true);

    const [isAtMax, setIsAtMax] = useState(false);
    const [maxQuantity, setMaxQuantity] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const [querySomeOne, setQuerySomeOne] = useState('');
    const [isToGiftSomeone, setIsToGiftSomeone] = useState(false);
    const [isLoadingResult, setIsLoadingResult] = useState(true)

    const [showSearchModal, setShowSearchModal] = useState(false)
    const [result, setResult] = useState([]);
    const [errMess, setErrMess] = useState('');
    const [selectedUser, setSelectedUser] = useState({});
    

    const { token } = useAuthContext()

    function incQuantity() {
        if (quantity < maxQuantity) {
            setQuantity(prev => prev + 1);
        }   
    }
    function decQuantity() {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    }
    function handleInputQuality(value) {
        const numValue = Number(value)
        if(!value || numValue > maxQuantity) return;
        setQuantity(numValue)
    }

    useEffect(function() {
        setMaxQuantity(item?.balance)
    }, [item]);

    useEffect(function() {
        if(quantity === maxQuantity) {
            setIsAtMax(true)
        } else {
            setIsAtMax(false)
        }
    }, [quantity])

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
        }, timeout);
    }

    function handleGenButton() {
        setIsToGiftSomeone(!isToGiftSomeone);
        setSelectedUser({});
        setQuerySomeOne('');
    }

    useEffect(function() {
        async function fetchCodes() {
            try {
                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/digital-giftings/codes/${item?.digitalGift?._id}/${item?._id}`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    } 
                });

                if(!res.ok) throw new Error('Something went wrong!');
                const data = await res.json();
                if(data.status !== "success") throw new Error(data.message);
                console.log(data)
                setCodes(data.data.codes);
            } catch(err) {
                console.log(err.message);
            } finally {
                setIsLoadingCodes(false)
            }
        }

        fetchCodes();
    }, [])

    async function handleSearchUser() {
        if(selectedUser?.username === querySomeOne) return;
        setShowSearchModal(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/search/find-username?query=${querySomeOne}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            });
        
            if (!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            setResult(data.data.results);
        } catch(err) {
            setErrMess(err.message)
        } finally {
            setIsLoadingResult(false)
        }
    }


    async function handleGiftStickers() {
        try {
            setIsLoading(true);
            handleReset();

            const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/digital-stickers/gift-sticker/${item?._id}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ username: selectedUser?.username, quantity, stickerType: item?.stickerType })
            });

            if(!res.ok) throw new Error('Something went wrong!');
            const data = res.json()
            if(data.status !== "success") throw new Error(data.message);
            setIsSuccess(true);
            setMessage(data.message)
            setTimeout(function() {
                setIsSuccess(false);
                setMessage('');
                // handleCloseModal();
            }, 2000);
        } catch(err) {
            handleFailure(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    // async function handlePurchaseDigitalGift(type) {
    //     const baseUrl = import.meta.env.VITE_SERVER_URL
    //     let url, body;
    //     if(type === 'stickers') {
    //         url = `${baseUrl}/digital-stickers/purchase-sticker`;
    //         body = { stickerType: item?.type, quantity }
    //     }else {
    //         url = `${baseUrl}/digital-giftings/purchase-digital-gift/${item?._id}`;
    //         body = { quantity }
    //     }
    //     try {
    //         setIsLoading(true);
    //         handleReset();

    //         const res = await fetch(url, {
    //             method: 'POST',
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`
    //             },
    //             body: JSON.stringify(body)
    //         });

    //         if(!res.ok) throw new Error('Something went wrong');
    //         const data = await res.json();
    //         if(data.status !== 'success') throw new Error(data.message);

    //         setIsSuccess(true);
    //         setMessage(data.message)
    //         setTimeout(function() {
    //             setIsSuccess(false);
    //             setMessage();
    //             handleCloseModal();
    //         }, 2000);

    //     } catch(err) {
    //         handleFailure(err.message)
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }

    return (
        <>
            {createPortal(
                isLoading && (
                    <div className='gifting--loader'>
                        <img src={GiftLoader} alt='loader' />
                    </div>
                ), document.body
            )}

            <div className="product__modal--overlay" onClick={handleCloseModal} />
            <aside className={`item__modal ${category === 'stickers' ? 'item--sticker-modal' : ''}`} key={item._id}>

                <div className="item--container">
                    <span className='item--image-box'>
                        <img src={`${import.meta.env.VITE_SERVER_ASSET_URL}/${category === 'stickers' ? `stickers/${item?.sticker?.image}` : `others/${item?.digitalGift?.image}`}`} alt={item?.name} className="item--img" />
                    </span>

                    <div className="product--info">
                        <h4 className="product--title">{category === 'stickers' ? capitalizeFirstLetter(item?.stickerType + ' sticker') : item?.digitalGift?.name}</h4>

                        {category !== "stickers" && (
                            <div className="product--vendor item--vendor">
                                {/* <div className="vendor--main">
                                    <img className='' src={'https://res.cloudinary.com/dy3bwvkeb/image/upload/v1701957741/avatar_unr3vb-removebg-preview_rhocki.png'} alt={item?.digitalGift?.vendor?.fullName} />
                                    <div>
                                        <p className='product-item-username'>{item?.digitalGift?.vendor?.fullName}</p>
                                        <p className='product-vendor--email'>{item?.digitalGift?.vendor?.email}</p>
                                    </div>
                                </div> */}

                                <span className='expiry-date'>Expires Date:<p>{new Date(item?.digitalGift?.expiryDate).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}</p></span>
                                <span className='expiry-date'>Bought Quantity:<p>{item?.quantity}</p></span>

                                <div className="item--code">
                                    <p className='code-heading'>Giftcard code{codes?.length > 1 ? 's' : ''}</p>
                                    <span className="item--code-box">
                                        {isLoadingCodes && <Loading />}
                                        {codes?.length > 0 && codes.map((code, i) => (
                                            <span className='code-code'>
                                                <span className="expiry-date">Code{codes > 1 ? `-${i+1}` : ''}:<p className={!isShown ? 'code-unseen' : ''}>{code?.code}</p></span> 
                                                <button key={code?._id} onClick={() => setIsShown(!isShown)}>{isShown ? 'Hide' : 'Show'}</button>
                                            </span>
                                        ))}
                                    </span>
                                </div>

                            </div>
                        )}

                        {category === "stickers" && (
                            <>
                                <div className="item--info">
                                    <span style={isAtMax ? { color: 'red', transform: 'scale(1.05)', transition: 'all 0.35s'} : {}} className="expiry-date">Owned Quantity<span className='item--quantity'>x {item?.balance}</span></span>

                                    <span className="product--quantity">
                                        <span onClick={decQuantity}><FaMinus /></span>
                                        <input type="text" value={quantity} onChange={(e) => handleInputQuality(e.target.value)} placeholder='1' />
                                        <span onClick={incQuantity}><FaPlus /></span>
                                    </span>
                                </div>

                                {console.log(selectedUser, querySomeOne)}

                                {isToGiftSomeone && (
                                    <div className="item--search-box">
                                        <input type="text" className='item--input' value={querySomeOne} onChange={(e) => setQuerySomeOne(e.target.value)} placeholder='Search by username' />

                                        <button className={selectedUser?.username === querySomeOne ? 'btn-no-req' : ''} onClick={handleSearchUser}><GoSearch /></button>

                                        {showSearchModal && (
                                            <SearchModal results={result} errMessage={errMess} isLoading={isLoadingResult} setSelectedUser={setSelectedUser} setShowSearchModal={setShowSearchModal} setQuerySomeOne={setQuerySomeOne} />
                                        )}
                                    </div>
                                )}

                                <div className="item--btn--actions">
                                    <button className="item--btn" onClick={handleGenButton}>{isToGiftSomeone ? 'Cancel' : 'Gift Someone'}</button>

                                    {selectedUser?.username === querySomeOne && isToGiftSomeone && <button className="item--btn" onClick={handleGiftStickers}>Send</button>}
                                </div>
                            </>
                        )}


                    </div>
                </div>
            </aside>

            {
            createPortal(
                (message) && (
                    <Alert alertType={`${isSuccess ? "success" : isError ? "error" : ""}`}>
                        {isSuccess ? (
                            <AiFillCheckCircle className="alert--icon" />
                        ) : isError ? (
                            <AiFillExclamationCircle className="alert--icon" />
                        ) : (
                            ""
                        )}
                        <p>{message}</p>
                    </Alert>
                ), document.body
            )}
        </>
    )
}

export default BoughtItemModal;
