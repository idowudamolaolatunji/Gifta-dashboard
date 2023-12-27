import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BsBell } from "react-icons/bs";
import { BsJournalBookmark } from "react-icons/bs";
import { TfiGift } from "react-icons/tfi";
import { BsShop } from "react-icons/bs";
import { LuLayoutDashboard } from "react-icons/lu";

import { useAuthContext } from "../../../Auth/context/AuthContext";

const DashTabs = () => {
	let location = useLocation();
	const { user } = useAuthContext();

	console.log(location.pathname)
	console.log(location.pathname.includes('/dashboard/marketplace'))

	return (
		<section>
			<div className="section__container">
				<div className="dashboard__tabs">
					<Link to="/dashboard" className={`tab ${location.pathname === '/dashboard' ? 'active-tab' : ''}`}>
						<LuLayoutDashboard className="tab-icon" />
						{/* <p>Dashboard</p> */}
					</Link>

					<Link to="/dashboard/gifting" className={`tab ${location.pathname.includes('/dashboard/gifting') ? 'active-tab' : ''}`}>
						<TfiGift className="tab-icon" />
						<p>Gifting</p>
					</Link>

					<Link to="/dashboard/reminders" className={`tab ${location.pathname.includes('/dashboard/reminders') ? 'active-tab' : ''}`}>
						<BsBell className="tab-icon" />
						<p>Reminders</p>
					</Link>

					<Link to="/dashboard/wishlists" className={`tab ${location.pathname.includes('/dashboard/wishlists') ? 'active-tab' : ''}`}>
						<BsJournalBookmark className="tab-icon" />
						<p>Wishlists</p>
					</Link>

					<Link to="/dashboard/marketplace/birthday" className={`tab ${location.pathname.includes('/dashboard/marketplace') ? 'active-tab' : ''}`}>
						<BsShop className="tab-icon" />
						<p>MarketPlace</p>
					</Link>
				</div>
			</div>
		</section>
	);
};

export default DashTabs;
