import React from "react";
import { AiOutlineClose } from "react-icons/ai";

function DashboardModal({ setShowDashboardModal, title, customStyle, children }) {

    function handleModalClose() {
		setShowDashboardModal(false);
	}

	return (
		<div className="overlay">
			<div className="modal" style={customStyle}>
				<span className="modal--head">
					<p className="modal--heading">{title}</p>
					<AiOutlineClose className="modal--icon" onClick={handleModalClose} />
				</span>

				<div className="modal__content">{ children }</div>
			</div>
		</div>
	);
}

export default DashboardModal;
