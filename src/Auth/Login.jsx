import { useState, useEffect } from "react";
import giftbox from "../Assets/giftbox.jpg";
import giftaLogo from "../Assets/gifta-logo.png";
import giftaWhiteLogo from "../Assets/gifta-white-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";
import Alert from "../Components/Alert";
import Spinner from "../Components/Spinner";
import { AiFillCheckCircle, AiFillExclamationCircle } from "react-icons/ai";

import './auth.css';

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [message, setMessage] = useState("");

	const navigate = useNavigate();
	const { user, handleChange } = useAuthContext();

	function handleReset() {
		setIsError(false);
		setIsSuccess(false);
		setMessage("");
	}

	function handleError(mess) {
		setIsError(true);
		setMessage(mess);
		setTimeout(() => {
			setIsError(false);
			setMessage("");
		}, 2500);
	}

	async function handleLoginUser(e) {
		try {
			setIsLoading(true);
			e.preventDefault();
			handleReset();

			if (user === '' || password === '') throw new Error("Fields Empty");

			const res = await fetch("https://test.tajify.com/api/users/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			if (!res.ok) {
				throw new Error("Something went wrong!");
			}

			const data = await res.json();
			if (data.status !== "success") {
				throw new Error(data.message);
			}

			setMessage(data.message || "User Login Successful!");
			setIsSuccess(true);
			setTimeout(() => {
				setIsError(false);
				setMessage("");
				handleChange(data.data.user, data.token);
			}, 1000);
		} catch (err) {
			handleError(err.message);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(
		function () {
			if (user) {
				navigate("/dashboard");
			}
		},
		[user],
	);

	return (
		<>
			{isLoading && <Spinner />}
			<div className="auth__container">
				<div className="auth__image--box">
					<span>
						<a className="auth__logo" href={`/`}>
							<img src={giftaWhiteLogo} alt="logo" />
						</a>

						<h2>Welcome back to Gifta</h2>

						<p> Every Moment Deserves the Perfect Gift!</p>
					</span>
				</div>

				<div className="auth--box login--auth">
						
					<h1 className="auth--heading">
						Login
					</h1>

					<form onSubmit={handleLoginUser} className="auth--form">
						<div className="form--item">
							<label
								htmlFor="Email"
								className="form--label"
							>
								Email
							</label>

							<input
								type="email"
								id="Email"
								name="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="form--input"
								placeholder="Enter your email address"
							/>
						</div>

						<div className="form--item">
							<label
								htmlFor="Password"
								className="form--label"
							>
								Password
							</label>

							<input
								type="password"
								id="Password"
								name="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="form--input"
								placeholder="Enter your password"
							/>
						</div>

						<div className="form--check">
							<input
								type="checkbox"
								id="MarketingAccept"
								name="marketing_accept"
								className=""
							/>
							<label htmlFor="MarketingAccept" className="form--label">Remember me</label>
						</div>

						<div className="form--others">
							<button className="form--submit">
								Login
							</button>

							<p className="form--content">
								Don't have an account?{' '}
								<Link to={`/signup`}>
									Sign up
								</Link>
							</p>
						</div>
					</form>
				</div>
			</div>

			<Alert alertType={`${isSuccess ? "success" : isError ? "error" : ""}`}>
				{isSuccess ? (
					<AiFillCheckCircle className="alert--icon" />
				) : isError ? (
					<AiFillExclamationCircle className="alert--icon" />
				) : (
					""
				)}
				<p>{message}</p>
			</Alert>
		</>
	);
}

export default Login;
