import React, { useState } from 'react';
import CurrencyInput from 'react-currency-input-field';
import { TbMoneybag } from 'react-icons/tb';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { formatDate } from '../../../utils/helper';

function WishInputUi({ wishDetails }) {
    const [wish, setWish] = useState(wishDetails ? wishDetails.wish : '');
    const [description, setDescription] = useState(wishDetails ? wishDetails.description : '');
    const [date, setDate] = useState(wishDetails ? formatDate(wishDetails.deadLineDate) : '')
    const [amount , setAmount] = useState(wishDetails ? wishDetails.amount : '');

    const navigate = useNavigate();
    const location = useLocation();
    const { wishListSlug } = useParams();

    function handleNavigation() {
        if(location.pathname.includes('/wish/edit')) {
            navigate(-1)
        } else {
            navigate(`/dashboard/wishlists/${wishListSlug}`)
        }
    }

  return (
    <>
        <div className='wish--overlay' onClick={handleNavigation} />
        <form className='wish--form wish--modal'>
            <input type="text" className='wish--input' placeholder='Write a wish here' value={wish} onChange={(e) => setWish(e.target.value)} />
            <textarea className='wish--textarea' placeholder='A bit of description' value={description} onChange={(e) => setDescription(e.target.value)} />
            <div className="form--grid">
                <span>
                    <input type="date" className='wish--input input--date' value={date} onChange={(e) => setDate(e.target.value)}/>
                    <span className='wish--input-flex'>
                        <CurrencyInput 
                            className='wish--input input--number'
                            decimalsLimit={0}
                            prefix='₦'
                            placeholder='Wish Amount'
                            defaultValue={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        {!amount ? (
                                <TbMoneybag className='wish--input-icon'/>
                            ) : ''
                        }
                    </span>
                </span>
                <span>
                    <button type="button" className='wish--button btn--cancel' onClick={handleNavigation}>Cancel</button>
                    <button type="submit" className='wish--button btn--submit'>Submit</button>
                </span>
            </div>
        </form>
    </>
  )
}

export default WishInputUi
