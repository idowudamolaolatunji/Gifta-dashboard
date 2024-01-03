import GiftLogo from "../../../Assets/gifta-logo.png";
import { Link } from "react-router-dom";
import { useAuthContext } from "../../../Auth/context/AuthContext";

import { IoSettingsOutline, IoSearchOutline, IoWalletOutline } from "react-icons/io5";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useEffect, useState } from "react";


const DashHeader = ({ isDasboard }) => {
	const [show, setShow] = useState(false);
	const { user } = useAuthContext();

	useEffect(function() {
		function controlNavbar() {
			if (window.scrollY > 150 ) {
				setShow(true)
			} else{
				setShow(false)
			}
		}
		window.addEventListener('scroll', controlNavbar)
		controlNavbar()
		return () => {
			window.removeEventListener('scroll', controlNavbar)
		}
	}, [])

	return (
		<header className="dashboard__header">
			<div className={`main-header ${show ? 'sticky' : ''}`}>
				<Link to='/'>
					<img src={GiftLogo} alt="logo" className="dashboard__logo" />
				</Link>

				<div className="dashboard__details">
					<div className="dashboard__others">
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

					<div className="dashboard__user-profile">
						<img
							alt="Profile Picture"
							src={user?.image}
							className="profile__img"
						/>

						<span className="profile__user">
							<p className="user-username" >{user.fullName || user.username}</p>

							<p className="user-email">{user.email}</p>
						</span>

						<span>
							<MdKeyboardArrowDown />
						</span>
					</div>
				</div>
			</div>

			<section className="hero__section">
				<div className="section__container">
					<div className="header__box">
						<h1>Welcome Back, {user.fullName.split(" ")[0]}!</h1>

						<p>What will you do on Gifta today?</p>
					</div>

					{isDasboard && <div className="input-box">
						<input className="header__input" id="search" type="search" placeholder="Search Gifta..." />

						<IoSearchOutline className="header__icon" />
					</div>}
				</div>
			</section>
		</header>
	);
};

export default DashHeader;
