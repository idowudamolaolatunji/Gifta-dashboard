import React from "react";
import DashHeader from "../DashBoard/DashboardComponents/DashHeader";
import DashTabs from "../DashBoard/DashboardComponents/DashTabs";

import ReminderImg from '../../Assets/images/props-loud-speaker.png';

function Reminders() {
	return (
		<>
			<DashHeader />
			<DashTabs />

			<section className="section reminder__section">
				<div className="section__container">
					<div className="reminder--banner banner">
						<h3 className="section__heading">Lift us remind you of your <span style={{ color: '#bb0505' }}>special dates!</span></h3>

						<img src={ReminderImg} alt={ReminderImg}  />
						<button type="button">Set a Reminder</button>
					</div>
				</div>
			</section>
		</>
	);
}

export default Reminders;
