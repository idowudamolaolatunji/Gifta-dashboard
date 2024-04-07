import React, { useState, useEffect } from 'react'

import { RiArrowRightDoubleLine } from "react-icons/ri";
import { numberConverter, dateConverter, truncate } from '../../../utils/helper'
import SkeletonLoader from '../../../Components/SkeletonLoader';
import SkeletonLoaderMarket from '../../../Components/SkeletonLoader1';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SkelentonOne from '../../../Components/SkelentonOne';
import { useAuthContext } from '../../../Auth/context/AuthContext';
import { IoIosArrowBack } from 'react-icons/io';
import { TbGiftCard } from 'react-icons/tb';
import DashboardModal from '../../../Components/Modal';
import { MdOutlineAddAPhoto } from 'react-icons/md';
import ReactTextareaAutosize from 'react-textarea-autosize';
import CurrencyInput from 'react-currency-input-field';
import { FiPlus } from 'react-icons/fi';
import GiftLoader from '../../../Assets/images/gifta-loader.gif';


const customStyle = {
    maxWidth: '55rem',
    minHeight: 'auto',
    height: 'auto',
    zIndex: 3500
}


function GiftCatalogue() {
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingCat, setIsLoadingCat] = useState(false);
    const [isSpinning, setIsSpinning] = useState(false);

    const [categories, setCategories] = useState([]);
    const [categoryDigitalGifts, setCategoryDigitalGifts] = useState([]);
    const [mess, setMess] = useState('');

    const [selectedItem, setSelectedItem] = useState({});
    
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [avail, setAvail] = useState(null);
    const [giftCategory, setGiftCategory] = useState('')
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [helpReset, setHelpReset] = useState(false);

    const [showOpenModal, setShowOpenModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    const { category } = useParams();
    const [currentCategory, setCurrentCategory] = useState(category);
    console.log(category)

    const { token } = useAuthContext();
    const navigate = useNavigate();


    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
        }
    };

    // HANDLE ON FETCH FAILURE
    function handleFailure(mess) {
        setIsError(true);
        setMessage(mess)
        setTimeout(() => {
            setIsError(false);
            setMessage('')
        }, 3000);
    }

    // HANDLE FETCH STATE RESET
    function handleReset() {
        setIsError(false);
        setMessage('')
        setIsSuccess(false);
    }



    // GET ALL CATEGORY FROM THE DB
    useEffect(function () {
        async function handleFetchCategories() {
            try {
                setIsLoading(true);
                setMess('');

                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/digital-giftings/all-category`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                if (!res.ok) throw new Error('Something went wrong!');

                const data = await res.json();
                if (data.status !== 'success') {
                    throw new Error(data.message);
                }

                setCategories(data.data.categories);

            } catch (err) {
                console.log(err.message)
            } finally {
                setIsLoading(false)
            }
        }
        handleFetchCategories()
    }, []);


    useEffect(function () {
        async function handleFetchMyProducts() {
            try {
                setIsLoadingCat(true);

                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/digital-giftings/my-digital-gifts`, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!res.ok) {
                    throw new Error('Something went wrong. Check Internet connection!');
                }
                const data = await res.json();

                if (data.status !== 'success') {
                    throw new Error(data.message);
                }
                setProducts(data.data.digitalGifts)
            } catch (err) {
                console.log(err)
            } finally {
                setIsLoadingCat(false);
            }
        }
        handleFetchMyProducts()
    }, [helpReset]);


    // GET ALL THE Gift IN THAT CATEGORY
    useEffect(function () {
        async function handleFetch() {
            let url;
            if(category === 'me') {
                url = `${import.meta.env.VITE_SERVER_URL}/digital-giftings/my-digital-gifts`
            } else {
                url = `${import.meta.env.VITE_SERVER_URL}/digital-giftings/digital-gifts/category/${currentCategory}`
            }
            try {
                setIsLoadingCat(true);
                setMess('')

                const res = await fetch(url, {
                    method: 'GET',
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    throw new Error('Something went wrong!');
                }
                const data = await res.json();

                if (data.status !== 'success') {
                    throw new Error(data.message);
                }
                setCategoryDigitalGifts(data.data.giftProducts)
                // setProducts(data.data.giftProducts)

            } catch (err) {
                setMess(err.message)
            } finally {
                setIsLoadingCat(false);
            }
        }
        handleFetch()
    }, [currentCategory]);


    async function handleUploadProduct(e, type) {
        let method, url;
        if (type === 'new') {
            method = 'POST';
            url = `${import.meta.env.VITE_SERVER_URL}/digital-giftings/create-digital-gift`;
            console.log(type)
        } 
        if(type === 'edit') {
            method = 'PATCH';
            url = `${import.meta.env.VITE_SERVER_URL}/digital-giftings/update-my-digital-gift/${selectedItem?._id}`;
            console.log(type)
        }
        try {
            e.preventDefault();
            handleReset();
            setHelpReset(false);
            setIsSpinning(true);

            // if(type === 'new' && !imageFile) throw new Error('Image field cannot be left empty');
            if(type === 'new' && (images?.length === 0)) throw new Error('Images cannot be left empty');

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name, description, price, category: giftCategory, stockAvail: avail })
            });

            console.log(res);
            if (!res.ok) throw new Error('Something went wrong!');
            const data = await res.json();

            console.log(data);
            if (data.status !== "success") throw new Error(data.message);

            // UPLOAD IMAGE
            const formData = new FormData();
            const id = data.data.product._id
            if (imageFile) {
                handleUploadImgs(formData, id);
            }

            setIsSuccess(true);
            setMessage(data.message);
            setTimeout(function () {
                type === 'new' ? setShowOpenModal(false) : setShowEditModal(false);
                // type === 'edit' && setShowProductInfoModal(false)
                setIsSuccess(false);
                setMessage("");
                setHelpReset(true)
            }, 2000);

        } catch (err) {
            handleFailure(err.message)
        } finally {
            setIsSpinning(false)
        }
    }


    async function handleUploadImgs(formData, id) {
        try {
            setIsSpinning(true);

            formData.append('images', imageFile);
            
            await fetch(`${import.meta.env.VITE_SERVER_URL}/digital-giftings/digital-gift-img/${id}`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: formData,
                mode: "no-cors"
            });
        } catch (err) {
            console.log(err.message);
        } finally {
            setIsSpinning(false)
        }
    }


    useEffect(function() {
        if(selectedItem && showEditModal) {
            setPrice(selectedItem?.price);
            setDescription(selectedItem?.description);
            setAvail(selectedItem?.stockAvail);
            setGiftCategory(selectedItem?.category);
            setImagePreview(`${import.meta.env.VITE_SERVER_ASSET_URL}/products/${selectedItem?.image}`);
            setName(selectedItem?.name)
        } else {
            setPrice('');
            setDescription('');
            setAvail('');
            setGiftCategory('');
            setImagePreview('');
            setName('')

        }
    }, [selectedItem, showEditModal]);



    return (
        <>
            <section className='category-page__section'>

                {isSpinning && (
                    <div className='gifting--loader'>
                        <img src={GiftLoader} alt='loader' />
                    </div>
                )}

                {isLoading ? 
                    <div className="page--main">
                        <div className="category--spinner-destop">
                            <SkeletonLoader /> 
                        </div>
                    </div> :
                    <div className='category--page'>
                        <div className='page--sidebar'>
                            <span className='tab--back' onClick={() => navigate('/')}><IoIosArrowBack /> Back</span>
                            <ul>
                                <Link to={`/dashboard/digital-gift/me`}>
                                    <li className={`sidebar-items ${currentCategory === 'me' ? 'active-sidebar' : ''}`} key={category._id} onClick={() => setCurrentCategory(`me`)}>
                                        My Digital Giftings {currentCategory === 'me' ? <RiArrowRightDoubleLine className='sidebar-icon' /> : ''}
                                    </li>
                                </Link>
                                {categories.map((category) =>
                                    <Link to={`/dashboard/digital-gift/${category.categoryName}`}>
                                        <li className={`sidebar-items ${currentCategory === category.categoryName ? 'active-sidebar' : ''}`} key={category._id} onClick={() => setCurrentCategory(`${category.categoryName}`)}>
                                            {category.categoryName} {currentCategory === category.categoryName ? <RiArrowRightDoubleLine className='sidebar-icon' /> : ''}
                                        </li>
                                    </Link>
                                )}
                            </ul>
                        </div>

                        <div className="page--tab-mobile">
                            <span className='tab-item tab--back' onClick={() => navigate('/')}><IoIosArrowBack /> Back</span>
                            <Link to={`/dashboard/digital-gift/me`}>
                                <p className={`tab-item ${currentCategory === 'me' ? 'active-tab-item' : ''}`} onClick={() => setCurrentCategory('me')} style={{ width: '150px'}}>
                                    My Digital Gifts
                                </p>
                            </Link>
                            {categories.map((category) =>
                                <Link to={`/dashboard/digital-gift/${category.categoryName}`}>
                                    <p className={`tab-item ${currentCategory === category.categoryName ? 'active-tab-item' : ''}`} key={category._id} onClick={() => setCurrentCategory(`${category.categoryName}`)}>
                                        {category.categoryName}
                                    </p>
                                </Link>
                            )}
                        </div>

                        {isLoadingCat ? 
                            <div className="page--main" style={{ paddingTop: '0rem'}}>
                                <div className='category--spinner-destop'>
                                    <SkeletonLoaderMarket />
                                </div>

                                <div className='category--spinner-mobile'>
                                    <SkelentonOne height={'18rem'} />
                                    <SkelentonOne height={'18rem'} />
                                </div>
                            </div> :
                        <div style={{ overflow: 'auto' }}>

                            <span className='category--pg-head'>
                                <img src={currentCategory !== 'me' ? categories?.find(cat => currentCategory === cat?.categoryName)?.categoryImage : 'https://images.unsplash.com/photo-1647675559000-3ca04e672688?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} alt={currentCategory} />
                                
                                <div>
                                    <h3 style={{ color: '#fff' }}><TbGiftCard style={{ fontSize: '2rem' }} /> Digial Giftings</h3>
                                    <span>{currentCategory === 'me' ? 'My Digital Items' : `${currentCategory} Category`}</span>
                                </div>
                            </span>
                        
                            <p className='category--pg-heading heading--desktop'>Recent Items</p>
                            <p className='category--pg-heading heading--mobile'>{currentCategory === 'me' ? 'My Digital Giftings' : `${currentCategory} Category`}</p>

                            <div className={`page--main ${categoryDigitalGifts?.length > 0 ? 'page--grid' : ''}`}>
                                {categoryDigitalGifts?.length > 0 ? categoryDigitalGifts.map((product) =>

                                    <figure className='product--figure' key={product._id} onClick={() => handleShowModal(product)}>
                                        <img className='product--img' src={`${import.meta.env.VITE_SERVER_ASSET_URL}/products/${product.image}`} alt={product.name} />
                                        <figcaption className='product--details'>
                                            <h4 className='product--heading'>{truncate(product.name, 40)}</h4>
                                        
                                            <div className='product--infos'>
                                                <span className='product--price'>₦{numberConverter(product.price)}</span>
                                            </div>
                                        </figcaption>
                                    </figure>
                                ) : (
                                    <div className='note--box'>
                                        <p>{mess || 'No Item in this category'}</p>
                                        <picture>
                                            <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f343/512.webp" type="image/webp" />
                                            <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f343/512.gif" alt="🍃" width="32" height="32" />
                                        </picture>
                                    </div>
                                )}
                            </div>
                        </div>}
                    </div>
                }

                {currentCategory === 'me' && <div className="dashboard--add-btn" onClick={() => setShowOpenModal(true)}><FiPlus /></div>}
                    
            </section>

            {(showOpenModal || showEditModal) && (
                <DashboardModal customStyle={customStyle} overLayZIndex={true} title={'Upload a new Digital Item!'} setShowDashboardModal={showOpenModal ? setShowOpenModal : setShowEditModal}>
                    <span className='modal--info'>Note that for everything successfully purchased digiftal item we own 5% and you own 95% of the profit</span>

                    <form className='form product--upload-form' onSubmit={(e) => handleUploadProduct(e, showEditModal ? 'edit' : 'new')}>
                        <div className="form--item">
                            <label htmlFor="" className="form--label">Item Name</label>
                            <input type="text" required className="form--input" placeholder='Enter a name' value={name} onChange={e => setName(e.target.value)} />
                        </div>
                        <div className='form--item form-image-card'>
                            {!imagePreview && <p className='image-text'>Upload Item Image (Required)</p>}
                            <input type='file' id='form-image-input' multiple max="6" name='images' onChange={handleImageChange} accept="image/*" />
                            <label htmlFor='form-image-input' className={`${imagePreview ? 'hoverable' : ''}`} style={{ height: '15rem' }} id='form-image-label'>
                                <span>
                                    <MdOutlineAddAPhoto />
                                    <p>Add Image</p>
                                </span>
                                {imagePreview && <img id='form-image' src={imagePreview} alt='Wishlist Preview' />}
                            </label>
                        </div>


                        <div className="form--item">
                            <label htmlFor="description" className="form--label">Item Description (Up to 400 Characters)</label>
                            <ReactTextareaAutosize id='description' className='form__textarea' defaultValue="" value={description} onChange={e => setDescription(e.target.value)} required maxLength={'400'} placeholder='Enter a description' />
                        </div>

                        <div className="form--grid-prod">
                            <div className="form--item">
                                <label htmlFor="category" className="form--label">Item Category</label>
                                <select id="category" required value={setGiftCategory} onChange={e => setGiftCategory(e.target.value)} className="form--input form--select">
                                    <option hidden selected>-- Select a Category --</option>
                                    {categories.map(category => (
                                        <option value={category.categoryName}>{category.categoryName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form--grid-prod-2">
                                <div className="form--item">
                                    <label htmlFor="amount" className="form--label">Item Price</label>
                                    <CurrencyInput
                                        className="form--input"
                                        id="amount"
                                        placeholder='Price'
                                        value={price}
                                        defaultValue={price}
                                        onValueChange={(value, _) => setPrice(value)}
                                        required
                                        prefix="₦ "
                                    />
                                </div>
                                <div className="form--item">
                                    <label htmlFor="stockAvail" className="form--label">Stock Avail</label>
                                    <input type="number" placeholder='Avail.' id='stockAvail' className="form--input" value={avail} onChange={e => setAvail(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="form--item">
                            <button type="submit" style={{ marginLeft: 'auto' }}>{showEditModal ? 'Edit' : 'Create'} Item</button>
                        </div>
                    </form>
                </DashboardModal>
            )}

        </>
    )
}

export default GiftCatalogue;
