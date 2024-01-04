import React from "react";

function Alert({ children, alertType, style }) {
	return (
		<div className="alert--overlay">
			<div style={style} className={`alert alert--${alertType}`}>
				{children}
			</div>
		</div>
	);
}

export default Alert;
