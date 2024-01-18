import React, { useEffect, useState } from "react";
import DashHeader from "./DashboardComponents/DashHeader";
import DashTabs from "./DashboardComponents/DashTabs";

// import "./main.css";
import { TfiGift } from "react-icons/tfi";
import GiftImg from '../../Assets/images/casual-life-3d-pink-gift-box.png';
import { Link } from "react-router-dom";
import { useAuthContext } from "../../Auth/context/AuthContext";
import SkeletonLoader from '../../Components/SkeletonLoader';
import { dateConverter, expectedDateFormatter } from "../../utils/helper";
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


const DashBoard = () => {
	// const [isLoading, setIsLoading] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const [giftings, setGiftings] = useState([]);
	const { user, token } = useAuthContext();

	console.log(user._id)

	
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
				console.log(data.data.giftings)
			} catch (err) {
				console.log(err.message)
			} finally {
				setIsLoading(false)
			}
		}
		fetchGiftings()
	}, [])

	return (
		<div>
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
							<div>
								<h3 className="section__heading" style={{ color: '#bb0505', margin: '0 0 3.2rem .8rem' }}>Gifts bought by you!</h3>
								<div className="pagination--actions">
									{/* <span><FaAngleLeft /></span> */}
									{/* <span><FaAngleRight /></span> */}
									{/* <span>Ongoing</span>
									<span>Passed / Completed</span> */}
								</div>
							</div>
							<div className="giftPackage__cards">
								{giftings.map(gifting => {
									{console.log(gifting.gifter._id)}
									return (
										<div className='giftPackage--figure' key={gifting._id}>
											<img src={`https://test.tajify.com/asset/others/${gifting?.celebrantImage}` || GiftImg} alt={gifting?.celebrant} />
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
		</div>
	);
};

export default DashBoard;

