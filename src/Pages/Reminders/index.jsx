import React, { useEffect, useState } from "react";
import DashHeader from "../DashBoard/DashboardComponents/DashHeader";
import DashTabs from "../DashBoard/DashboardComponents/DashTabs";

import ReminderImg from '../../Assets/images/props-loud-speaker.png';
import DashboardModal from "../../Components/Modal";
import ReminderModal from "./ReminderComponents/ReminderModal";
import { expectedDateFormatter } from "../../utils/helper";
import { useAuthContext } from "../../Auth/context/AuthContext";
import SkelentonFour from "../../Components/SkelentonFour";
import { RiDeleteBin5Line } from "react-icons/ri";
import Alert from "../../Components/Alert";
import { AiFillCheckCircle, AiFillExclamationCircle } from "react-icons/ai";
import GiftLoader from '../../Assets/images/gifta-loader.gif';

const customStyle = {
	minHeight: "auto",
	maxWidth: "52rem",
	width: "52rem",
};

const customStyleOthers = {
	minHeight: "auto",
	maxWidth: "44rem",
	width: "44rem",
};

function Reminders() {
	const [showDashboardModal, setShowDashboardModal] = useState(false);
	const [showCompleteModal, setShowCompleteModal] = useState(false);
	const [showPostponeModal, setShowPostponeModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
 	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingImg, setIsLoadingImg] = useState(false);
	const [reminders, setReminders] = useState([]);
	const [helpReset, setHelpReset] = useState(false);
	const [reminderId , setReminderId] = useState(null)

	const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState('');

	const [date, setDate] = useState('');
    const [time, setTime] = useState('');

	const { user, token } = useAuthContext();

	function handleResetId() {
		setReminderId(null)
	}

	function handleShowModal() {
		setShowDashboardModal(true);
	}

	function handleDeleteModal(id) {
		handleResetId();
		setShowDeleteModal(true);
		setReminderId(id);
	}
	
	function handlePostponeModal(id) {
		handleResetId();
		setShowPostponeModal(true);
		setReminderId(id);
	}
	
	function handleCompleteModal(id) {
		handleResetId();
		setShowCompleteModal(true);
		setReminderId(id);
	}

	// HANDLE FETCH STATE RESET
	function handleReset() {
        setIsError(false);
        setMessage('')
        setIsSuccess(false);
    }

    // HANDLE ON FETCH FAILURE
    function handleFailure(mess) {
        setIsError(true);
        setMessage(mess)
        setTimeout(() => {
            setIsError(false);
            setMessage('')
        }, 3000);
    }

	async function handleCompleteReminder(reminderId) {
		try {
			setIsLoadingImg(true);
			handleReset();

			const res = await fetch(`https://test.tajify.com/api/reminders/delete-my-reminder/${reminderId}`, {
				method: 'PATCH',
				headers: {
					"Comtent-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			})
			console.log(res);
			if(!res.ok) throw new Error('Something went wrong!');
			const data = await res.json();
			if(data.status !== "status") {
				throw new Error(data.message)
			}
			setIsSuccess(true);
            setMessage(data.message)
            setTimeout(() => {
                setIsSuccess(false);
                setMessage('');
                setHelpReset(true);
                setShowCompleteModal(false);
            }, 2000);
		} catch(err) {
			handleFailure(err.message);
		} finally {
			setIsLoadingImg(false);
		}
	}

	async function handleDeleteReminder(reminderId) {
		try {
			setIsLoadingImg(true);
			handleReset();

			const res = await fetch(`https://test.tajify.com/api/reminders/mark-as-completed/${reminderId}`, {
				method: 'DELETE',
				headers: {
					"Comtent-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			});
			console.log(res);
			if(!res.ok) throw new Error('Something went wrong!');
			const data = await res.json();
			if(data.status !== "status") {
				throw new Error(data.message)
			}
			setIsSuccess(true);
            setMessage(data.message)
            setTimeout(() => {
                setIsSuccess(false);
                setMessage('');
                setHelpReset(true);
                setShowDeleteModal(false);
            }, 2000);

		} catch(err) {
			handleFailure(err.message);
		} finally {
			setIsLoadingImg(false);
		}		
	}

	async function handlePostponeReminder(reminderId) {
		try {
			setIsLoadingImg(true);
			handleReset();

			const res = await fetch(`https://test.tajify.com/api/reminders/postpone-reminder/${reminderId}`, {
				method: 'PATCH',
				headers: {
					"Comtent-Type": "application/json",
					Authorization: `Bearer ${token}`,
				}
			});
			console.log(res);
			if(!res.ok) throw new Error('Something went wrong!');
			const data = await res.json();
			if(data.status !== "status") {
				throw new Error(data.message)
			}
			setIsSuccess(true);
            setMessage(data.message)
            setTimeout(() => {
                setIsSuccess(false);
                setMessage('');
                setHelpReset(true);
                setShowPostponeModal(false);
            }, 2000);
		} catch(err) {
			handleFailure(err.message);
		} finally {
			setIsLoadingImg(false);
		}
	}

	
	useEffect(function() {
		async function handleFetchReminders() {
			try {
				setIsLoading(true);
				const res = await fetch(`https://test.tajify.com/api/reminders/my-reminders`, {
					method: 'GET', 
					headers: {
						"Content-Type": 'application/json',
						Authorization: `Bearer ${token}`
					}
				});
				if(!res.ok) {
					throw new Error('Something went wrong!');
				}
				const data = await res.json();
				if(data.status !== 'success') {
					throw new Error(data.message)
				}
				setReminders(data.data.reminders)
			} catch(err) {
				console.log(err.message)
			} finally {
				setIsLoading(false)
			}
		}
		handleFetchReminders();
	}, [helpReset])


	return (
		<>
			{isLoadingImg && (
				<div className='gifting--loader'>
					<img src={GiftLoader} alt='loader' />
				</div>
			)}
			<DashHeader />
			<DashTabs />

			<section className="section reminder__section">
				<div className="section__container">
					{isLoading && (<SkelentonFour />)}

					{(reminders && reminders.length > 0) ? (
						<div className="reminder__grid">
							<button className="w-figure--btn" onClick={handleShowModal}>Set Reminder</button>
							{reminders?.map(reminder => (
								<figure key={reminder._id} className="reminder--figure">
									<p className="reminder--text">{reminder.title}.</p>
									<span className="figure--bottom">
										<span className="reminder--others">
											<span className="reminder--date">
												<p>Date</p>
												{expectedDateFormatter(`${reminder.reminderDate}`)}
											</span>
											<RiDeleteBin5Line className="reminder--delete" onClick={() => handleDeleteModal(reminder._id)} />
										</span>
										<span className="reminder--tasks">
											<span onClick={() => handleCompleteModal(reminder._id)}>Mark As Completed</span>
											<span onClick={() => handlePostponeModal(reminder._id)}>Postpone</span>
										</span>
									</span>
								</figure>
							))}
						</div>
					) : (!isLoading) && (
						<div className="reminder--banner banner">
							<h3 className="section__heading">Lift us remind you of your <span style={{ color: '#bb0505' }}>special dates!</span></h3>

							<img src={ReminderImg} alt={ReminderImg}  />
							<button type="button" onClick={handleShowModal}>Set a Reminder</button>
						</div>
					)}

				</div>
			</section>

			{showDashboardModal && (
				<DashboardModal title={'Set Reminder'} customStyle={customStyle} setShowDashboardModal={setShowDashboardModal}>
					<ReminderModal setShowDashboardModal={setShowDashboardModal} setHelpReset={setHelpReset} />
				</DashboardModal>
			)}

			{showCompleteModal && (
				<DashboardModal customStyle={customStyleOthers} title={'Mark Reminder as Completed'} setShowDashboardModal={setShowCompleteModal}>
					<p className='modal--text-2'>You want to Complete this Reminder!</p>
                	<span className='modal--info'>Note that everything relating data to this wish would also be deleted including transaction history!</span>
					<div className="reminder--actions" style={{ marginTop: '1.4rem' }}>
						<button type='button' className='cancel--btn' onClick={() => setShowCompleteModal(false)}>Cancel</button>
						<button type='submit' className='set--btn' onClick={() => handleCompleteReminder(reminderId)}>Complete Reminder</button>
					</div>
				</DashboardModal>
			)}

			{showPostponeModal && (
				<DashboardModal customStyle={customStyleOthers} title={'Postpone Reminder'} setShowDashboardModal={setShowPostponeModal}>
					<p className='modal--text-2'>Are you sure you want to postpone this reminder?</p>
                	<span className='modal--info'>Note that everything relating data to this wish would also be deleted including transaction history!</span>
					<form className="reminder--form">
						<div className="reminder--flex-2">
							<div className="form--item">
								<label htmlFor="form--date" className="form--label">Date</label>
								<input type="date" id="form--date" className='form--input' required value={date} onChange={e => setDate(e.target.value)} />
							</div>
							<div className="form--item">
								<label htmlFor="form--clock" className="form--label">Time</label>
								<input type="time" id="form--clock" className='form--input' value={time} onChange={e => setTime(e.target.value)} required />
							</div>
						</div>
						<div className="reminder--actions" style={{ marginTop: '1.4rem' }}>
							<button type='button' className='cancel--btn' onClick={() => setShowPostponeModal(false)}>Cancel</button>
							<button type='submit' className='set--btn' onClick={() => handlePostponeReminder(reminderId)}>Postpone Reminder</button>
						</div>
					</form>
				</DashboardModal>
			)}

			{showDeleteModal && (
				<DashboardModal customStyle={customStyleOthers} title={'Delete This Reminder!'} setShowDashboardModal={setShowDeleteModal}>
					<p className='modal--text'>Are you sure you want to delete this Reminder?</p>
                	<span className='modal--info'>Note that everything relating data to this reminder would also be deleted including transaction history!</span>
					<div className="reminder--actions" style={{ marginTop: '1.4rem' }}>
						<button type='button' className='cancel--btn' onClick={() => setShowDeleteModal(false)}>Cancel</button>
						<button type='submit' className='set--btn' onClick={() => handleDeleteReminder(reminderId)}>Delete</button>
					</div>
				</DashboardModal>
			)}


			{(isSuccess || isError) && (
				<Alert alertType={`${isSuccess ? "success" : isError ? "error" : ""}`} others={true}>
					{isSuccess ? (
						<AiFillCheckCircle className="alert--icon" />
					) : isError ? (
						<AiFillExclamationCircle className="alert--icon" />
					) : (
						""
					)}
					<p>{message}</p>
				</Alert>
			)}
		</>
	);
}

export default Reminders;
