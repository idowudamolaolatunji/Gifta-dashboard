import GiftBox from "../Assets/giftbox.jpg";
import GiftaLogo from "../Assets/gifta-logo.png";
import GiftaWhiteLogo from "../Assets/gifta-white-logo.png";
import { Link } from "react-router-dom";

import "./auth.css";

function Signup() {
	return (
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

				<form action="#" className="auth--form">
					<div className="form--flex">
						<div className="form--item">
							<label htmlFor="FirstName" className="form--label">
								First Name
							</label>

							<input
								type="text"
								id="FirstName"
								name="first_name"
								className="form--input"
							/>
						</div>

						<div className="form--item">
							<label htmlFor="LastName" className="form--label">
								Last Name
							</label>

							<input
								type="text"
								id="LastName"
								name="last_name"
								className="form--input"
							/>
						</div>
					</div>

					<div className="form--item">
						<label htmlFor="Email" className="form--label">
							Email
						</label>

						<input type="email" id="Email" name="email" className="form--input" />
					</div>

					<div className="form--flex">
						<div className="form--item">
							<label htmlFor="Password" className="form--label">
								Password
							</label>

							<input
								type="password"
								id="Password"
								name="password"
								className="form--input"
							/>
						</div>

						<div className="form--item">
							<label htmlFor="PasswordConfirmation" className="form--label">
								Password Confirmation
							</label>

							<input
								type="password"
								id="PasswordConfirmation"
								name="password_confirmation"
								className="form--input"
							/>
						</div>
					</div>

					<div className="form--check">
						<input
							type="checkbox"
							id="MarketingAccept"
							name="marketing_accept"
							className=""
						/>

						<p htmlFor="MarketingAccept" className="form--content">
							I want to receive emails about events, product updates and company announcements.
						</p>
					</div>

					<div className="form--item">
						<span className="form--content">
							By creating an account, you agree to our{' '}
							<Link to={`#`} className="">
								terms and conditions{' '}
							</Link>
							and{' '}
							<Link to={`#`} className="">
								privacy policy
							</Link>
							.
						</span>
					</div>

					<div style={{ marginTop: '1rem' }} className="form--others">
						<button className="form--submit">
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
	);
}

export default Signup;
