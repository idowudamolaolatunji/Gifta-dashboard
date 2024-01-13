import React,{ useEffect, useState } from "react";
import DashHeader from "../DashBoard/DashboardComponents/DashHeader";
import DashTabs from "../DashBoard/DashboardComponents/DashTabs";

import WishlistImg from "../../Assets/images/3d-plastilina-adding-bookmark-symbol.png";
import { BsBookmarkCheck } from "react-icons/bs";
import DashboardModal from "../../Components/Modal";
import WishlistForm from "./WishlistsComponents/WishlistForm";
import GiftLoader from '../../Assets/images/gifta-loader.gif';
import { useAuthContext } from "../../Auth/context/AuthContext";
import { dateConverter } from "../../utils/helper";
import { PiPlusBold, PiShareFatFill } from "react-icons/pi";
import { ShareSocial } from 'react-share-social';
import { AiFillExclamationCircle } from "react-icons/ai";
import Alert from "../../Components/Alert";
import { Link } from "react-router-dom";
import SkelentonTwo from "../../Components/SkelentonTwo";
import SkelentonOne from "../../Components/SkelentonOne";
import SkelentonCard from "../../Components/SkelentonCard";


const customStyle = {
	minHeight: "auto",
	maxWidth: "45rem",
	width: "45rem",
};

const shareCustomStyle = {
	root: {
		padding: 0,
		marginTop: '-1.2rem',
	},
	copyContainer: {
		fontWeight: 600,
		fontSize: '1.6rem',
		padding: '1rem',
	},
}

function Wishlists() {
	const [share, setShare] = useState(false);
	const [url, setUrl] = useState('')
	const [showDashboardModal, setShowDashboardModal] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [wishLists, setWishLists] = useState([]);
	const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
	const [helpReset, setHelpReset] = useState(false);

	const { user, token } = useAuthContext();

	function handleModal() {
		setShowDashboardModal(true);
	}

	function handleShare(link, hasWish) {
		if(hasWish) {
			setShare(true);
			setUrl(link);
		} else {
			handleFailure('No wish to share!');
			setShare(false);
			setUrl('');
		}
	}

	// HANDLE ON FETCH FAILURE
    function handleFailure(mess) {
        setIsError(true);
        setMessage(mess)
        setTimeout(() => {
            setIsError(false);
            setMessage('')
        }, 2000);
    }

	useEffect(function () {
		async function fetchWishlists() {
			try {
				setIsLoading(true);
				const res = await fetch('http://localhost:3010/api/wishlists/user-wishlists/wishlists', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				});
				if (!res.ok) throw new Error('Something went wrong!');
				const data = await res.json();
				if (data.status !== 'success') {
					throw new Error(data.message);
				}
				setIsLoading(false)
				setWishLists(data.data.wishLists);
				console.log(data)
			} catch (err) {
				console.log(err.message);
				setIsLoading(false)
			}
		}
		fetchWishlists();
	}, [helpReset]);


	return (
		<>
			<DashHeader />
			<DashTabs />
			<section className="wishlist__section section">
				<div className="section__container">
					{/* {isLoading && (<SkelentonTwo />)} */}
					{isLoading &&  (
						<div className='wishlist--grid' style={{ columnGap: '8rem' }}>
							<SkelentonCard />
							<SkelentonCard />
							<SkelentonCard />
						</div>
					)}

					{(wishLists && wishLists.length > 0) ? (
						<div className='wishlist--grid'>
							<button className="w-figure--btn" onClick={handleModal}>Add Wishlist</button>
							{wishLists.map(wishList => (
								<div className="wishlist--figure">
									<span className="w-figure-category">{wishList.category}</span>
									<a target='_blank' href={`http://localhost:3010/asset/others/${wishList.image}`}>
										<img className="w-figure--image" src={`http://localhost:3010/asset/others/${wishList.image}`} alt={wishList.image} />
									</a>
									<figcaption className="w-figure--details">
										<div className="w-figure--head">
											<span className="w-figure--title">{wishList.name}</span>
											<div className="share--icons">
												{(user.isPremium || (!user.isPremium && wishList?.wishes.length < 10)) && (
													<Link to={`/dashboard/wishlists/${wishList?.slug}/wish?new=true`}>
														<PiPlusBold className='share--icon' />
													</Link>
												)}
												<PiShareFatFill className='share--icon' onClick={() => handleShare(`https://gifta.com/${wishList.shortSharableUrl}`, wishList.wishes.length > 0)} />
											</div>
										</div>
										{wishList.wishes.length === 0 ? (
											<p className="no-wish-item">You've no wish yet!</p>
										) : (
											<ul className="wish--list">
												{wishList.wishes.slice(0, 5).map(wishItem => (
													<li className="wish--item">{wishItem.wish}</li>
												))}
											</ul>
										)}
										<div className="w-figure--info">
											{wishList?.wishes.length >= 1 && (
												<Link to={`/dashboard/wishlists/${wishList?.slug}`}>
													<span className="w-figure--view-more">View All ({wishList.wishes.length})</span>
												</Link>
											)}
											<span className="wish--date">{dateConverter(wishList.updatedAt)}</span>
										</div>
									</figcaption>
								</div>
							))}
						</div>
					) : (wishLists && wishLists.length === 0 && !isLoading) && (
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
					<WishlistForm setShowDashboardModal={setShowDashboardModal} setHelpReset={setHelpReset} />
				</DashboardModal>
			)}
			{share && (
				<DashboardModal
					title={'Make your wish come true! Share Link'}
					setShowDashboardModal={setShare}
					customStyle={customStyle}
					>
					<ShareSocial  
						url={url}
						socialTypes= {['facebook','twitter', 'whatsapp', 'telegram', 'linkedin']}
						onSocialButtonClicked={ (data) => console.log(data)}  
						style={shareCustomStyle}
					/>
				</DashboardModal>
			)}
			{isError && (
				<Alert alertType="error">
					<AiFillExclamationCircle className="alert--icon" />
					<p>{message}</p>
				</Alert>
			)}
		</>
	);
}

export default Wishlists;
