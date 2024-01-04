import React from 'react';

import { CiLogout, CiUser, CiViewList } from "react-icons/ci";
import { Link } from 'react-router-dom';


function Dropdown() {
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
                <p>Logout</p>
            </li>
        </ul>
    </div>
  )
}

export default Dropdown
