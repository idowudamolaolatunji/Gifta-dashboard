import React from "react";

function Alert({ children, alertType, style }) {
	return (
		<div style={style} className={`alert alert--${alertType}`}>
            {children}
		</div>
	);
}

export default Alert;