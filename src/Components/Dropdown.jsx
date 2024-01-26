import React, { useState } from 'react';

import { CiHome, CiLogout, CiSaveUp2, CiUser, CiViewList } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../Auth/context/AuthContext';
import { IoIosQrScanner } from "react-icons/io";


function Dropdown({ addHomeLink }) {
    const { logout } = useAuthContext();
    const navigate = useNavigate()

    function handleLogout() {
        logout();

        setTimeout(() => {
            // window.location.href = '/login'
            window.location.assign('/login')
        }, 350)
    }

    return (
        <div className='dropdown--figure'>
            <ul>
                {addHomeLink && (
                    <li onClick={() => navigate('/dashboard')}>
                        <CiHome />
                        <p>Home</p>
                    </li>
                )}
                <li onClick={() => navigate('/account-profile')}>
                    <CiUser />
                    <p>Account</p>
                </li>
                <li onClick={() => navigate('/plans')}>
                    <CiSaveUp2 />
                    <p>Plan</p>
                </li>
                <li onClick={() => navigate('/privacy-policy')}>
                    <CiViewList />
                    <p>Privacy Policy</p>
                </li>
                <li onClick={() => navigate('/terms-of-use')}>
                    <IoIosQrScanner />
                    <p>Terms of Use</p>
                </li>
                <li onClick={handleLogout}>
                    <CiLogout />
                    <p>Logout</p>
                </li>
            </ul>
        </div>
    )
}

export default Dropdown
