import React from 'react'
import { useState } from 'react';
import { MdOutlineAddAPhoto } from "react-icons/md";
import { useAuthContext } from '../../../Auth/context/AuthContext';
import Alert from '../../../Components/Alert';
import GiftLoader from '../../../Assets/images/gifta-loader.gif';
import { AiFillCheckCircle, AiFillExclamationCircle } from 'react-icons/ai';

function WishlistForm({ setShowDashboardModal, setHelpReset }) {
    const [imagePreview, setImagePreview] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const timeout = 2000;

    const { token } = useAuthContext();


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
        }, timeout);
    }

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
        }
    };


    async function handleCreateWishList(e) {
        try {
            e.preventDefault();
            handleReset();
            setHelpReset(false)
            setIsLoading(true)

            const res = await fetch('http://localhost:3010/api/wishlists/create-wishlist', {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: title,
                    category
                })
            });

            if(!res.ok) throw new Error('Something went wrong!');

            const data = await res.json();
            if(data.status !== 'success') {
                throw new Error(data.message);
            }
            console.log(res, data)

            // UPLOAD IMAGE
            const formData = new FormData();
            const id = data.data.wishList._id
            handleUploadImg(formData, id)

            setIsSuccess(true);
            setMessage(data.message)
            setTimeout(() => {
                setIsSuccess(false);
                setMessage('');
                setHelpReset(true);
                handleModalClose();
            }, 2500);

        } catch(err) {
            handleFailure(err.message)
        } finally {
            setIsLoading(false)
        }
    }


    async function handleUploadImg(formData, id) {
        try {
            setIsLoading(true)
            formData.append('image', imageFile);
            const res = await fetch(`http://localhost:3010/api/wishlists/wishlist-img/${id}`, {
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

        <form className='wishlist--form form' onSubmit={(e) => handleCreateWishList(e)}>
            <div className='form--item form-image-card'>
                {!imagePreview && <p className='image-text'>Upload An Image For this Wishlist (Optional)</p>}
                <input type='file' id='form-image-input' name='image' onChange={handleImageChange} accept="image/*" />
                <label htmlFor='form-image-input' className={`${imagePreview ? 'hoverable' : ''}`} id='form-image-label'>
                    <span>
                        <MdOutlineAddAPhoto />
                        <p>Add Image</p>
                    </span>
                    {imagePreview && <img id='form-image' src={imagePreview} alt='Wishlist Preview' />}
                </label>
            </div>

            <div className='form--item'>
                <label htmlFor='form-name-input' id='form-name-label'>Title for this Wishlist (Required)</label>
                <input type='text' id='form-name-input' value={title} required onChange={(e) => setTitle(e.target.value)} placeholder='Name your wishlist' />
            </div>
            <div className='form--item'>
                <label htmlFor='form-category-input' id='form-category-label'>Category (Required)</label>
                <select type='text' id='form-category-input' value={category} required onChange={(e) => setCategory(e.target.value)} placeholder='Select a category'>
                    <option hidden>- Select a Category -</option>
                    <option value='birthday'>Birthday</option>
                    <option value='anniversary'>Anniversary</option>
                    <option value='wedding'>Wedding</option>
                    <option value='events'>Other Events</option>
                </select>
            </div>

            <div className='form--item'>
                <button type='submit' style={{ cursor: 'pointer' }}>Create List!</button>
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

export default WishlistForm;