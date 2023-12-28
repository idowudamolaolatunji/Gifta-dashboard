import React, { useEffect, useState } from "react";
import DashHeader from "./DashboardComponents/DashHeader";
import DashTabs from "./DashboardComponents/DashTabs";

import "./main.css";
import { TfiGift } from "react-icons/tfi";
import GiftImg from '../../Assets/images/casual-life-3d-pink-gift-box.png';
import { Link } from "react-router-dom";
import { useAuthContext } from "../../Auth/context/AuthContext";
import SkeletonLoader from '../../Components/SkeletonLoader';
import { dateConverter } from "../../utils/helper";
// import { PiDotsThreeVerticalBold } from "react-icons/pi";

const DashBoard = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [giftings, setGiftings] = useState([]);
	const { token } = useAuthContext();

	
	useEffect(() => {
		async function fetchGiftings() {
			try {
				setIsLoading(true);
				const res = await fetch('https://test.tajify.com/api/giftings/my-giftings', {
					method: 'GET',
					header: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`
					}
				});
				if(!res.ok) throw new Error('SOmething went wrong!');
				const data = await res.json();
				if(data.status !== 'success') {
					throw new Error(data.message);
				}
				// setGiftings(data.data.giftings)
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
					
					{giftings.length > 0 ?
						<div className='giftPackage__cards'>
							{giftings.map(gifting => {
								return (
									<figure className='giftPackage--figure' key={gifting._id}>
										{/* <PiDotsThreeVerticalBold /> */}
										<img src={gifting?.celebrantImage || GiftImg} alt={gifting?.celebrant} />
										<figcaption className="giftPackage--details">
											<p className="package--celebrant">{gifting.celebrant}</p>
											<p className="package--description">{gifting.description}</p>
											<span className="package--info">
												<span className="package--category">{gifting.category || 'birthday'}</span>
												<p className="package--date">
													{dateConverter(gifting.date)}
												</p>
											</span>
										</figcaption>
									</figure>
								)
							})}
						</div> : (
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
