import React from 'react'
import { useState } from 'react';
import { MdOutlineAddAPhoto } from "react-icons/md";

function WishlistForm() {
    const [imagePreview, setImagePreview] = useState('');

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
        const imageUrl = URL.createObjectURL(file);
        setImagePreview(imageUrl);
        console.log(imageUrl)
        }
        console.log(file);
    };


      // FUNCTION TO UPLOAD IMAGE TO CLOUDINARY
//   const handleImage = async (e) => {
//     const file = e.target.files[0];

//     try {
//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append(
//         "upload_preset",
//         // `${import.meta.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET}`
//         "ml_default"
//       ); // Replace with your Cloudinary upload preset

//       const response = await axios.post(
//         "https://api.cloudinary.com/v1_1/dlvm6us0n/image/upload",
//         formData
//       );

//       if (response.status === 200) {
//         // Image uploaded successfully
//         const imageUrl = response.data.secure_url;
//         setImage(imageUrl);
//       } else {
//         console.error("Image upload failed:", response.data);
//       }
//     } catch (error) {
//       console.error("Error uploading image:", error);
//     }
//   };


  return (
    <form className='wishlist--form form'>

        <div className='form--item form-image-card'>
            {!imagePreview && <p className='image-text'>Upload An Image For this Wishlist (Optional)</p>}
            <input type='file' id='form-image-input' onChange={handleImageChange} accept="image/*" />
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
            <input type='text' id='form-name-input' placeholder='Name your wishlist' />
        </div>
        <div className='form--item'>
            <label htmlFor='form-name-input' id='form-name-label'>Category (Required)</label>
            <input type='text' id='form-name-input' placeholder='Select a category' />
        </div>

        <div className='form--item'>
            <button type='submit' className=''>Create List!</button>
        </div>
    </form>
  )
}

export default WishlistForm;