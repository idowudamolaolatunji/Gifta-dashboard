import React, { useState } from "react";
import { Link } from "react-router-dom";
import GiftLogo from "../../../Assets/gifta-logo.png";
import { useAuthContext } from "../../../Auth/context/AuthContext";

// import '../../DashBoard/main.css';
import { LuMoon, LuSun } from "react-icons/lu";
import { IoSettingsOutline, IoWalletOutline } from "react-icons/io5";
import Dropdown from "../../../Components/Dropdown";
import { MdKeyboardArrowDown } from "react-icons/md";
import { getInitials } from "../../../utils/helper";


function Header() {
    const [mode, setMode] = useState(false);
	const [showDropdown, setShowDropdown] = useState(false);
    const { user, token } = useAuthContext();


  return (
    <header className="dashboard__header" style={{ marginBottom: '7.2rem' }}>
            <div className='main-header sticky'>
                <a href='https://getgifta.com/'>
                    <img src={GiftLogo} alt="logo" className="dashboard__logo" />
                </a>

                <div className="dashboard__details">
                    <div className="dashboard__others">
                        {/* <span className="dashboard--mode">
                            {mode === 'light' ?
                                (<LuMoon onClick={() => setMode('dark')} />)
                                :
                                (<LuSun onClick={() => setMode('light')} />)
                            }
                        </span> */}
                        {(user && token) && (
                            <>
                                <Link to="/settings">
                                    <span className="dashboard__icon-box">
                                        <IoSettingsOutline className="dashboard__icon" />
                                    </span>
                                </Link>

                                <Link to="/wallet">
                                    <span className="dashboard__icon-box">
                                        <IoWalletOutline className="dashboard__icon" />
                                    </span>
                                </Link>
                            </>
                        )}
                    </div>
                    {(token && user) ? (
                        <div className="dashboard__user-profile" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
                            {showDropdown && <Dropdown />}

                            {(user?.image !== "") ? (
							<img
								alt={user?.fullName + " 's image"}
								src={`https://test.tajify.com/asset/users/${user?.image}`}
								className='profile__img'
							/> 
                            ) : (
                                <span className="profile__img-initials">
                                    {getInitials(user?.fullName || user.username)}
                                </span>
                            )}

                            <span className="profile__user">
                                <p className="user-username" >{user?.fullName || user?.username}</p>

                                <p className="user-email">{user?.email}</p>
                            </span>

                            <span>
                                <MdKeyboardArrowDown />
                            </span>
                        </div>
                    ) : (
                        <div className="dashboard__auth-buttons">
                            <Link to={'/login'}>
                                <span className="dashboard--login-btn">Login</span>
                            </Link>
                            <Link to={'/signup'}>
                                <span className="dashboard--signup-btn">Signup</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
  )
}

export default Header
