import React from 'react'

import { numberConverter } from '../../../utils/helper';
import { AiOutlineClose } from 'react-icons/ai';
import { useState } from 'react';
import GiftingForm from '../../Gifting/GiftingComponents/GiftingForm';

import giftaLogo from "../../../Assets/gifta-logo.png";
import Cookies from 'js-cookie';


function Product({ product, handleCloseModal }) {
    // const [isLoading, setIsLoading] = useState(false)
    const [showGiftingForm, setShowGiftingForm] = useState('');
    const [currImage, setCurrImage] = useState(product.image);
    const [quantity, setQuantity] = useState(1);
    const amount = Number(quantity * product.price);

    const productInfo = {
        name: product.name,
        id: product._id,
        amount: product.price,
        purpose: product.category,
        quantity,
        totalPrice: amount,
    }
    console.log(productInfo)

    function handleShowForm() {
        setShowGiftingForm(true);
        Cookies.set('productInfo', JSON.stringify(productInfo));
    }
    function handleHideForm() {
        setShowGiftingForm(false);
    }
    function incQuantity() {
        setQuantity(prev => prev + 1);
    }
    function decQuantity() {
        setQuantity(prev => prev - 1);
    }
    
  return (
    <div className="product__modal--overlay">
        <aside className='product__modal' key={product._id}>
            <AiOutlineClose className="product--close-icon" onClick={handleCloseModal} />
            { showGiftingForm ? <GiftingForm handleHideForm={handleHideForm} handleCloseModal={handleCloseModal} /> : (
                <div className="product--container">
                    <span className='product--image-box'>
                        <img src={currImage} alt={currImage} className="product--img" />
                        <span className='sub-images'>
                            <img src={product.image} alt={product.image} onClick={() => setCurrImage(product.image)} />
                            <img src={giftaLogo} alt={giftaLogo} onClick={() => setCurrImage(giftaLogo)} />
                            <img src={product.image} alt={product.image} onClick={() => setCurrImage(product.image)} />
                            <img src={giftaLogo} alt={giftaLogo} onClick={() => setCurrImage(giftaLogo)} />
                        </span>
                    </span>

                    <div className="product--info">
                        <h4 className="product--title">{product.name}</h4>

                        <p className="product--text">{product.description}</p>

                        <div className="product--vendor">
                            <div className="vendor--main">
                                <img src={product.vendor.image} alt={product.vendor.fullName} />
                                <div>
                                    <p>{product.vendor.fullName}</p>
                                    <p>{product.vendor.email}</p>
                                </div>
                            </div>

                            <p id='location'>{product.vendor.location || 'Lagos Nigeria'}</p>
                        </div>

                        <span className="product--actions">
                            <span className="product--total">
                                <span className="product--price">
                                    <span>Price:</span>
                                    <p>₦{numberConverter(product.price)}</p>
                                </span>

                                <span className="product--quantity">

                                </span>

                            </span>

                            <button className="product--btn" onClick={handleShowForm}>Gift now</button>
                        </span>
                    </div>
                </div>
            )}
        </aside>
    </div>
  )
}

export default Product;