import React, { useState } from 'react';

import { CiLogout, CiUser, CiViewList } from "react-icons/ci";
import { Link } from 'react-router-dom';
import { useAuthContext } from '../Auth/context/AuthContext';


function Dropdown() {
    const [isLoading, setIsLoading] = useState(false);
    const { logout } = useAuthContext();

  function handleLogout () {
        setIsLoading(true);
		logout();

		// logging out
		setTimeout(() => {
            setIsLoading(false);
            window.location.href = '/'
		}, 500)
	}

  return (
    <div className='dropdown--figure'>
        <ul>
            <li onClick={'/dashboard/profile'}>
                <CiUser />
                <p>Account</p>
            </li>
            <li onClick={'/dashboard/plans'}>
                <CiViewList />
                <p>Plan</p>
            </li>
            <li>
                <CiLogout />
                <p onClick={handleLogout}>Logout</p>
            </li>
        </ul>
    </div>
  )
}

export default Dropdown
