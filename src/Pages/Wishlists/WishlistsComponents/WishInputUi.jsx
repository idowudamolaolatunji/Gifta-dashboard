import React, { useEffect, useRef, useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { TbMoneybag } from 'react-icons/tb';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { formatDate } from '../../../utils/helper';
import { useAuthContext } from '../../../Auth/context/AuthContext';
import Alert from '../../../Components/Alert';
import GiftLoader from '../../../Assets/images/gifta-loader.gif';
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';

function WishInputUi({ wishListId, wishDetails, type, setHelpReset }) {
    const [wish, setWish] = useState(wishDetails ? wishDetails.wish : '');
    const [description, setDescription] = useState(wishDetails ? wishDetails.description : '');
    const [date, setDate] = useState(wishDetails ? formatDate(wishDetails.deadLineDate) : '')
    const [amount , setAmount] = useState(wishDetails ? wishDetails.amount : '');
    const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState("");
    const [inValid, setInValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [focus, setFocus] = useState(false);

    const inputRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();
    const { user, token } = useAuthContext();
    const { wishListSlug } = useParams();

    function handleNavigation() {
        if(location.pathname.includes('/wish/edit')) {
            navigate(-1)
        } else {
            navigate(`/dashboard/wishlists/${wishListSlug}`)
        }
    }

    function handleReset() {
		setIsError(false);
		setIsSuccess(false);
		setMessage("");
	}

	function handleError(mess) {
		setIsError(true);
		setMessage(mess);
		setTimeout(() => {
			setIsError(false);
			setMessage("");
		}, 2500);
	}


    async function handleWishInput(e) {
        e.preventDefault();
        let url, method;
        try {
            if (!wish || !description || !date || !amount) {
                setInValid(true);
                setTimeout(function() {
                    setInValid(false);
                }, 1500);
                throw new Error('All fields must be filled!');
            }
            setIsLoading(true);
            handleReset();
            if(type === 'new') {
                method = 'POST';
                url = 'http://localhost:3010/api/wishlists/create-wish';
            } else {
                method = "PATCH";
                url = 'http://localhost:3010/api/wishlists/update-wish';
            }

            console.log(amount)
            const res = await fetch(`${url}/${wishListId}`, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ wish, description, deadLineDate: date, amount: type === 'new' ? formattedAmount(amount) : amount}),
            });

            console.log(res);
            if(!res.ok) throw new Error('Something went wrong!');

            const data = await res.json();
            if(data.status !== 'success') {
                throw new Error(data.message);
            }
            setMessage(data.message);
			setIsSuccess(true);
			setTimeout(() => {
				setIsSuccess(false);
				setMessage("");
			}, 1500);
            navigate(`/dashboard/wishlists/${wishListSlug}`);
            setHelpReset(true);
        } catch(err) {
            handleError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    function handleInputFocus() {
        setFocus(!focus)
    }
    
    useEffect(function() {
        if(focus) {
            inputRef.current.focus();
        }
        if(!inputRef.current.focus()) {
            setFocus(false)
        }
    }, [focus])

  return (
    <>
        <div className='wish--overlay' onClick={handleNavigation} />
        {isLoading && (
            <div className='gifting--loader'>
                <img src={GiftLoader} alt='loader' />
            </div>
        )}
        <form className={`wish--form wish--modal ${inValid ? 'form--focus' : ''}`} onSubmit={handleWishInput}>
            <input type="text" className='wish--input' placeholder='Write a wish here' value={wish} onChange={(e) => setWish(e.target.value)} />
            <textarea className='wish--textarea' placeholder='A bit of description' value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="form--grid">
                <span>
                    <input type="date" className='wish--input input--date' placeholder='Deadline Date...' value={date} onChange={(e) => setDate(e.target.value)}/>
                    <span className='wish--input-flex'>
                        <CurrencyInput 
                            className='wish--input input--number'
                            decimalsLimit={0}
                            prefix='₦ '
                            placeholder='Wish Amount'
                            defaultValue={amount}
                            onValueChange={(value, _) => setAmount(value)}
                            ref={inputRef}
                        />
                        <TbMoneybag className='wish--input-icon' onClick={handleInputFocus} />
                    </span>
                </span>
                <span>
                    <button type="button" className='wish--button btn--cancel' onClick={handleNavigation}>Cancel</button>
                    <button type="submit" className='wish--button btn--submit'>Submit</button>
                </span>
            </div>
        </form>

        {(isSuccess || isError) && (
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

export default WishInputUi;
