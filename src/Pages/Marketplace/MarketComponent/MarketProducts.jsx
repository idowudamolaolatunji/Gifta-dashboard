import React, { useState, useEffect } from 'react'

import { RiArrowRightDoubleLine } from "react-icons/ri";
import { currencyConverter, dateConverter } from '../../../utils/helper'
import SkeletonLoader from '../../../Components/SkeletonLoader';
import SkeletonLoaderMini from '../../../Components/SkelentonLoaderMini';
import { Link, useLocation, useParams } from 'react-router-dom';
import Product from './Product';
import SkelentonOne from '../../../Components/SkelentonOne';

function CategoryPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingCat, setIsLoadingCat] = useState(false)
    const [categories, setCategories] = useState([]);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [mess, setMess] = useState('');
    const [stay, setStay] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const navPath = useParams();
    const [currentCategory, setCurrentCategory] = useState(navPath.category);


    // THIS IS TO SHOW THE MODAL
    function handleShowModal(product) {
        setShowModal(true)
        setSelectedProduct(product);
    }

    // THIS IS TO CLOSE MODAL
    function handleCloseModal() {
        setShowModal(false)
        setSelectedProduct(null)
    }

    // GET ALL CATEGORY FROM THE DB
    useEffect(function () {
        async function handleFetchCategories() {
            try {
                setIsLoading(true);
                setMess('')

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
            } finally {
                setIsLoading(false)
            }
        }
        handleFetchCategories()
    }, [])


    // GET ALL THE PRODUCT IN THAT CATEGORY
    useEffect(function () {
        async function handleFetch() {
            try {
                setIsLoadingCat(true);
                setMess('')

                const res = await fetch(`https://test.tajify.com/api/gift-products/products/category/${currentCategory}`, {
                    method: 'GET',
                    headers: { "Content-Type": "application/json", },
                });

                if (!res.ok) {
                    throw new Error('Something went wrong. Check Internet connection!');
                }
                const data = await res.json();

                if (data.status !== 'success') {
                    throw new Error(data.message);
                }
                setCategoryProducts(data.data.giftProducts)

            } catch (err) {
                setMess(err.message)
            } finally {
                setIsLoadingCat(false);
            }
        }
        handleFetch()
    }, [currentCategory]);


    useEffect(function () {
        function controlNavbar() {
            if (window.scrollY > 200) {
                setStay(true)
            } else {
                setStay(false)
            }
        }
        window.addEventListener('scroll', controlNavbar)
        controlNavbar()
        return () => {
            window.removeEventListener('scroll', controlNavbar)
        }
    }, [])


    return (
        <section className='category-page__section'>
            {isLoading ? 
                <div className="category--spinner-destop">
                    <SkeletonLoader /> 
                </div> :
                <div className='category--page'>
                    <div className='page--sidebar' style={stay ? { borderRight: 'none' } : {}}>
                        <ul className={`${stay ? 'sidebar--stay' : ''}`}>
                            {categories.map((category) =>
                                <Link to={`/dashboard/marketplace/${category.categoryName}`}>
                                    <li className={`sidebar-items ${currentCategory === category.categoryName ? 'active-sidebar' : ''}`} key={category._id} onClick={() => setCurrentCategory(`${category.categoryName}`)}>
                                        {category.categoryName} {currentCategory === category.categoryName ? <RiArrowRightDoubleLine className='sidebar-icon' /> : ''}
                                    </li>
                                </Link>
                            )}
                        </ul>
                    </div>

                    <div className="page--tab-mobile">
                        {categories.map((category) =>
                            <Link to={`/dashboard/marketplace/${category.categoryName}`}>
                                <p className={`tab-item ${currentCategory === category.categoryName ? 'active-tab-item' : ''}`} key={category._id} onClick={() => setCurrentCategory(`${category.categoryName}`)}>
                                    {category.categoryName}
                                </p>
                            </Link>
                        )}
                    </div>

                    {isLoadingCat ? 
                        <>
                            <div className='category--spinner-destop'>
                                <SkeletonLoaderMini />
                            </div>

                            <div className='category--spinner-mobile'>
                                <SkelentonOne height={'18rem'} />
                                <SkelentonOne height={'18rem'} />
                            </div>
                        </> :
                    // {isLoadingCat ? <SkeletonLoaderMini /> :
                        <div className={`page--main ${categoryProducts.length > 0 ? 'page--grid' : ''}`}>
                            {console.log(categoryProducts)}
                            {categoryProducts.length > 0 ? categoryProducts.map((product) =>
                                // <Link to={`/dashboard/marketplace/${currentCategory}/${product.slug}`}>
                                <figure className='product--figure' key={product._id} onClick={() => handleShowModal(product)}>
                                    <img className='product--img' src={product.image} alt={product.name} />
                                    <figcaption className='product--details'>
                                        <h4 className='product--heading'>{product.name}</h4>
                                        <div className='product--vendor'>
                                            <img className='' src={product.vendor?.image === "" ? 'https://res.cloudinary.com/dy3bwvkeb/image/upload/v1701957741/avatar_unr3vb-removebg-preview_rhocki.png' : `https://test.tajify.com/asset/users/${product.vendor?.image}`} alt={product.vendor.fullName} />
                                            <span className='product--vendor-info'>
                                                <p>{product.vendor.fullName}</p>
                                                <span>{product.vendor.location || 'Lagos, Nigeria'}</span>
                                            </span>
                                        </div>
                                        <div className='product--infos'>
                                            <span className='product--price'>₦{currencyConverter(product.price)}</span>
                                            <span className='product--date'>{dateConverter(product.createdAt)}</span>
                                        </div>
                                    </figcaption>
                                </figure>
                                // </Link>
                            ) : (
                                <div className='note--box'>
                                    <p>{mess || 'No product in this category'}</p>
                                    <picture>
                                        <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f343/512.webp" type="image/webp" />
                                        <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f343/512.gif" alt="🍃" width="32" height="32" />
                                    </picture>
                                </div>
                            )}
                        </div>}
                </div>}

            {(selectedProduct && showModal) && <Product product={selectedProduct} handleCloseModal={handleCloseModal} />}
        </section>
    )
}

export default CategoryPage
