import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() =>
		Cookies.get("giftaUser") ? JSON.parse(Cookies.get("giftaUser")) : null,
	);
	const [token, setToken] = useState(Cookies.get("userToken") || null);
	const [refetchHelp, setRefetchHelp] = useState(false);
	///////////////////////////////////////////////////////////
	const [notifications, setNotifications] = useState([]);
	const [notificationCount, setNoticationCount] = useState(0);

	function handleSetNotification(notifications, notificationCount) {
	// function handleSetNotification(unreadNotifications, unreadCount, readNotification, read) {
		setNotifications(notifications);
		setNoticationCount(notificationCount)
	}

	// FUNCTION TO REFETCH
	function handleRefetchHelp() {
		setRefetchHelp(!refetchHelp);
	};

	function handleChange(user, token ) {
		setUser(user);
		setToken(token);
	};

	function handleUser(user) {
		setUser(user);
	};

	async function logout(){
		try {
			const res = await fetch("https://test.tajify.com/api/users/logout", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			})

			if(!res.ok) throw new Error('Something went wrong!');
			const data = await res.json();

			if(data.status !== 'success') throw new Error(data.message);
			Cookies.remove("giftaUser");
			Cookies.remove("userToken");
			// Cookies.remove("giftaUser", { domain: '.getgifta.com' });
			// Cookies.remove("userToken", { domain: '.getgifta.com' });
		} catch (err) {
			console.log(err.message)
			Cookies.remove("giftaUser");
			Cookies.remove("userToken");
			// Cookies.remove("giftaUser", { domain: '.getgifta.com' });
			// Cookies.remove("userToken", { domain: '.getgifta.com' });
		}
	};

	function shouldKick(e) {
		if (e.response.status === 401 || e.response.status === 403) {
		  Cookies.remove("user");
		  Cookies.remove("token");
		  window.location.href = "/login";
		}
	};


	useEffect(function() {
		async function handleFetchNotifications() {
			const res = await fetch('https://test.tajify.com/api/notifications/my-notifications', {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			});
			if(!res.ok) throw new Error('Something went wrong!');
			const data = await res.json();
			if(data.status !== "success") throw new Error(data.message);
			const count = data?.data?.notifications?.filter(notification => notification.status === 'unread' );
			handleSetNotification(data.data.notifications, count.length);
		}
		if(user) {
			handleFetchNotifications();
			const intervalId = setInterval(handleFetchNotifications, 17500); // 150000 === 600,000 millsec === 10 mins
			return () => clearInterval(intervalId);
		}
	}, [user, token]);



	useEffect(() => {
		Cookies.set("giftaUser", JSON.stringify(user), { expires: 365 });
		Cookies.set("userToken", token, { expires: 365 });
		// Cookies.set("giftaUser", JSON.stringify(user), { expires: 365, domain: '.getgifta.com' });
		// Cookies.set("userToken", token, { expires: 365, domain: '.getgifta.com' });
	}, [user, token]);

	let contextData = {
		user: user,
		token: token,
		handleChange,
		handleUser,
		logout,
		refetchHelp,
		handleRefetchHelp,
		shouldKick,
		////////////////////
		handleSetNotification,
		notifications,
		notificationCount
	};

	return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);

