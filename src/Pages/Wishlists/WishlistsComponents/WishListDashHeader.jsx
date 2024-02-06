import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GiftLogo from "../../../Assets/gifta-logo.png";
import { useAuthContext } from "../../../Auth/context/AuthContext";

import { IoNotifications, IoSettingsOutline, IoWalletOutline } from "react-icons/io5";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import Dropdown from "../../../Components/Dropdown";
import { LuSun, LuMoon, LuLayoutDashboard } from "react-icons/lu";
import { TfiGift } from "react-icons/tfi";
import { BsBell, BsJournalBookmark, BsShop } from "react-icons/bs";
import { getInitials } from "../../../utils/helper";
import NotificationBox from "../../../Components/NotificationBox";

// import '../../DashBoard/main.css';


function WishListDashHeader() {
	const [showDropdown, setShowDropdown] = useState(false);
	// const [mode, setMode] = useState('light');
	const [showNotificationBox, setShowNotificationBox] = useState(false);
	const { user, notificationCount  } = useAuthContext();

	return (
        <>
		<header className="dashboard__header" style={{ marginBottom: '12rem'}}>
			<div className='main-header sticky'>
				<Link to='/'>
					<img src={GiftLogo} alt="logo" className="dashboard__logo" />
				</Link>

				<div className="dashboard__details">
					<div className="dashboard__others">
						{/* <span className="dashboard--mode">
							{mode === 'light' ? 
								(<LuMoon onClick={() => setMode('dark')} />)
							: 
								(<LuSun onClick={() => setMode('light')} />)
							}
						</span> */}

						<span className="dashboard__icon-box" style={{ cursor: 'pointer' }} onClick={() => setShowNotificationBox(!showNotificationBox)}>
							<IoNotifications className="dashboard__icon" style={{ fontSize: '2.8rem' }} />
							{notificationCount > 0 && (<span>{notificationCount}</span>)}
						</span>
						{showNotificationBox && (
							<NotificationBox showNotificationBox={showNotificationBox} setShowNotificationBox={setShowNotificationBox} />
						)}

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
					</div>

					<div className="dashboard__user-profile" onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)} onClick={() => setShowDropdown(!showDropdown)} >
						{showDropdown && <Dropdown />}

						{(user?.image !== "") ? (
							<img
								alt={user?.fullName + "'s image"}
								src={`https://test.tajify.com/asset/users/${user?.image}`}
								className='profile__img'
							/> 
						) : (
							<span className="profile__img-initials">
								{getInitials(user?.fullName || user.username)}
							</span>
						)}

						<span className="profile__user">
							<p className="user-username" >{user.fullName || user.username}</p>
							<p className="user-email">{user.email}</p>
						</span>

						<span>
							{!showDropdown && <MdKeyboardArrowDown />}
							{showDropdown && <MdKeyboardArrowUp/>}
						</span>
					</div>
				</div>
			</div>
		</header>

        <section className='section--tab'>
			<div className="section__container">
				<div className="dashboard__tabs">
					<Link className="tab" to="/dashboard">
						<LuLayoutDashboard className="tab-icon" />
					</Link>

					<Link className="tab" to="/dashboard/gifting">
						<TfiGift className="tab-icon" />
						<p>Gifting</p>
					</Link>

					<Link className="tab" to="/dashboard/reminders">
						<BsBell className="tab-icon" />
						<p>Reminders</p>
					</Link>

					<Link className="tab active-tab" to="/dashboard/wishlists">
						<BsJournalBookmark className="tab-icon" />
						<p>Wishlists</p>
					</Link>

					<Link className="tab" to="/dashboard/marketplace/birthday">
						<BsShop className="tab-icon" />
						<p>MarketPlace</p>
					</Link>
				</div>
			</div>
		</section>

        </>
	);
};

export default WishListDashHeader;
