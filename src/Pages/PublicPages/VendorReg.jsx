import React, { useState } from 'react'
import Header from './Components/Header';
import GiftLoader from '../../Assets/images/gifta-loader.gif';
import { useNavigate } from 'react-router-dom';

function VendorReg() {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    return (
        <>
            {isLoading && (
                <div className='gifting--loader'>
                    <img src={GiftLoader} alt='loader' />
                </div>
            )}

            <Header />
            <section className="section account__section">
                <div className="section__container">
                    <span onClick={() => navigate(-1)} className='wishlist--back-btn'>Back</span>
                    
                    <h3 className="settings--heading">Become a Vendor</h3>

                    <form className='vendor-reg__form'>
                        <div className="form--item">
                            <label htmlFor="email" className="form--label">Confirm Email</label>
                            <input type="email" id="email" className="form--input" placeholder='Email address' />
                        </div>
                        <div className="form--item">
                            <label htmlFor="password" className="form--label">Confirm Password</label>
                            <input type="password" id="password" className="form--input" placeholder='●●●●●●●●●' />
                        </div>
                        <div className="form--item">
                            <button type="submit" className="form--btn" style={{ width: '100%' }}>Submit Request</button>
                        </div>
                    </form>
                </div>
            </section>

        </>
    )
}

export default VendorReg
