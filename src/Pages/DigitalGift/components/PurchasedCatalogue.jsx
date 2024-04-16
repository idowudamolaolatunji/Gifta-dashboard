import React, { useEffect, useState } from 'react'
import TawkToSupport from '../../../Components/TawkToSupport'
import Header from '../../Marketplace/MarketComponent/Header'
import SkelentonOne from '../../../Components/SkelentonOne';
import SkeletonLoaderMarket from '../../../Components/SkeletonLoader1';
import { BiSolidCategory } from 'react-icons/bi';
import { RiArrowRightDoubleLine } from 'react-icons/ri';
import { IoIosArrowBack } from 'react-icons/io';
import { TbGiftCard } from 'react-icons/tb';
import { numberConverter, numberConverterSticker, truncate } from '../../../utils/helper';
import { Link, useParams } from 'react-router-dom';
import SkeletonLoader from '../../../Components/SkeletonLoader';
import { useAuthContext } from '../../../Auth/context/AuthContext';
import BoughtItemModal from './BoughtItemModal';
import { BsViewStacked } from 'react-icons/bs';
import { HiOutlineRectangleStack } from 'react-icons/hi2';

function PurchasedCatalogue() {
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingCat, setIsLoadingCat] = useState(false);
    const [categories, setCategories] = useState([]);
    const [categoryItems, setCategoryItems] = useState([]);

    const [selectedItem, setSelectedItem] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [mess, setMess] = useState('');

    const { token } = useAuthContext();
    const { category } = useParams();
    const [currentCategory, setCurrentCategory] = useState(category);


    // THIS IS TO SHOW THE MODAL
    function handleShowModal(item) {
        setShowModal(true)
        setSelectedItem(item);
    }

    // THIS IS TO CLOSE MODAL
    function handleCloseModal() {
        setShowModal(false)
        setSelectedItem(null);
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


    // GET ALL THE Gift IN THAT CATEGORY
    useEffect(function () {
        async function handleFetch() {
            let url;
            if(category === 'stickers') {
                url = `${import.meta.env.VITE_SERVER_URL}/digital-stickers/my-bought-stickers`
            } else {
                url = `${import.meta.env.VITE_SERVER_URL}/digital-giftings/my-purchased-items-by-category/${currentCategory}`
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
                setCategoryItems(category === 'stickers' ? data.data.stickers : data.data.items)
                // setProducts(data.data.giftProducts)

            } catch (err) {
                setMess(err.message)
            } finally {
                setIsLoadingCat(false);
            }
        }
        handleFetch()
    }, [currentCategory]);

    console.log(categoryItems, category, currentCategory)

    return (
        <>
            <Header />

            <section className='category-page__section'>

                {isLoading ?
                    <div className="page--main">
                        <div className="category--spinner-destop">
                            <SkeletonLoader />
                        </div>
                    </div> :
                    <div className='category--page'>
                        <div className='page--sidebar'>
                            {/* <span className='tab--back' onClick={() => navigate('/')}><IoIosArrowBack /> Back</span> */}
                            <p className='category--pg-heading heading--desktop'><HiOutlineRectangleStack /> My Digital Items</p>
                            <ul>
                                {categories.map((category) =>
                                    <Link to={`/dashboard/purchased-gift/${category.categoryName}`}>
                                        <li className={`sidebar-items ${currentCategory === category.categoryName ? 'active-sidebar' : ''}`} key={category._id} onClick={() => setCurrentCategory(`${category.categoryName}`)}>
                                            {category.categoryName} {currentCategory === category.categoryName ? <RiArrowRightDoubleLine className='sidebar-icon' /> : ''}
                                        </li>
                                    </Link>
                                )}

                                <Link to={`/dashboard/purchased-gift/stickers`}>
                                    <li className={`sidebar-items ${currentCategory === 'stickers' ? 'active-sidebar' : ''}`} key={category._id} onClick={() => setCurrentCategory(`stickers`)}>
                                        Stickers {currentCategory === 'stickers' ? <RiArrowRightDoubleLine className='sidebar-icon' /> : ''}
                                    </li>
                                </Link>

                                {/* SWITCH BACK TO CATALOG PAGE */}
                                <Link to={`/dashboard/digital-gift/coupon`}>
                                    <li className={`sidebar-items sidebar--end`} key={category._id} onClick={() => setCurrentCategory(`stickers`)}>
                                        <BiSolidCategory className='sidebar-icon' /> Item Catalog
                                    </li>
                                </Link>
                            </ul>
                        </div>

                        <div className="page--tab-mobile">
                            <span className='tab-item tab--back' onClick={() => navigate('/')}><IoIosArrowBack /> Back</span>
                            {categories.map((category) =>
                                <Link to={`/dashboard/purchased-gift/${category.categoryName}`}>
                                    <p className={`tab-item ${currentCategory === category.categoryName ? 'active-tab-item' : ''}`} key={category._id} onClick={() => setCurrentCategory(`${category.categoryName}`)}>
                                        {category.categoryName}
                                    </p>
                                </Link>
                            )}

                            <Link to={`/dashboard/purchased-gift/stickers`}>
                                <p className={`tab-item ${currentCategory === 'stickers' ? 'active-tab-item' : ''}`} onClick={() => setCurrentCategory('stickers')} style={{ width: '150px' }}>
                                    Stickers
                                </p>
                            </Link>
                        </div>

                        {isLoadingCat ?
                            <div className="page--main" style={{ paddingTop: '0rem' }}>
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
                                    <img src={currentCategory !== 'stickers' ? categories?.find(cat => currentCategory === cat?.categoryName)?.categoryImage : 'https://giftdev.ru/upload/iblock/6d2/4.jpg'} alt={currentCategory} />

                                    <div>
                                        <h3 style={{ color: '#fff' }}><TbGiftCard style={{ fontSize: '2rem' }} /> Digial Items</h3>
                                        <span>{currentCategory === 'stickers' ? 'My Bought Sticker Items' : `My Bought ${currentCategory} Items`}</span>
                                    </div>
                                </span>

                                <p className='category--pg-heading heading--desktop'>Purchased Items</p>
                                <p className='category--pg-heading heading--mobile'>{currentCategory === 'stickers' ? 'Sticker Items' : `${currentCategory} Items`}</p>

                                <div className={`page--main ${categoryItems?.length > 0 ? 'page--grid' : ''}`}>
                                    {categoryItems?.length > 0 ? categoryItems.map((item) =>
                                        <figure className='product--figure' key={item._id} onClick={() => handleShowModal(item)}>
                                            <img style={currentCategory === 'stickers' ? { objectFit: 'contain' } : {}} className='product--img' src={`${import.meta.env.VITE_SERVER_ASSET_URL}/${currentCategory === 'stickers' ? `stickers/${item?.sticker?.image}` : `others/${item?.digitalGift?.image}`}`} alt={currentCategory === 'stickers' ? item?.type : item?.name} />

                                            <figcaption className='product--details'>
                                                <h4 className='product--heading'>{truncate(currentCategory === 'stickers' ? item?.stickerType : item?.digitalGift?.name, 40)}</h4>

                                                <div className='item--infos'>
                                                    {currentCategory === 'stickers' ? (
                                                        <>
                                                            <span className='item--quantity'>x {item?.balance}</span>
                                                            <span className='product--price'>₦{numberConverterSticker(item?.sticker?.price)}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className='item--quantity'>x 1</span>
                                                            <span className='product--price'>₦{numberConverter(item?.digitalGift?.price)}</span>
                                                        </>
                                                    )}
                                                </div>
                                            </figcaption>
                                        </figure>
                                    ) : (
                                        <div className='note--box'>
                                            <p>{mess || `You have no purchased ${currentCategory} item`}</p>
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

            </section>


            <TawkToSupport />


            {(selectedItem && showModal) && <BoughtItemModal item={selectedItem} handleCloseModal={handleCloseModal} category={currentCategory} />}
        </>
    )
}

export default PurchasedCatalogue
