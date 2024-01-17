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
					{/* {isLoading && (<SkelentonFour />)}
					{giftings.length > 0 ? (
						<div className="dashboard--gifting">
							<div>
								<h3 className="section__heading" style={{ color: '#bb0505', margin: '0 0 3.2rem .8rem' }}>Gifts bought by you!</h3>
								<div className="pagination--actions">
									<span><FaAngleLeft /></span>
									<span><FaAngleRight /></span>
								</div>
							</div>
							<Swiper
								slidesPerView={4}
								spaceBetween={26}
								freeMode={true}
								navigation={true}
								modules={[FreeMode, Navigation]}
								className="giftPackage__cards mySwiper"
							>
								{giftings.map(gifting => {
									{console.log(gifting.gifter._id)}
									return (
										<SwiperSlide className='giftPackage--figure' key={gifting._id}>
											<img src={`https://test.tajify.com/asset/others/${gifting?.celebrantImage}` || GiftImg} alt={gifting?.celebrant} />
											<figcaption className="giftPackage--details">
												<p className="package--celebrant">For{' '}{gifting.celebrant}</p>
												<p className="package--description">{gifting.description}</p>
												<span className="package--info">
													<span className="package--category">{gifting.purpose}</span>
													<p className="package--date">
														{expectedDateFormatter(gifting.date)}
													</p>
												</span>
											</figcaption>
										</SwiperSlide>
									)
								})}
							</Swiper> 
						</div>
					) : (!isLoading && giftings.length === 0) && (
						<div className="gifting--banner banner">
							<h3 className="section__heading">Lift Someone's Spirit With a <span style={{ color: '#bb0505' }}>Gift <TfiGift /></span></h3>
							<img src={GiftImg} alt={GiftImg}  />
							<Link to={'/dashboard/gifting'}>
								<button type="button">Create Gifting</button>
							</Link>
						</div>
					)} */}
					<div className="gifting--banner banner">
						<h3 className="section__heading">Lift Someone's Spirit With a <span style={{ color: '#bb0505' }}>Gift <TfiGift /></span></h3>
						<img src={GiftImg} alt={GiftImg}  />
						<Link to={'/dashboard/gifting'}>
							<button type="button">Create Gifting</button>
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
};

export default DashBoard;


/*
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import './styles.css';

// import required modules
import { FreeMode, Pagination } from 'swiper/modules';

export default function App() {
  return (
    <>
      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        freeMode={true}
        pagination={{
          clickable: true,
        }}
        modules={[FreeMode, Pagination]}
        className="mySwiper"
      >
        <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
        <SwiperSlide>Slide 5</SwiperSlide>
        <SwiperSlide>Slide 6</SwiperSlide>
        <SwiperSlide>Slide 7</SwiperSlide>
        <SwiperSlide>Slide 8</SwiperSlide>
        <SwiperSlide>Slide 9</SwiperSlide>
      </Swiper>
    </>
  );
}

*/