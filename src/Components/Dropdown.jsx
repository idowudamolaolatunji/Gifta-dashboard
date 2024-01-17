import React, { useState } from 'react';

import { CiLogout, CiUser, CiViewList } from "react-icons/ci";
import { Link } from 'react-router-dom';
import { useAuthContext } from '../Auth/context/AuthContext';


function Dropdown() {
    const { logout } = useAuthContext();

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
                {/* <li onClick={'/dashboard/profile'}>
                    <CiUser />
                    <p>Account</p>
                </li> */}
                <li onClick={'/dashboard/plans'}>
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
