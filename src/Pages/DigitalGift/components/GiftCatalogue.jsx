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

function GiftCatalogue() {
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingCat, setIsLoadingCat] = useState(false)
    const [categories, setCategories] = useState([]);
    const [categoryDigitalGifts, setCategoryDigitalGifts] = useState([]);
    const [mess, setMess] = useState('');

    const { category } = useParams();
    const [currentCategory, setCurrentCategory] = useState(category);
    console.log(category)

    const { token } = useAuthContext();
    const navigate = useNavigate();


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
    }, [])


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


    return (
        <section className='category-page__section'>

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
                                <span>{currentCategory === 'me' ? 'My Digital Giftings' : `${currentCategory} Category`}</span>
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
                </div>}
        </section>
    )
}

export default GiftCatalogue;
