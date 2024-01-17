import GiftBox from "../Assets/giftbox.jpg";
import GiftaLogo from "../Assets/gifta-logo.png";
import GiftaWhiteLogo from "../Assets/gifta-white-logo.png";
import { Link } from "react-router-dom";

import "./auth.css";
import { useState } from "react";
import Alert from "../Components/Alert";
import { AiFillCheckCircle, AiFillExclamationCircle } from "react-icons/ai";
import Spinner from "../Components/Spinner";
import OTPMODAL from "./OTPMODAL";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";


function Signup() {
	const [isLoading, setIsLoading] = useState(false);
	const [fullName, setFullName] = useState('');
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [checked, setChecked] = useState(false);
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

	const [message, setMessage] = useState('');
	const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [showOtpModal, setShowOtpModal] = useState(function() {
		const info = JSON.parse(localStorage.getItem('otpDetails'))
		return info?.showOtpModal || false;
	});


	function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  };
	function togglePasswordConfirmVisibility() {
    setShowPasswordConfirm(!showPasswordConfirm);
  };


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


	const handleSubmit = async (e) => {
		try {
			e.preventDefault();
			setIsLoading(true);
			handleReset();
			console.log(password, passwordConfirm)

			if (email === '' || password === '' || fullName === "" || username === ""  || passwordConfirm === "") {
				throw new Error('All fields are required!');
			}

			if(password !== passwordConfirm) throw new Error('Passwords are not the same!')
			if(!checked) throw new Error('Accept our terms and condition')

			const res = await fetch("https://test.tajify.com/api/users/signup", {
				method: 'POST',
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ fullName, username, email, password, passwordConfirm }),
			});

			if (!res.ok) {
				throw new Error("Something went wrong!")
			}

			const data = await res.json();
			if (data.status !== 'success') {
				throw new Error(data.message);
			}

			setIsSuccess(true);
			setMessage(data.message || 'Signup Successful. Verify OTP Code')
			// setMessage(data.message)
			setTimeout(() => {
				setIsSuccess(false);
				setMessage("");
				setShowOtpModal(true);
			}, 1000);
			const otpDetails = {
				email, showOtpModal: true,
			}
			localStorage.setItem('otpDetails', JSON.stringify(otpDetails))
		} catch (err) {
			handleError(err.message)
		} finally {
			setIsLoading(false)
		}
	};


	return (
		<>
			{isLoading && (
				<div className='gifting--loader'>
					<Spinner />
				</div>
			)}
			<div className="auth__container">
				<div className="auth__image--box">
					<span>
						<a className="auth__logo" href={`/`}>
							<img src={GiftaWhiteLogo} alt="logo" />
						</a>

						<h2>Welcome back to Gifta</h2>

						<p> Every Moment Deserves the Perfect Gift!</p>
					</span>
				</div>

				<div className="auth--box signup--auth">
					<h2 className="auth--heading">Sign Up</h2>

					<form onSubmit={handleSubmit} className="auth--form">
						<div className="form--flex">
							<div className="form--item">
								<label htmlFor="FirstName" className="form--label">
									Fullname
								</label>

								<input
									type="text"
									id="fullName"
									name="first_name"
									className="form--input"
									value={fullName}
									placeholder="Enter Your Fullname"
									onChange={e => setFullName(e.target.value)}
								/>
							</div>

							<div className="form--item">
								<label htmlFor="username" className="form--label">
									Username
								</label>

								<input
									type="text"
									id="username"
									name="last_name"
									className="form--input"
									value={username}
									placeholder="Enter a Username"
									onChange={e => setUsername(e.target.value)}
								/>
							</div>
						</div>

						<div className="form--item">
							<label htmlFor="Email" className="form--label">
								Email
							</label>

							<input type="email" id="Email" placeholder="Enter Email Address" name="email" value={email} onChange={e => setEmail(e.target.value)} className="form--input" />
						</div>

						<div className="form--flex">
							<div className="form--item">
								<label htmlFor="Password" className="form--label">
									Password
								</label>

								<div className="form--input-box">
									<input
										// type="password"
										type={showPassword ? "text" : "password"}
										id="Password"
										name="password"
										className="form--input"
										value={password}
										placeholder="Enter a Password"
										onChange={e => setPassword(e.target.value)}
									/>
									{showPassword ? (
										<FaRegEye
											onClick={togglePasswordVisibility}
											className="password__icon"
										/>
										) : (
										<FaRegEyeSlash
											onClick={togglePasswordVisibility}
											className="password__icon"
										/>
									)}
								</div>

							</div>

							<div className="form--item">
								<label htmlFor="PasswordConfirmation" className="form--label">
									Password Confirmation
								</label>
										
								<div className="form--input-box">
									<input
										// type="password"
										type={showPasswordConfirm ? "text" : "password"}
										id="PasswordConfirmation"
										name="password_confirmation"
										className="form--input"
										value={passwordConfirm}
										placeholder="Enter a Password Confirmation"
										onChange={e => setPasswordConfirm(e.target.value)}
									/>
									{showPasswordConfirm ? (
										<FaRegEye
											onClick={togglePasswordConfirmVisibility}
											className="password__icon"
										/>
										) : (
											<FaRegEyeSlash
											onClick={togglePasswordConfirmVisibility}
											className="password__icon"
										/>
									)}
								</div>
							</div>
						</div>

						<div className="form--check">
							<input
								type="checkbox"
								id="MarketingAccept"
								name="marketing_accept"
								className=""
								value={checked}
								onChange={e => setChecked(e.target.value)}
							/>

							<p htmlFor="MarketingAccept" className="form--content">
								I want to receive emails about events, product updates and company announcements.
							</p>
						</div>

						<div className="form--item">
							<span className="form--content">
								By creating an account, you agree to our{' '}
								<Link to={`#`} className="">
									terms and conditions
								</Link>
								{' '}and{' '}
								<Link to={`#`} className="">
									privacy policy
								</Link>
								.
							</span>
						</div>

						<div style={{ marginTop: '1rem' }} className="form--others">
							<button className="form--submit" type="submit" style={{ cursor: 'pointer' }}>
								Create an account
							</button>

							<p className="form--content" style={{ marginTop: '0' }}>
								Already have an account?{' '}
								<Link to={`/login`}>
									Log in
								</Link>
								.
							</p>
						</div>
					</form>
				</div>
			</div>

			{(showOtpModal) && (
				<OTPMODAL setShowOtpModal={setShowOtpModal} />
			)}


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

export default Signup;
