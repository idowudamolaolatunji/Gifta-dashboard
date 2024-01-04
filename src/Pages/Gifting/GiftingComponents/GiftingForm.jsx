import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { MdKeyboardBackspace, MdOutlineAddAPhoto } from "react-icons/md";
import { useAuthContext } from '../../../Auth/context/AuthContext';
import { calcTotalAmount, numberConverter } from '../../../utils/helper';
import { PaystackButton } from 'react-paystack';
import Alert from '../../../Components/Alert';
import Spinner from '../../../Components/Spinner';
import GiftLoader from '../../../Assets/images/gifta-loader.gif';
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';


function GiftingForm({ handleHideForm, handleCloseModal }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const [wallet, setWallet] = useState(null);
    ////////////////////////////////////////////////////////////
    const [celebrant, setCelebrant] = useState('')
    const [description, setDescription] = useState('')
    const [address, setAddress] = useState('')
    const [country, setCountry] = useState('Nigeria')
    const [state, setState] = useState('')
    const [cityRegion, setCityRegion] = useState('LGA')
    const [date, setDate] = useState('')
    const [cardPay, setCardPay] = useState(false);
    const [walletPay, setWalletPay] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    ////////////////////////////////////////////////////////////
    const { user, token } = useAuthContext();
    const productInfo = Cookies.get('productInfo') ? JSON.parse(Cookies.get('productInfo')) : null;
    const publicKey = 'pk_test_ec63f7d3f340612917fa775bde47924bb4a90af7';
    const totalAmount = calcTotalAmount(Number(productInfo.totalPrice));
    const charges = totalAmount - productInfo.totalPrice;
    const amountInKobo = totalAmount * 100;
    const timeout = 2000;
    /////////////////////////////////////////////////////////////


    const componentProps = {
        email: user?.email,
        amount: amountInKobo,
        metadata: {
            name: user?.fullName,
        },
        text: 'Pay & Save Gifting',
        publicKey,
        onSuccess: ({ reference }) => handlePaystackPayment(reference),
        onClose: handleFailure,
    };


    function validate() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate());

        const fieldsAreFilled =
          celebrant !== "" &&
          description !== "" &&
          address !== "" &&
          country !== "" &&
          state !== "" &&
          cityRegion !== "" &&
          date !== "" && 
          new Date(date) >= tomorrow;
      
        const onePaymentMethod = (walletPay && !cardPay) || (!walletPay && cardPay);
      
        return fieldsAreFilled && onePaymentMethod;
    }
    const validations = validate();
    console.log(validations)

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
    
    // IMAGE PREVIEW FUNCTION
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file)
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
        }
    };

    // EFFECT FUNCTION THAT FETCHES THE USER WALLET
    useEffect(function() {
        async function getWallet() {
            try {
                const res = await fetch('https://test.tajify.com/api/wallet', {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                if(!res.ok) throw new Error('Something went wrong!');
                const data = await res.json();
                setWallet(data.data.wallet);
            } catch(err) {
                console.log(err);
            }
        }
        getWallet();
    }, []);


    // MAKE PAYMENT FROM CARD / PAYSTATCK
    async function handlePaystackPayment(reference) {
        try {
            handleReset();
            setIsLoading()
            const res = await fetch(`https://test.tajify.com/api/giftings/payment-verification/${reference}/${charges}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ productId: productInfo.id }),
            });
            if(!res.ok) throw new Error('Something Went Wrong!');
            const data = await res.json();
            console.log(data)

            if(data.status !== 'success') {
                throw new Error(data.message);
            }
            setIsSuccess(true);
            setMessage(data.message)
            setTimeout(async function() {
                setIsSuccess(false);
                setMessage();
                handleFormSubmit();
            }, 1500);
        } catch(err) {
            handleFailure(err.message)
        } finally {
            setIsLoading(false)
        }
    }


    // MAKE PAYMENT FROM WALLET BALANCE
    async function handleWalletPayment() {
        try {
            if(!walletPay) return;
            handleReset();
            setIsLoading(true);
            if(wallet.walletBalance < productInfo.totalPrice) throw new Error('InSufficient funds, Why with card Instead');

            const res = await fetch('https://test.tajify.com/api/giftings/payment-wallet/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ amount: productInfo.totalPrice, productId: productInfo.id }),
            });

            if(!res.ok) throw new Error('Something went wrong!');

            const data = await res.json();
            console.log(data);
            if(data.status !== 'success') {
                throw new Error(data.message)
            }
            setIsSuccess(true);
            setMessage(data.message)
            setTimeout(async function() {
                setIsSuccess(false);
                setMessage();
                handleFormSubmit();
            }, 1500);
        } catch(err) {
            handleFailure(err.message);
        } finally {
            setIsLoading(false);
        }
    }


    // FUNCTION THAT HANDLES THE SUBMITTING OF THE GIFTING PACKAGE
    async function handleFormSubmit() {
        try {
            handleReset();
            setIsLoading(true);

            const res = await fetch('http://localhost:3010/api/giftings/create-gifting/', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ productId: productInfo.id, celebrant, purpose: productInfo.purpose, description, amount: productInfo.totalPrice, country, state, cityRegion, address, date }),
            });
            console.log(res)
            if(!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            console.log(data)

            if(data.status !== 'success') {
                throw new Error(data.message);
            }

            // IMAGE UPLOAD
            const formData = new FormData();
            const id = data.data.gifting._id
            console.log(id);
            handleUploadImg(formData, id);

            setIsSuccess(true);
            setMessage(data.message)
            setTimeout(() => {
                setIsSuccess(false);
                setMessage('');
                setIsLoading(false);
                handleCloseModal();
            }, 2500);
        } catch(err) {
            handleFailure(err.message)
            setIsLoading(false);
        }
    }


    async function handleUploadImg(formData, id) {
        try {
            formData.append('image', imageFile);
            const res = await fetch(`http://localhost:3010/api/giftings/gifting-img/${id}`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    // Authorization: `Bearer ${token}`
                },
                body: formData,
                mode: "no-cors"
            });
            if(!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            console.log(data)
            
        } catch(err) {
            handleFailure(err.message);
        }
    }


    // FUNCTION THAT MAKES THE DECISION BASED ON WHAT TO DO!
    function handleForm(e) {
        e.preventDefault();
        if(walletPay) {
            handleWalletPayment();
            return;
        }
    }
   

  return (
    <>
        <form className='gifting--form form' onSubmit={handleForm}>

            {isLoading && 
            <div className='gifting--loader'>
                <img src={GiftLoader} alt='loader' />
            </div>}

            <MdKeyboardBackspace className='form--icon' onClick={handleHideForm} />
            <h4 className="form--heading">Upload Celebrant Details</h4>
            <div className="form__flex-main">

                <div className="form__flex-col">
                    <div className='form--item form-image-card'>
                        {!imagePreview && <p className='image-text'>Celebrant Image (Required)</p>}
                        <input type='file' id='form-image-input' name='image' onChange={handleImageChange} accept="image/*" />
                        <label htmlFor='form-image-input' className={`${imagePreview ? 'hoverable' : ''}`} id='form-image-label'>
                            <span>
                                <MdOutlineAddAPhoto />
                                <p>Add Celebrant Image</p>
                            </span>
                            {imagePreview && <img id='form-image' src={imagePreview} alt='Wishlist Preview' />}
                        </label>
                    </div>

                    <div className='form__item'>
                        <label htmlFor="" className="form__label">Address</label>
                        <textarea type="text" value={address} id='address' className="form__textarea" placeholder='Enter Celebrant Address' onChange={(e) => setAddress(e.target.value)}></textarea>
                    </div>
                </div>


                <div className="form__flex-col">
                    <div className='form__item'>
                        <label htmlFor="" className="form__label">Celebrant Fullname</label>
                        <input type="text" value={celebrant} placeholder='Name of Celebrant' className="form__input" onChange={(e) => setCelebrant(e.target.value)} />
                    </div>
                    <div className='form__item'>
                        <label htmlFor="description" className="form__label">Description (for gifting)</label>
                        <textarea type="text" id='description' value={description} placeholder='Description for Celebrant' className="form__textarea" onChange={(e) => setDescription(e.target.value)}></textarea>
                    </div>
                </div>
            </div>

            <div className="form__flex-row">
                
                <div className='form__item'>
                    <label htmlFor="country" className="form__label">Country</label>
                    <select type="text" id='country' value={country} className="form__select" onChange={(e) => setCountry(e.target.value)}>
                        <option value="Nigeria" selected>Nigeria</option>
                    </select>
                </div>
                <div className='form__item'>
                    <label htmlFor="state" className="form__label">State</label>
                    <select type="text" id="state" value={state} className="form__select" onChange={(e) => setState(e.target.value)}>
                        <option selected="selected">- Select a State -</option>
                        <option value="Abuja">Abuja FCT</option>
                        <option value="Abia">Abia</option>
                        <option value="Adamawa">Adamawa</option>
                        <option value="Akwa-Ibom">Akwa Ibom</option>
                        <option value="Anambra">Anambra</option>
                        <option value="Bauchi">Bauchi</option>
                        <option value="Bayelsa">Bayelsa</option>
                        <option value="Benue">Benue</option>
                        <option value="Borno">Borno</option>
                        <option value="Cross-River">Cross River</option>
                        <option value="Delta">Delta</option>
                        <option value="Ebonyi">Ebonyi</option>
                        <option value="Edo">Edo</option>
                        <option value="Ekiti">Ekiti</option>
                        <option value="Enugu">Enugu</option>
                        <option value="Gombe">Gombe</option>
                        <option value="Imo">Imo</option>
                        <option value="Jigawa">Jigawa</option>
                        <option value="Kaduna">Kaduna</option>
                        <option value="Kano">Kano</option>
                        <option value="Katsina">Katsina</option>
                        <option value="Kebbi">Kebbi</option>
                        <option value="Kogi">Kogi</option>
                        <option value="Kwara">Kwara</option>
                        <option value="Lagos">Lagos</option>
                        <option value="Nassarawa">Nassarawa</option>
                        <option value="Niger">Niger</option>
                        <option value="Ogun">Ogun</option>
                        <option value="Ondo">Ondo</option>
                        <option value="Osun">Osun</option>
                        <option value="Oyo">Oyo</option>
                        <option value="Plateau">Plateau</option>
                        <option value="Rivers">Rivers</option>
                        <option value="Sokoto">Sokoto</option>
                        <option value="Taraba">Taraba</option>
                        <option value="Yobe">Yobe</option>
                        <option value="Zamfara">Zamfara</option>
                    </select>
                </div>
                <div className='form__item'>
                    <label htmlFor="region" className="form__label">City / Region</label>
                    <select type="text" id='region' value={cityRegion} className="form__select" onChange={(e) => setCityRegion(e.target.value)}>
                    
                        <option value="" selected="selected">- Select a Region -</option>
                    </select>
                </div>
            </div>

            <div className="form__inline">
                <div className='form__item form__item-date'>
                    <label htmlFor="date" className="form__label">Date of Delivery</label>
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        <input id='date' value={date} type="date" className='form__date' onChange={(e) => setDate(e.target.value)} />
                        <span class="validity"></span>
                    </span>
                </div>
                <div id='form--balance'>
                    <div className="form__item">
                        <label htmlFor="checkbox-1" className="form__label">Pay With Wallet</label>
                        <input type="checkbox" id='checkbox-1' className='form__check' checked={walletPay} onChange={(e) => { setWalletPay(e.target.checked); setCardPay(false); }} />
                    </div>
                    
                    <p style={{ display: 'flex', alignItems: 'center', fontSize: '1rem', gap: '.4rem' }}>
                        {(walletPay && wallet) &&
                            <>
                                <span style={{ fontWeight: '600', color: '#777' }}>
                                    Balance:
                                </span>
                                <p>₦{numberConverter(wallet.walletBalance)}</p>
                            </> 
                        }
                    </p>

                </div>
                <div className='form__item'>
                    <label htmlFor="checkbox-2" className="form__label">Pay With Card</label>
                    <input type="checkbox" id='checkbox-2' className='form__check' checked={cardPay} onChange={(e) => { setCardPay(e.target.checked); setWalletPay(false); }} />
                </div>
            </div>
            

            <div className="form__item">
                {!validations && <button type="submit" className="form__submit btn" disabled style={{ cursor: 'not-allowed', opacity:'0.5' }}>Pay & Save Gifting</button>}


                {(validations && cardPay) && (<PaystackButton className="form__submit btn" {...componentProps} />)} 


                {(validations && walletPay) && <button type="submit" className="form__submit btn" >Pay & Save Gifting</button>}
            </div>
        </form>


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
        
    </>
  )
}

export default GiftingForm;
