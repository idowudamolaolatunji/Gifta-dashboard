import React, { useState } from 'react';

import { CiHome, CiLogout, CiUser, CiViewList } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../Auth/context/AuthContext';


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
                <li onClick={'/plans'}>
                    <CiViewList />
                    <p>Plan</p>
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
