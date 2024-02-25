import React, { useEffect, useState } from "react";
import DashHeader from "./DashboardComponents/DashHeader";
import DashTabs from "./DashboardComponents/DashTabs";

// import "./main.css";
import { TfiGift } from "react-icons/tfi";
import GiftImg from '../../Assets/images/casual-life-3d-pink-gift-box.png';
import { Link } from "react-router-dom";
import { useAuthContext } from "../../Auth/context/AuthContext";
import SkeletonLoader from '../../Components/SkeletonLoader';
import { dateConverter, expectedDateFormatter, numberConverter } from "../../utils/helper";
import SkelentonFour from "../../Components/SkelentonFour";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

import { Swiper, SwiperSlide } from 'swiper/react';
// import required modules
import { FreeMode, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FiPlus } from "react-icons/fi";
import SkelentonOne from "../../Components/SkelentonOne";
import MobileFullScreenModal from "../../Components/MobileFullScreenModal";
import { MdArrowBackIos } from "react-icons/md";
import { IoLocationSharp, IoPricetagOutline } from "react-icons/io5";
import { CiCalendar } from "react-icons/ci";
import TawkToSupport from "../../Components/TawkToSupport";



const DashBoard = () => {
	// const [isLoading, setIsLoading] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [giftings, setGiftings] = useState([]);

	const [selectedGift, setSelectedGift] = useState(null);
	const [showGiftingModal, setShowGiftingModal] = useState(false);

	const [activeTab, setActiveTab] = useState('active');
	const { user, token } = useAuthContext();

	const activeGiftings = giftings?.filter(gifts => !gifts?.isDelivered);
	const compltedGiftings = giftings?.filter(gifts => gifts?.isDelivered);
	const mapGiftings = activeTab === 'active' ? activeGiftings : compltedGiftings;


	function handleGiftPackage(gift) {
		setShowGiftingModal(true);
		setSelectedGift(gift);
	}

	
	useEffect(() => {
		async function fetchGiftings() {
			try {
				setIsLoading(true);
				const res = await fetch('https://test.tajify.com/api/giftings/my-giftings/bought', {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				});
				if(!res.ok) throw new Error('SOmething went wrong!');
				const data = await res.json();
				if(data.status !== 'success') {
					throw new Error(data.message);
				}
				setGiftings(data.data.giftings)
			} catch (err) {
				console.log(err.message)
			} finally {
				setIsLoading(false)
			}
		}
		fetchGiftings();
	}, []);

	useEffect(function() {
		document.title = 'Gifta | User Dashboard'
	}, []);

	console.log(selectedGift)

	return (
		<>
			<DashHeader isDasboard={true} />
			<DashTabs /> 

			<section className="main__section section">
				<div className="section__container">
					{isLoading && ( 
						<>
							<div className='category--spinner-destop'>
								<SkelentonFour />
							</div>

							<div className='category--spinner-mobile'>
								<SkelentonOne height={'18rem'} />
								<SkelentonOne height={'18rem'} />
							</div>
						</>
					)}
					{/* {isLoading && (<SkelentonFour />)} */}
					{giftings.length > 0 ? (
						<div className="dashboard--gifting">
							<span className='section--flex' style={{ marginBottom: '3.2rem', justifyContent: 'space-between' }}>
								<h3 className="section__heading" style={{ color: '#bb0505', margin: '0' }}>Gifts bought by you!</h3>
								<div className="wallet--tabs">
									<span className={`wallet--tab ${activeTab === "active" && "tab--active"}`} onClick={() => { setActiveTab("active") }}>Active Gifting</span>
									<span className={`wallet--tab ${activeTab === "completed" && "tab--active"}`} onClick={() => { setActiveTab("completed") }}>Completed Gifting</span>
								</div>
							</span>
								
							<>
								{mapGiftings.length === 0 && (
									<div className='note--box' style={{ backgroundColor: 'transparent', padding: '0', height: 'auto' }}>
										<p>No {activeTab} Gifting!</p>
									</div>
								)}
							
								<div className="giftPackage__cards">
									{mapGiftings.map(gifting => {
										return (
											<div className='giftPackage--figure' key={gifting._id} onClick={() => handleGiftPackage(gifting)}>
												<img src={`https://test.tajify.com/asset/others/${gifting?.celebrantImage}`} alt={gifting?.celebrant} />
												<span className="package--category">{gifting.purpose}</span>
												<figcaption className="giftPackage--details">
													<p className="package--celebrant">For{' '}{gifting.celebrant}</p>
													<p className="package--date">
														{expectedDateFormatter(gifting.date)}
													</p>
													{/* <p className="package--description">{gifting.description}</p> */}
													{/* <span className="package--info"></span> */}
												</figcaption>
											</div>
										)
									})}
								</div> 
							</>

							<Link to={'/dashboard/gifting'}>
								<div className="dashnoard--add-btn" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><FiPlus /></div>
							</Link>
						</div>
					) : (!isLoading && giftings.length === 0) && (
						<div className="gifting--banner banner">
							<h3 className="section__heading">Lift Someone's Spirit With a <span style={{ color: '#bb0505' }}>Gift <TfiGift /></span></h3>
							<img src={GiftImg} alt={GiftImg}  />
							<Link to={'/dashboard/gifting'}>
								<button type="button">Create Gifting</button>
							</Link>
						</div>
					)}
				</div>
			</section>



			{showGiftingModal && (
				<MobileFullScreenModal key={selectedGift._id}>
					<div className="gift--preview-figure">
						
						<div className="gift--preview-top">
							<img src={`https://test.tajify.com/asset/others/${selectedGift?.celebrantImage}` || GiftImg} alt={selectedGift?.celebrant} />
							<div className="gift--preview-details">
								<span onClick={() => setShowGiftingModal(false)}><MdArrowBackIos /></span>
								<p className="gift--preview-name">For {selectedGift?.celebrant}</p>
								<p className="gift--preview-date">
									<CiCalendar />
									{expectedDateFormatter(selectedGift?.date)}
								</p>
							</div>
						</div>

						<div className="gift--preview-bottom">
							<span className="gift--preview-title"> Purchased Gift <TfiGift style={{ color: '#bb0505' }} /></span>
							<div className="gift--preview-flex">
								<img src={`https://test.tajify.com/asset/products/${selectedGift?.gift?.image}`} />
								<div>
								<p>{selectedGift?.gift?.name}</p>
								<span className="gift--preview-price"><IoPricetagOutline /><p>₦{numberConverter(selectedGift?.amount)}</p></span>
								</div>
							</div>
							<span className="gift--preview-title"> Delivery Location <IoLocationSharp style={{ color: '#bb0505' }} /></span>
							<p style={{ fontSize: '1.4rem' }}>{selectedGift?.address}</p>
						</div>
					</div>
				</MobileFullScreenModal>
			)}

			<TawkToSupport />
		</>
	);
};

export default DashBoard;

