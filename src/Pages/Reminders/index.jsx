import React, { useState } from "react";
import DashHeader from "../DashBoard/DashboardComponents/DashHeader";
import DashTabs from "../DashBoard/DashboardComponents/DashTabs";

import ReminderImg from '../../Assets/images/props-loud-speaker.png';
import DashboardModal from "../../Components/Modal";
import ReminderModal from "./ReminderComponents/ReminderModal";


const customStyle = {
	minHeight: "auto",
	maxWidth: "50rem",
	width: "50rem",
};

function Reminders() {
	const [showDashboardModal, setShowDashboardModal] = useState(false);


	return (
		<>
			<DashHeader />
			<DashTabs />

			<section className="section reminder__section">
				<div className="section__container">
					<div className="reminder--banner banner">
						<h3 className="section__heading">Lift us remind you of your <span style={{ color: '#bb0505' }}>special dates!</span></h3>

						<img src={ReminderImg} alt={ReminderImg}  />
						<button type="button" onClick={() => setShowDashboardModal(true)}>Set a Reminder</button>
					</div>
				</div>
			</section>

			{showDashboardModal && (
				<DashboardModal
					title={'Set Reminder'}
					customStyle={customStyle}
					setShowDashboardModal={setShowDashboardModal}
				>
					<ReminderModal />
				</DashboardModal>
			)}
		</>
	);
}

export default Reminders;
