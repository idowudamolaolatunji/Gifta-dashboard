import React, { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi';
import { useAuthContext } from '../../Auth/context/AuthContext';
import { dateConverter, expectedDateFormatter, numberConverter } from '../../utils/helper';
import DashboardModal from '../../Components/Modal';
import { MdDelete, MdOutlineAddAPhoto, MdOutlineEditNote } from 'react-icons/md';
import Header from './Components/Header';
import CurrencyInput from 'react-currency-input-field';
import ReactTextareaAutosize from 'react-textarea-autosize';
import MobileFullScreenModal from '../../Components/MobileFullScreenModal';
import { CiCalendar } from 'react-icons/ci';
import { IoLocationSharp } from 'react-icons/io5';

import { FaLongArrowAltLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import SkeletonLoaderMini from '../../Components/SkelentonLoaderMini';
import SkelentonOne from '../../Components/SkelentonOne';
import SkeletonLoader from '../../Components/SkeletonLoader';


const customStyle = {
    maxWidth: '55rem',
    height: 'auto'
}

function ProductCatalogue() {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true)
    
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
	const [showProductModal, setShowProductModal] = useState(false);

    const [categories, setCategories] = useState([]);
    
	const [showProductInfoModal, setShowProductInfoModal] = useState(false);

    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('')
    
    const { user, token } = useAuthContext();
    const navigate = useNavigate();


    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImageFile(file);
            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
        }
    };


	function handleProduct(product) {
		setShowProductInfoModal(true);
		setSelectedProduct(product);
	}

    // GET ALL CATEGORY FROM THE DB
    useEffect(function () {
        async function handleFetchCategories() {
            try {

                const res = await fetch('https://test.tajify.com/api/gift-products/all-category', {
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
            } 
        }
        handleFetchCategories()
    }, [])


    useEffect(function() {
        async function handleFetchMyProducts() {
            try {
                setIsFetching(true);

                const res = await fetch(`https://test.tajify.com/api/gift-products/my-products`, {
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
                setProducts(data.data.giftProducts)
            } catch (err) {
                console.log(err)
            } finally {
                setIsFetching(false);
            }
        }
        handleFetchMyProducts()
    }, [])


    return (

        <>

            <Header />

            <section className="product__section section">
                <div className="section__container">
                    <div className="section--head">
                        <span onClick={() => navigate(-1)} className='wishlist--back-btn'>Back</span>

                        <p className='section__heading' style={{ fontSize: '2.8rem', fontWeight: '500' }}>My Shop</p>
                    </div>


                    {(isFetching) && (
                        <>
                            <div className='category--spinner-destop'>
                                <SkeletonLoader  />
                            </div>

                            <div className='category--spinner-mobile'>
                                <SkelentonOne height={'18rem'} />
                                <SkelentonOne height={'18rem'} />
                            </div>
                        </>
                    )}


                    {products && products.length > 0 ? (
                        <div className='page--grid'>
                            {products.map((product) =>
                                <figure className='product--figure' style={{ position: 'relative' }} key={product._id} onClick={() => handleProduct(product)}>
                                    <img className='product--img' src={product.image} alt={product.name} />
                                    <span className="package--category">{product.category}</span>
                                    <figcaption className='product--details'>
                                        <h4 className='product--heading'>{product.name}</h4>
                                        <div className='product--infos'>
                                            <span className='product--price'>₦{numberConverter(product. price)}</span>
                                            <span className='product--date'>{dateConverter(product.createdAt)}</span>
                                        </div>
                                    </figcaption>
                                </figure>
                            )}
                        </div>
                    ) : (
                        <div className='note--box'>
                            <p>{'You have no product'}</p>
                        </div>
                    )}
                </div>


                <div className="dashnoard--add-btn" onClick={() => setShowProductModal(true)}><FiPlus /></div>
            </section>


            {showProductModal && (
                <DashboardModal customStyle={customStyle} title={'Upload a new product!'} setShowDashboardModal={setShowProductModal}>
                    <span className='modal--info'>Note that for everything successfully purchased products we own 5% and you own 95% of the profit</span>
                    
                    <form className='form product--upload-form'>
                        <div className="form--item">
                            <label htmlFor="" className="form--label">Product Name</label>
                            <input type="text" className="form--input" placeholder='Enter your product name' />
                        </div>
                        <div className='form--item form-image-card'>
                            {!imagePreview && <p className='image-text'>Upload Product Image</p>}
                            <input type='file' id='form-image-input' name='image' onChange={handleImageChange} accept="image/*" />
                            <label htmlFor='form-image-input' className={`${imagePreview ? 'hoverable' : ''}`} style={{ height: '15rem' }} id='form-image-label'>
                                <span>
                                    <MdOutlineAddAPhoto />
                                    <p>Add Image</p>
                                </span>
                                {imagePreview && <img id='form-image' src={imagePreview} alt='Wishlist Preview' />}
                            </label>
                        </div>

                        <div className="form--item">
                            <label htmlFor="description" className="form--label">Product Description (Up to 400 Characters)</label>
                            <ReactTextareaAutosize id='description' className='form__textarea' defaultValue="Enter a description" value={description} onChange={e => setDescription(e.target.value)} maxLength={'400'} placeholder='Enter product description' />
                        </div>

                        <div className="form--grid">
                            <div className="form--item">
                                <label htmlFor="category" className="form--label">Product Category</label>
                                <select id="category" className="form--input form--select">
                                    <option hidden selected>-- Select a category --</option>
                                    {categories.map(category => (
                                        <option value={category.categoryName}>{category.categoryName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form--item">
                                <label htmlFor="amount" className="form--label">Product Price</label>
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
                                <input type="number" placeholder='Avail.' id='stockAvail' className="form--input" />
                            </div>
                        </div>

                        <div className="form--item">
                            <button type="submit" style={{ marginLeft: 'auto' }}>Create Product</button>
                        </div>


                        
                    </form>

                    
                </DashboardModal>
            )}

            {showProductInfoModal && (
                <MobileFullScreenModal title={selectedProduct?.name} setCloseModal={setShowProductInfoModal}>
                    <div className="gift--preview-top">
                        <img src={selectedProduct?.image} />
                        <div className="gift--preview-details">
                            <p className="gift--preview-name">For {selectedProduct?.name}</p>
                            <p className="gift--preview-date">
                                <CiCalendar />
                                {dateConverter(selectedProduct?.createdAt)}
                            </p>
                        </div>
                    </div>

                    <div className="gift--preview-bottom">
                        
                        <span className="gift--preview-title"> Your Location <IoLocationSharp style={{ color: '#bb0505' }} /></span>
                        <p style={{ fontSize: '1.4rem' }}>{selectedProduct?.vendor.address}</p>
                        
                        
                        <div className="gift--preview-actions">
                            <span>Edit Product <MdOutlineEditNote style={{ fontSize: '1.8rem' }} /></span>
                            <span>Delete Product<MdDelete style={{ fontSize: '1.8rem' }} /></span>
                        </div>
                    </div>

                </MobileFullScreenModal>
            )}

        </>
    )
}

export default ProductCatalogue
