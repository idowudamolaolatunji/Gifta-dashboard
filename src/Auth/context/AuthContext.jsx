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

	// FUNCTION TO REFETCH
	const handleRefetchHelp = () => {
		setRefetchHelp(!refetchHelp);
	};

	const handleChange = (user, token ) => {
		setUser(user);
		setToken(token);
	};

	const handleUser = (user) => {
		setUser(user);
	};

	const logout = async () => {
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
		} catch (err) {
			console.log(err.message)
			Cookies.remove("giftaUser");
			Cookies.remove("userToken");
		}
	};

	useEffect(() => {
		Cookies.set("giftaUser", JSON.stringify(user), { expires: 365 });
		Cookies.set("userToken", token, { expires: 365 });
	}, [user, token]);

	let contextData = {
		user: user,
		token: token,
		handleChange,
		handleUser,
		logout,
		refetchHelp,
		handleRefetchHelp,
	};

	return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);

