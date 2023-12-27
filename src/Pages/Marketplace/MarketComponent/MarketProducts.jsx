import React, { useState, useEffect } from 'react'

import { RiArrowRightDoubleLine } from "react-icons/ri";
import { currencyConverter, dateConverter } from '../../../utils/helper'
import SkeletonLoader from '../../../Components/SkeletonLoader';
import SkeletonLoaderMini from '../../../Components/SkelentonLoaderMini';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Product from './Product';

function CategoryPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingCat, setIsLoadingCat] = useState(false)
    const [categories, setCategories] = useState([]);
    const [categoryProducts, setCategoryProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [mess, setMess] = useState('');
    
    const navigate = useNavigate();
    const { category } = useParams()
    const [currentCategory, setCurrentCategory] = useState(category);
    
    // THIS IS TO SHOW THE MODAL
    function handleShowModal(product) {
        setShowModal(true)
        setSelectedProduct(product)
    }

    // THIS IS TO CLOSE MODAL
    function handleCloseModal() {
        setShowModal(false)
        setSelectedProduct(null)
    }

    // RENAVIGE BACK
    useEffect(() => {
        if(!showModal) {
            navigate(`/dashboard/marketplace/${currentCategory}`)
        }
    }, [showModal]);


    // GET ALL CATEGORY FROM THE DB
    useEffect(function() {
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

                if(!res.ok) throw new Error('Something went wrong!');

                const data = await res.json();
                if(data.status !== 'success') {
                    throw new Error(data.message);
                }

                setCategories(data.data.categories);

            }catch(err) {
                console.log(err.message)
            } finally {
                setIsLoading(false)
            }
        }
        handleFetchCategories()
    }, [])



    // GET ALL THE PRODUCT IN THAT CATEGORY
    useEffect(function() {
        async function handleFetch(category) {
            try {
                setIsLoadingCat(true);
                
                const res = await fetch(`https://test.tajify.com/api/gift-products/products/category/${category}`, {
                    method: 'GET',
                    headers: { "Content-Type": "application/json", },
                });

                if(!res.ok) {
                    setMess('Something went wrong. Check Internet connection!');
                    throw new Error('Something went wrong. Check Internet connection!');
                }
                const data = await res.json();

                if(data.status !== 'success') {
                    throw new Error(data.message);
                }
                setCategoryProducts(data.data.giftProducts)

            } catch(err) {
                console.error(err.message)
            } finally {
                setIsLoadingCat(false);
            }
        }
        handleFetch(category)
    }, [category])

  return (
    <section className='category-page__section'>

        { isLoading ? <SkeletonLoader /> :
        <div className='category--page'>
            <div className='page--sidebar'>
                <ul>
                    { categories.map((category) => 
                    
                        <Link to={`/dashboard/marketplace/${category.categoryName}`}>
                            <li className={`sidebar-items ${currentCategory === category.categoryName ? 'active-sidebar' : ''}`} key={category._id} onClick={() => setCurrentCategory(`${category.categoryName}`)}>
                                {category.categoryName} {currentCategory === category.categoryName ? <RiArrowRightDoubleLine className='sidebar-icon' /> : ''}
                            </li>
                        </Link>
                    
                    )}
                </ul>
            </div>


            { isLoadingCat && <SkeletonLoaderMini />}
            { categoryProducts && categoryProducts.length !== 0 ?
            <div className='page--main page--grid'>
                { categoryProducts.map((product) => {
                    return (
                        <Link to={`/dashboard/marketplace/${currentCategory}/${product.slug}`}>
                        
                        <figure className='product--figure' key={product._id} onClick={() => handleShowModal(product)}>
                            <img className='product--img' src={product.image} alt={product.name} />
                            <figcaption className='product--details'>
                                <h4 className='product--heading'>{product.name}</h4>
                                <div className='product--vendor'>
                                    <img className='' src={product.vendor.image} alt={product.vendor.fullName} />
                                    <p>{product.vendor.fullName}</p>
                                </div>
                                <span className='product--price'>
                                    ₦{currencyConverter(product.price)}
                                </span>
                                <div className='product--infos'>
                                    <span>{dateConverter(product.createdAt)}</span>
                                    <span>{product.vendor.location || 'Nigeria'}</span>
                                </div>
                            </figcaption>
                        </figure>

                        </Link>
                    );
                })}
            </div> : (

            <div className='note--box page--main' style={{marginTop: '4rem'}}>
                <p>{mess || 'No product in this category'}</p>
                <picture>
                    <source srcset="https://fonts.gstatic.com/s/e/notoemoji/latest/1f343/512.webp" type="image/webp" />
                    <img src="https://fonts.gstatic.com/s/e/notoemoji/latest/1f343/512.gif" alt="🍃" width="32" height="32" />
                </picture>
            </div> )} 

        </div>}

        {(selectedProduct && showModal) && <Product product={selectedProduct} handleCloseModal={handleCloseModal} />}
    </section>
  )
}

export default CategoryPage
