import React from "react";
import DashHeader from "../DashBoard/DashboardComponents/DashHeader";
import DashTabs from "../DashBoard/DashboardComponents/DashTabs";
import MarketProducts from "./MarketComponent/MarketProducts";

function MarketPlace() {
	return (
		<>
			<DashHeader />
			<DashTabs />
            
            
		    <section className="marketplace__section section__container section">
				<MarketProducts />
            </section>

		</>
	);
}

export default MarketPlace;
