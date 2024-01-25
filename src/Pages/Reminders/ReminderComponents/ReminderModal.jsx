import React, { useEffect, useState } from 'react';

import Switch from "react-switch";
import { IoIosCloudUpload } from "react-icons/io";
import { IoCheckmarkDone } from "react-icons/io5";

import GiftLoader from '../../../Assets/images/gifta-loader.gif';
import Alert from '../../../Components/Alert';
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';
import { useAuthContext } from '../../../Auth/context/AuthContext';


function ReminderModal({ setShowDashboardModal, setHelpReset }) {
    const [toggle, setToggle] = useState('just-remind');
    const [checkedEmail, setCheckedEmail] = useState(false);
    const [checkedSms, setCheckedSms] = useState(false);
    const [checkRepeat, setCheckRepeat] = useState(false);
    const [title, setTitle] = useState('');
    const [purpose, setPurpose] = useState('')
    const [imageFile, setImageFile] = useState(null);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('')
    const [contactInfo, setContactInfo] = useState('');
    const [reminderMessage, setReminderMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState('');

	const { user, token } = useAuthContext();


    const reminderDetails = {
        title, purpose, imageFile, date, time, checkedSms, checkedEmail, checkRepeat, contactInfo, reminderMessage
    }
    console.log(reminderDetails)


    function handleToggle(tab) {
        setToggle(tab);
        setCheckedEmail(false)
        setCheckedSms(false)
        setCheckRepeat(false)
    }

    function handleChangeType(next, type) {
        if(type === 'email') {
            setCheckedSms(false);
            setCheckedEmail(next);
        }
        if(type === 'sms') {
            setCheckedEmail(false);
            setCheckedSms(next);
        }
    }

    function handleUploadImage(e) {
        const file = e.target.files[0];
        setImageFile(null);
        setTimeout(function() {
            if(file) {
                setImageFile(file);
            }
        }, 2000);
    }

    function handleModalClose() {
		setShowDashboardModal(false);
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

    async function handleSetReminder(e) {
        try {
            e.preventDefault();
            setIsLoading(true);
            handleReset();
            setHelpReset(false);

            // const res = await fetch(`http://localhost:3010/api/reminders/create-reminder`, {
            const res = await fetch(`https://test.tajify.com/api/reminders/create-reminder`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    title,
                    purpose,
                    reminderDate: date,
                    reminderTime: time,
                    RepeatAllDay: checkRepeat,
                    sendMessage: toggle === 'send-message' ? true : true,
                    sendThrough: checkedEmail ? 'email' : checkedSms && 'sms' || null,
                    emailAddress: checkedEmail ? contactInfo : '',
                    phoneNumber: checkedSms ? contactInfo : '',
                    reminderMessage
                })
            });

            if(!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();
            if(data.status !== 'success') {
                throw new Error(err.message);
            }

            // UPLOAD IMAGE
            const formData = new FormData();
            const id = data.data.reminder._id;
            if(imageFile) {
                handleUploadImg(formData, id);
            }

            setIsSuccess(true);
            setMessage(data.message);
            setTimeout(() => {
                setIsSuccess(false);
                setMessage('');
                setHelpReset(true);
                handleModalClose();
            }, 2000);

        } catch(err) {
            handleFailure(err.message);
        } finally {
            setIsLoading(false)
        }
    }

    async function handleUploadImg(formData, id) {
        try {
            setIsLoading(true)
            formData.append('image', imageFile);
            const res = await fetch(`https://test.tajify.com/api/reminders/reminder-img/${id}`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: formData,
                mode: "no-cors"
            });
            if(!res.ok) throw new Error('Something went wrong!');            
        } catch(err) {
            console(err.message);
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <>

        {isLoading && (
            <div className='gifting--loader'>
                <img src={GiftLoader} alt='loader' />
            </div>
        )}

        <form className='reminder--form' onSubmit={handleSetReminder}>
            <span className='modal--info' style={{ marginBottom: '.6rem' }}>Note that everything relating data to this wish would also be deleted including transaction history!</span>
            
            <div className="reminder--flex-2-1">
                <div className="form--item">
                    <label htmlFor="form--title" className="form--label">Title</label>
                    <input type="text" id='form--title' className="form--input" placeholder='Reminder title' value={title} onChange={e => setTitle(e.target.value)} required />
                </div>

                <div className="form--item">
                    <label htmlFor="form--select" className="form--label">Purpose</label>
                    <select id='form--select' className='form--input' value={purpose} required onChange={(e) => setPurpose(e.target.value)}>
                        <option hidden>- Select a Purpose -</option>
                        <option value='birthday'>Birthday</option>
                        <option value='anniversary'>Anniversary</option>
                        <option value='wedding'>Wedding</option>
                        <option value='events'>Other Events</option>
                    </select>
                </div>
            </div>
            
            <div className="reminder--flex-3" style={toggle === 'just-remind' ? { alignItems: 'center'} : {}}>
                <div className="form--item">
                    <label htmlFor="form--date" className="form--label">Date</label>
                    <input type="date" id="form--date" className='form--input' required value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="form--item">
                    <label htmlFor="form--clock" className="form--label">Time</label>
                    <input type="time" id="form--clock" className='form--input' value={time} onChange={e => setTime(e.target.value)} required />
                </div>
                <div className="form--item form--switches">
                    {toggle === 'just-remind' && (
                        <div className="form--flexy" style={{ flexDirection: 'column', alignItems: 'flex-start'}}>
                            <label htmlFor="form--mail" className="form--label">Repeat All Day!</label>
                            <Switch
                                onChange={next => setCheckRepeat(next)}
                                checked={checkRepeat}
                                className="form--switch"
                                onColor="#bb0505"
                                handleDiameter={18}
                                height={25}
                            />
                        </div>
                    )}

                    {toggle === 'send-message' && (
                        <>
                            <div className="form--flexy">
                                <Switch
                                    onChange={next => handleChangeType(next, 'email')}
                                    checked={checkedEmail}
                                    className="form--switch"
                                    onColor="#bb0505"
                                    handleDiameter={18}
                                    height={25}
                                />
                                <label htmlFor="form--mail" className="form--label">Email</label>
                            </div>
                            <div className="form--flexy">
                                <Switch
                                    onChange={next => handleChangeType(next, 'sms')}
                                    checked={checkedSms}
                                    className="form--switch"
                                    onColor="#bb0505"
                                    handleDiameter={18}
                                    height={25}
                                />
                                <label htmlFor="form--sms" className="form--label">sms</label>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="form--item reminder--flex-2" style={{ marginBottom: '.4rem' }}>
                <span className='form--toggle'>
                    <span className={`${toggle === 'just-remind' ? 'active' : ''}`} onClick={() => handleToggle('just-remind')}>Just Remind</span>
                    <span className={`${toggle === 'send-message' ? 'active' : ''}`} onClick={() => handleToggle('send-message')}>Send Message</span>
                </span>
                <div className="form--item">
                    <label htmlFor="image" className='form--label-img form--label'><IoIosCloudUpload className='form--label-icon' style={ imageFile ? { color: '#bb0505' } : {}} /> Upload Reminder Image {imageFile ? (<IoCheckmarkDone className="form--label-icon" style={{ color: '#bb0505' }} />) : ''}</label>
                    <input type="file" id='image' className='form--input-img' name='image' accept='image/*' onChange={e => handleUploadImage(e)} />
                </div>
            </div>
            {(toggle === 'send-message' && (checkedEmail || checkedSms)) && (
                <>
                    <div className="form--item">
                        <label htmlFor="form--contact" className='form--label'>{checkedEmail ? 'Recipient Email Address' : checkedSms && 'Recipient Phone Number'}</label>
                        <input type={checkedEmail ? 'text' : 'number'} required id="form--contact" className='form--input' placeholder={checkedEmail ? 'Enter Recipient Email' : checkedSms && 'Enter Recipient Phone'} value={contactInfo} onChange={e =>setContactInfo(e.target.value)} />
                    </div>

                    <div className="form--item">
                        <label htmlFor="form--textare" className="form--label">Reminder Message</label>
                        <textarea id="form--textare" value={reminderMessage} onChange={e => setReminderMessage(e.target.value)} required className="form--input form--textarea" placeholder='Reminder message'></textarea>
                    </div>
                </>
            )}
            <div className="reminder--actions">
                <button type='button' className='cancel--btn' onClick={handleModalClose}>Cancel</button>
                <button type='submit' className='set--btn'>Set Reminder</button>
            </div>
        </form> 

        {(isSuccess || isError) && 
        <Alert alertType={`${isSuccess ? "success" : isError ? "error" : ""}`} others={true}>
            {isSuccess ? (
                <AiFillCheckCircle className="alert--icon" />
            ) : isError ? (
                <AiFillExclamationCircle className="alert--icon" />
            ) : (
                ""
            )}
            <p>{message}</p>
        </Alert>}
    </>
  )
}

export default ReminderModal
