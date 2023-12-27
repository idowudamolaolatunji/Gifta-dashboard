import { useState, useEffect } from "react";
import giftbox from "../Assets/giftbox.jpg";
import giftaLogo from "../Assets/gifta-logo.png";
import giftaWhiteLogo from "../Assets/gifta-white-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";
import Alert from "../Components/Alert";
import Spinner from "../Components/Spinner";
import { AiFillCheckCircle, AiFillExclamationCircle } from "react-icons/ai";

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
			<div className="lg:grid lg:min-h-screen lg:grid-cols-12">
				<section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
					<img
						alt="Night"
						src={giftbox}
						className="absolute inset-0 h-full w-full object-cover opacity-80"
					/>

					<div className="hidden lg:relative lg:block lg:p-12">
						<Link className="block text-white" to={`/`}>
							<span className="sr-only">Home</span>
							<img className="w-24" src={giftaWhiteLogo} alt="logo" />
						</Link>

						<h2 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
							Welcome back to Gifta
						</h2>

						<p className="mt-4 leading-relaxed text-white/90">
							Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi nam
							dolorum aliquam, quibusdam aperiam voluptatum.
						</p>
					</div>
				</section>

				<main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
					<div className="max-w-xl lg:max-w-3xl">
						<div className="relative -mt-16 block lg:hidden">
							<Link
								className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-red-600 sm:h-20 sm:w-20"
								a={`/`}
							>
								<span className="sr-only">Home</span>
								<img src={giftaLogo} alt="logo" />
							</Link>

							<h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
								Welcome back to Gifta
							</h1>

							<p className="mt-4 leading-relaxed text-gray-500">
								Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eligendi
								nam dolorum aliquam, quibusdam aperiam voluptatum.
							</p>
						</div>
						<h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
							Login
						</h1>

						<form onSubmit={handleLoginUser} className="mt-8 grid grid-cols-6 gap-6">
							<div className="col-span-6">
								<label
									htmlFor="Email"
									className="block text-sm font-medium text-gray-700"
								>
									Email
								</label>

								<input
									type="email"
									id="Email"
									name="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
								/>
							</div>

							<div className="col-span-6">
								<label
									htmlFor="Password"
									className="block text-sm font-medium text-gray-700"
								>
									Password
								</label>

								<input
									type="password"
									id="Password"
									name="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
								/>
							</div>

							<div className="col-span-6">
								<label htmlFor="MarketingAccept" className="flex gap-4">
									<input
										type="checkbox"
										id="MarketingAccept"
										name="marketing_accept"
										className="h-5 w-5 rounded-md border-gray-200 bg-white shadow-sm"
									/>

									<span className="text-sm text-gray-700">Remember me</span>
								</label>
							</div>

							<div className="col-span-6 sm:flex sm:items-center sm:gap-4">
								<button className="inline-block shrink-0 rounded-md border border-red-600 bg-red-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-red-600 focus:outline-none focus:ring active:text-red-500">
									Sign in
								</button>

								<p className="mt-4 text-sm text-gray-500 sm:mt-0">
									Don't have an account?
									<Link to={`/signup`} className="text-gray-700 underline">
										Sign up
									</Link>
								</p>
							</div>
						</form>
					</div>
				</main>
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
