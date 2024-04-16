import React, { useEffect } from 'react'

import { capitalizeFirstLetter, dateConverter, numberConverter } from '../../../utils/helper';
import { AiFillCheckCircle, AiFillExclamationCircle, AiOutlineClose } from 'react-icons/ai';
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useState } from 'react';
import GiftLoader from '../../../Assets/images/gifta-loader.gif';


import { useAuthContext } from '../../../Auth/context/AuthContext';
import { createPortal } from 'react-dom';
import Alert from '../../../Components/Alert';


function BoughtItemModal({ item, handleCloseModal, category }) {
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState('');

    const { token } = useAuthContext()

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
            <aside className={`item__modal`} key={item._id}>

                <div className="item--container">
                    <span className='item--image-box'>
                        <img src={`${import.meta.env.VITE_SERVER_ASSET_URL}/${category === 'stickers' ? 'stickers' : 'others'}/${item?.image}`} alt={item?.name} className="item--img" />
                    </span>

                    <div className="product--info">
                        <h4 className="product--title">{category === 'stickers' ? capitalizeFirstLetter(item?.type + ' sticker') : item?.name}</h4>

                        {category !== "stickers" && (
                            <div className="product--vendor item--vendor">
                                <div className="vendor--main">
                                    <img className='' src={'https://res.cloudinary.com/dy3bwvkeb/image/upload/v1701957741/avatar_unr3vb-removebg-preview_rhocki.png'} alt={item?.vendor?.fullName} />
                                    <div>
                                        <p className='product-item-username'>{item?.vendor?.fullName}</p>
                                        <p className='product-vendor--email'>{item?.vendor?.email}</p>
                                    </div>
                                </div>

                            </div>
                        )}

                        <span className="product--actions">
                            

                            <button className="product--btn" onClick={() => handlePurchaseDigitalGift(category)}>Gift item</button>
                        </span>
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
