import React, { useState } from 'react'
import { FiUploadCloud } from 'react-icons/fi';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import { SlCloudUpload } from "react-icons/sl";


function KycForm() {
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const [docType, setDocType] = useState('');
    const [docNumber, setDocNumber] = useState(null)

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

    // IMAGE PREVIEW FUNCTION
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file)
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
        }
    };


    return (
        <form className='form kyc--form'>
            <div className="form--grid-kyc">
                <div className='form--item form-image-card'>
                    <input type='file' id='form-image-input' name='image' onChange={handleImageChange} accept="image/*" />
                    <label htmlFor='form-image-input' className={`${imagePreview ? 'hoverable' : ''}`} id='form-image-label'>
                        <span className='text--box' style={{ display: 'flex', flexDirection: 'column'}}>
                            <MdOutlineAddPhotoAlternate style={{ fontSize: '2rem', color: '#555'}} />
                            <p>Upload A selfie</p>
                        </span>
                        {imagePreview && <img id='form-im className="form-title"age' src={imagePreview} alt='Preview' />}
                    </label>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    <div className="form--item">
                        <label htmlFor="address" className="form--label">Home Address</label>
                        <input type="text" id="address" className='form--input' placeholder='5th street, Japan road' />
                    </div>
                    <div className="form--item">
                        <label htmlFor="phone" className="form--label">Phone Number</label>
                        <input type="number" id="phone" className='form--input' placeholder='+2349051623480' />
                    </div>
                    {/* <div className="form--item">
                        <label htmlFor="dob" className="form--label">Date of Birth</label>
                        <input type="date" id="dob" className='form--input' placeholder='Phone Number' max={'2010-01-01'} />
                    </div> */}
                    <div className="form--item">
                        <label htmlFor="country" className="form--label">Country</label>
                        <select className='form__select' id="country">
                            <option hidden selected>--Select a Country--</option>
                            <option value='nigeria'>Nigeria</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="form--flex">
                <div className="form--item">
                    <label htmlFor="doc-type" className="form--label">Document Type</label>
                    <select className='form__select' value={docType} onChange={e => setDocType(e.target.value)} id="doc-type">
                        <option hidden selected>--Select a Document Type--</option>
                        <option value='id-card'>National ID Card</option>
                        <option value='driver-license'>Drivers Lisence</option>
                    </select>
                </div>

                <div className="form--item">
                    <label htmlFor="doc-number" className="form--label">{docType === 'id-card' ? 'National Id Card Number' : docType === 'driver-license' ? 'Driver\s License Number' : 'Document Number'}</label>
                    <input type="number" id="doc-number" className='form--input' placeholder='7382990134468' value={docNumber} onChange={e => setDocNumber(e.target.value)} />
                </div>
            </div>

            <div className="form--item doc--grid">
                <div className='form--item form-image-card'>
                    <label htmlFor='form-image-input-1' id='form-image-label'>
                        <span className='text--box'>
                            <SlCloudUpload style={{ fontSize: '2.4rem', color: '#444'}} />
                            <p className="form-title">Front side of your document</p>
                            <p className='form-text'>Uplaod the front side of your document <br /> Support PNG, JPG, PDF</p>
                            <input type='file' id='form-image-input-1' name='image' onChange={handleImageChange} accept="image/*" /> 
                        </span>
                    </label>
                </div>


                <div className='form--item form-image-card'>
                    <label htmlFor='form-image-input-2' id='form-image-label'>
                        <span className='text--box'>
                            <SlCloudUpload style={{ fontSize: '2.4rem', color: '#444'}} />
                            <p className="form-title">Back side of your document</p>
                            <p className='form-text'>Uplaod the front side of your document <br /> Support PNG, JPG, PDF</p>
                            {/* <button type="button">Choose a file</button> */}
                            <input type='file' id='form-image-input-2' name='image' onChange={handleImageChange} accept="image/*" />
                        </span>
                    </label>
                </div>
            </div>

            <div className="form--item">
                <span id='form-check'>
                    <input type="checkbox" id="form--checkbox" />
                    <label htmlFor="form--checkbox" className='form--label'>I confirm that I uploaded Goverment-issued ID photo. Including Picture, Telephone, Address and DOB</label>
                </span>
            </div>

            <div className="form--item">
                <button type="submit" className='form--submit'>Continue</button>
            </div>
        </form>
    )
}

export default KycForm
