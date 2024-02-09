import React, { useEffect, useState } from 'react'
import { RiArrowRightDoubleLine } from 'react-icons/ri';
import DashHeader from '../../DashBoard/DashboardComponents/DashHeader';
import DashTabs from '../../DashBoard/DashboardComponents/DashTabs';
import { FiPlus } from 'react-icons/fi';

function ProductCatalogue() {
    const [isLoading, setIsLoading] = useState(false)
    const [productTab, setProductTab] = useState(false);
    const [categories, setCategories] = useState([]);
    const [currentCategory, setCurrentCategory] = useState('birthday');
    const [stay, setStay] = useState(false);


    // GET ALL CATEGORY FROM THE DB
    useEffect(function () {
        async function handleFetchCategories() {
            try {
                setIsLoading(true);
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
    }, []);


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
    }, []);


    return (

        <>
            <DashHeader />
            <DashTabs />


            <section className="marketplace__section">
                <div className="section__container">
                    <section className='category-page__section'>

                        <div className='category--page'>
                            <div className='page--sidebar' style={stay ? { borderRight: 'none' } : {}}>
                                <ul className={`${stay ? 'sidebar--stay' : ''}`}>
                                    {categories.map((category) =>
                                        <li className={`sidebar-items ${currentCategory === category.categoryName ? 'active-sidebar' : ''}`} key={category._id} onClick={() => setCurrentCategory(`${category.categoryName}`)}>
                                            {category.categoryName} {currentCategory === category.categoryName ? <RiArrowRightDoubleLine className='sidebar-icon' /> : ''}
                                        </li>
                                    )}
                                </ul>
                            </div>

                            <div className="page--tab-mobile">
                                {categories.map((category) =>
                                    <p className={`tab-item ${currentCategory === category.categoryName ? 'active-tab-item' : ''}`} key={category._id} onClick={() => setCurrentCategory(`${category.categoryName}`)}>
                                        {category.categoryName}
                                    </p>
                                )}
                            </div>




                            {/*  */}



                            {/* <div className={`page--main page--grid`}>
                    {categoryProducts.length > 0 && categoryProducts.map((product) =>
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
                                    <span className='product--price'>₦{numberConverter(product.price)}</span>
                                    <span className='product--date'>{dateConverter(product.createdAt)}</span>
                                </div>
                            </figcaption>
                        </figure>
                    )}
                            </div> */}

                        </div>
                    </section>
                </div>


                <div className="dashnoard--add-btn"><FiPlus /></div>
            </section>
        </>
    )
}

export default ProductCatalogue
