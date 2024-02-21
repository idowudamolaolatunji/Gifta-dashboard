import React from 'react'

import { numberConverter } from '../../../utils/helper';
import { AiOutlineClose } from 'react-icons/ai';
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useState } from 'react';
import GiftingForm from '../../Gifting/GiftingComponents/GiftingForm';

import giftaLogo from "../../../Assets/gifta-logo.png";
import Cookies from 'js-cookie';


function Product({ product, handleCloseModal }) {
    const [showGiftingForm, setShowGiftingForm] = useState('');
    const [currImage, setCurrImage] = useState(`https://test.tajify.com/asset/products/${product.image}`);
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
        if(quantity < 5) {
            setQuantity(prev => prev + 1);
        }
    }
    function decQuantity() {
        if(quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    }
    
  return (
    <>
    <div className="product__modal--overlay" />
        <aside className='product__modal' key={product._id}>
            <span className="product--close-icon" onClick={handleCloseModal}><AiOutlineClose className='close--icon' /></span>
            { showGiftingForm ? <GiftingForm handleHideForm={handleHideForm} handleCloseModal={handleCloseModal} /> : (
                <div className="product--container">
                    <span className='product--image-box'>
                        <img src={currImage} alt={currImage} className="product--img" />
                    </span>

                    <div className="product--info">
                        <h4 className="product--title">{product.name}</h4>

                        <p className="product--text">{product.description}</p>

                        <div className="product--vendor">
                            <div className="vendor--main">
                                <img className='' src={product.vendor?.image === "" ? 'https://res.cloudinary.com/dy3bwvkeb/image/upload/v1701957741/avatar_unr3vb-removebg-preview_rhocki.png' : `https://test.tajify.com/asset/users/${product.vendor?.image}`} alt={product.vendor.fullName} />
                                {/* <img src={product.vendor.image} alt={product.vendor.fullName} /> */}
                                <div>
                                    <p>{product.vendor.fullName}</p>
                                    <p className='product-vendor--email'>{product.vendor.email}</p>
                                </div>
                            </div>

                            <p id='location'>{product.vendor.location || 'Lagos Nigeria'}</p>
                        </div>

                        <span className="product--actions">
                            <span className="product--total">
                                <span className="product--price">
                                    <span>Price:</span>
                                    <p>₦{numberConverter(amount)}</p>
                                </span>

                                <span className="product--quantity">
                                    <span onClick={decQuantity}><FaMinus /></span>
                                    <p>{quantity}</p>
                                    <span onClick={incQuantity}><FaPlus /></span>
                                </span>
                            </span>

                            <button className="product--btn" onClick={handleShowForm}>Gift now</button>
                        </span>
                    </div>
                </div>
            )}
        </aside>
    </>
  )
}

export default Product;
