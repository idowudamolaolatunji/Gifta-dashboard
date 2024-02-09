import React, { useEffect, useState } from 'react';
import OTPInput from 'react-otp-input';
import Spinner from '../Components/Spinner';
import Alert from '../Components/Alert';
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

const customStyle = {
    minHeight: "auto",
    maxWidth: "32rem",
    width: "32rem",
};

const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem'
}

const inputStyle = {
    width: '4rem',
    height: '4rem',
    fontSize: '1.8rem',
    border: '1.6px solid #ccc',
    borderRadius: '.4rem',
    color: '#444',
}

function OTPMODAL({ setShowOtpModal }) {
    const [otp, setOtp] = useState(null);
    const [countdownOver, setCountdownOver] = useState(false);
    const [currentSecond, setCurrentSecond] = useState(150);
    const [showOtp, setShowOtp] = useState(true)
    const [showReset, setShowReset] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);


    const info = JSON.parse(localStorage.getItem('otpDetails'))
    const email = info?.email;
    const navigate = useNavigate();


    function handleShowOtp() {
        setShowReset(false);
        setShowOtp(true);
    }
    function handleShowReset() {
        setShowOtp(false);
        setShowReset(true);
    }

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


    function startCountdown(setCountdownOver) {
        let seconds = 2.5 * 60;

        const intervalId = setInterval(() => {
            if (seconds <= 0) {
                clearInterval(intervalId);
                setCountdownOver(true);
                setCurrentSecond(0)
            } else {
                if (seconds > 0) {
                    setCountdownOver(false);
                    setCurrentSecond(seconds);
                    seconds -= 1;
                }
            }
        }, 1000);
    }

    useEffect(() => {
        startCountdown(setCountdownOver);
    }, []);


    async function handleFetchResetOtp() {
        try {
            handleReset();
            setIsLoading(true)
            const res = await fetch('https://test.tajify.com/api/users/request-otp', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email }),
            });
            // if (!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            if(data.message === 'OTP not yet expired') {
                handleShowOtp();
                throw new Error(data.message);
            }
            if(data.status !== 'success') {
                throw new Error(data.message);
            }
            setIsSuccess(true);
			setMessage(data.message)
            handleShowOtp();
        } catch (err) {
            handleError(err.message);
        } finally {
            setIsLoading(false)
        }
    }

    console.log(Number(otp))


    async function handleFetchSubmitOtp() {
        try {
            handleReset();
            setIsLoading(true);
            if(!otp) throw new Error('OTP field required!');

            const res = await fetch('https://test.tajify.com/api/users/verify-otp', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, otp: Number(otp) }),
            });
            // if (!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            console.log(res, data)
            if(data.status !== 'success') {
                throw new Error(data.message);
            }
            setIsSuccess(true);
			setMessage(data.message)
			setTimeout(() => {
				setIsSuccess(false);
				setMessage("");
                setShowOtpModal(false)
			}, 1000);
            const otpDetails = {
				email: '', showOtpModal: false,
			}
			localStorage.setItem('otpDetails', JSON.stringify(otpDetails))
            navigate('/login')
        } catch (err) {
            handleError(err.message);
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(function() {
        // handleFetchResetOtp();
    }, []);


    return (
        <>
            {isLoading && (
                <div className='gifting--loader'>
                    <Spinner />
                </div>
            )}
            <div className="overlay" />
            <div className="modal" style={customStyle}>
                {showOtp && (
                    <>
                        <p className="modal--heading" style={{ marginBottom: '3.2rem' }}>Verify OTP!</p>
                        <OTPInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={4}
                            inputStyle={inputStyle}
                            containerStyle={containerStyle}
                            renderInput={(props) => <input {...props} />}
                        />
                        <div className="reminder--actions" style={{ marginTop: '2.4rem', justifyContent: 'space-between' }}>
                            <span onClick={countdownOver ? handleShowReset : ''} className='otp--btn' style={countdownOver ? { fontWeight: '500', cursor: 'pointer', color: "#bb0505" } : {}}>Request new OTP in <p style={{ fontWeight: '600', color: "#bb0505" }}>({currentSecond}s)</p></span>
                            <button type='submit' className='set--btn' onClick={handleFetchSubmitOtp}>Submit</button>
                        </div>
                    </>
                )}
                {(showReset) && (
                    <>
                        <p className="modal--heading" style={{ marginBottom: '3.2rem' }}>Reset OTP!</p>
                        <div className="form--item">
                            <label htmlFor="" className="form--label">Email Address</label>
                            <input type="email" className="form--input" readOnly value={email} />
                        </div>
                        <div className="reminder--actions" style={{ marginTop: '1.8rem' }}>
                            <button type='submit' className='set--btn' onClick={handleFetchResetOtp}>Send Otp</button>
                        </div>
                    </>
                )}
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
    )
}

export default OTPMODAL;