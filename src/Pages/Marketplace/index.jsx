import React, { useEffect } from "react";
import DashHeader from "../DashBoard/DashboardComponents/DashHeader";
import DashTabs from "../DashBoard/DashboardComponents/DashTabs";
import MarketProducts from "./MarketComponent/MarketProducts";
import Header from "./MarketComponent/Header";

function MarketPlace() {

	useEffect(function() {
		document.title = 'Gifta | Marketplace'
	}, [])

	return (
		<>
			{/* <DashHeader />
			<DashTabs /> */}

			<Header />
            
            
		    <section className="marketplace__section">
				{/* <div className="section__container" style={{ border: '1px solid red'}}> */}
					<MarketProducts type={'gifting'} />
				{/* </div> */}
            </section>

		</>
	);
}

export default MarketPlace;
