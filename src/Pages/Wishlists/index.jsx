import React from "react";
import DashHeader from "../DashBoard/DashboardComponents/DashHeader";
import DashTabs from "../DashBoard/DashboardComponents/DashTabs";

import WishlistImg from "../../Assets/images/3d-plastilina-adding-bookmark-symbol.png";
import { BsBookmarkCheck } from "react-icons/bs";
import { useState } from "react";
import DashboardModal from "../../Components/Modal";
import WishlistForm from "./WishlistsComponents/WishlistForm";
import { useEffect } from "react";
import Spinner from "../../Components/Spinner";

const customStyle = {
	minHeight: "auto",
	maxWidth: "45rem",
	width: "45rem",
};

function Wishlists() {
	const [showDashboardModal, setShowDashboardModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	function handleModal() {
		setShowDashboardModal(true);
	}

	useEffect(() => {
		async function fetchWishlists() {
			try {
				setIsLoading(true)


			} catch(err) {
				console.log(err.message);
			} finally {
				setIsLoading(false)
			}
		}
		fetchWishlists();
	}, []);

	return (
		<>
			<DashHeader />
			<DashTabs />

			<section className="wishlist__section section">
				<div className="section__container">
					{ isLoading ? <Spinner /> : (
						<div className="wishlist--banner banner">
							<h3 className="section__heading">
								Make yourself a wishlist and
								<span style={{ color: "#bb0505" }}>
									{' '}share with friends <BsBookmarkCheck />
								</span>
							</h3>

							<img src={WishlistImg} alt={WishlistImg} />
							<button type="button" onClick={handleModal}>
								Create Wishlist
							</button>
						</div>
					)}
				</div>
			</section>

			{showDashboardModal && (
				<DashboardModal
					title={'Create your Wishlist'}
					customStyle={customStyle}
					setShowDashboardModal={setShowDashboardModal}
				>
					<WishlistForm setShowDashboardModal={setShowDashboardModal} />
				</DashboardModal>
			)}
		</>
	);
}

export default Wishlists;
