import React, { useEffect } from "react";
import DashHeader from "../DashBoard/DashboardComponents/DashHeader";
import DashTabs from "../DashBoard/DashboardComponents/DashTabs";
import MarketProducts from "./MarketComponent/MarketProducts";

function MarketPlace() {

	useEffect(function() {
		document.title = 'Gifta | Marketplace'
	}, [])

	return (
		<>
			<DashHeader />
			<DashTabs />
            
            
		    <section className="marketplace__section">
				<div className="section__container">
					<MarketProducts type={'gifting'} />
				</div>
            </section>

		</>
	);
}

export default MarketPlace;
