import React, { useEffect, useState } from 'react'
import TawkToSupport from '../../../Components/TawkToSupport'
import Header from '../../Marketplace/MarketComponent/Header'
import SkelentonOne from '../../../Components/SkelentonOne';
import SkeletonLoaderMarket from '../../../Components/SkeletonLoaderMini2';
import { BiSolidCategory } from 'react-icons/bi';
import { RiArrowRightDoubleLine } from 'react-icons/ri';
import { IoIosArrowBack } from 'react-icons/io';
import { TbGiftCard } from 'react-icons/tb';
import { numberConverter, numberConverterSticker, truncate } from '../../../utils/helper';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import SkeletonLoader from '../../../Components/SkeletonLoader';
import { useAuthContext } from '../../../Auth/context/AuthContext';
import BoughtItemModal from './BoughtItemModal';
import { BsViewStacked } from 'react-icons/bs';
import { HiOutlineRectangleStack } from 'react-icons/hi2';
import { HiTemplate } from "react-icons/hi";
import RedeemItemModal from './RedeemItemModal';


function PurchasedCatalogue() {
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingCat, setIsLoadingCat] = useState(true);
    const [categories, setCategories] = useState([]);
    const [categoryItems, setCategoryItems] = useState([]);

    const [selectedItem, setSelectedItem] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [mess, setMess] = useState('');
    const [helpReset, setHelpReset] = useState(false)

    const { token } = useAuthContext();
    const { category } = useParams();
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const [tab, setTab] = useState('purchased')
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

    function handleSwitch(tab) {
        if(tab === 'purchased') {
            navigate(`/dashboard/purchased-gift/${currentCategory}`);
            setTab(tab)
        }
        if (tab === 'gifted') {
            // navigate(`/dashboard/gifted-gift/${currentCategory}`);
            setCurrentCategory('stickers')
            navigate(`/dashboard/gifted-gift/stickers`);
            setTab(tab)
        }
    }

    useEffect(function() {
        if(pathname.includes('/purchased-')) {
            setTab('purchased');
        } 
        if(pathname.includes('/gifted-')) {
            setTab('gifted');
        }
    }, [tab]);

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
            if(tab === 'purchased') {
                if(category === 'stickers') {
                    url = `${import.meta.env.VITE_SERVER_URL}/digital-stickers/my-bought-stickers`
                } else {
                    url = `${import.meta.env.VITE_SERVER_URL}/digital-giftings/my-purchased-items-by-category/${currentCategory}`
                }
            } else {
                if(category === 'stickers') {
                    url = `${import.meta.env.VITE_SERVER_URL}/digital-stickers/my-gift-stickers`
                }
            }
            try {
                setCategoryItems([])
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


                if(tab === 'purchased' && category === 'stickers') {
                    setCategoryItems(data.data.stickers)
                } else {
                    setCategoryItems(data.data.items);
                }
                if(tab === 'gifted' && category === 'stickers') {
                    setCategoryItems(data.data.gifts)
                }

            } catch (err) {
                setMess(err.message)
            } finally {
                setIsLoadingCat(false);
            }
        }
        handleFetch()
    }, [currentCategory, tab, helpReset]);

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
                    <div className='category--page item--page'>
                        <div className='page--sidebar'>
                            <div className="side-bar-top-item">
                                <span className="side-bar-top-tabs">
                                    <span className={`side-bar-tab ${tab === 'purchased' ? 'side-bar-active' : ''}`} onClick={() => handleSwitch('purchased')}>Purchased</span>

                                    <span className={`side-bar-tab ${tab === 'gifted' ? 'side-bar-active' : ''}`} onClick={() => handleSwitch('gifted')}>Gifted</span>
                                </span>
                            </div>
                            <ul>
                                {tab === 'purchased' && categories.map((category) =>
                                    <Link to={`/dashboard/purchased-gift/${category.categoryName}`}>
                                        <li className={`sidebar-items ${currentCategory === category.categoryName ? 'active-sidebar' : ''}`} key={category._id} onClick={() => setCurrentCategory(`${category.categoryName}`)}>
                                            {category.categoryName} {currentCategory === category.categoryName ? <RiArrowRightDoubleLine className='sidebar-icon' /> : ''}
                                        </li>
                                    </Link>
                                )}

                                <Link to={`/dashboard/${tab === 'purchased' ? 'purchased' : 'gifted'}-gift/stickers`}>
                                    <li className={`sidebar-items ${currentCategory === 'stickers' ? 'active-sidebar' : ''}`} key={category._id} onClick={() => setCurrentCategory(`stickers`)}>
                                        Stickers {currentCategory === 'stickers' ? <RiArrowRightDoubleLine className='sidebar-icon' /> : ''}
                                    </li>
                                </Link>

                                {/* SWITCH BACK TO CATALOG PAGE */}
                                <Link to={`/dashboard/digital-gift/${currentCategory}`}>
                                    <li className={`tab--back item--back`} key={category._id} onClick={() => setCurrentCategory(`stickers`)}>
                                        <HiTemplate className='sidebar-icon' /> Digital Item
                                    </li>
                                </Link>
                            </ul>
                        </div>

                        <div className="page--tab-mobile item--tab">
                            <span className='tab-item tab--back' onClick={() => navigate('/')}><IoIosArrowBack /> Back</span>
                            {categories.map((category) =>
                                <Link to={`/dashboard/purchased-gift/${category.categoryName}`}>
                                    <p className={`tab-item ${currentCategory === category.categoryName ? 'active-tab-item' : ''}`} key={category._id} onClick={() => setCurrentCategory(`${category.categoryName}`)}>
                                        {category.categoryName}
                                    </p>
                                </Link>
                            )}

                            <Link to={`/dashboard/purchased-gift/stickers`}>
                                <p className={`tab-item ${currentCategory === 'stickers' ? 'active-tab-item' : ''}`} onClick={() => setCurrentCategory('stickers')}>
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

                                {/* <span className='category--pg-head'>
                                    <img src={currentCategory !== 'stickers' ? categories?.find(cat => currentCategory === cat?.categoryName)?.categoryImage : 'https://giftdev.ru/upload/iblock/6d2/4.jpg'} alt={currentCategory} />

                                    <div>
                                        <h3 style={{ color: '#fff' }}><TbGiftCard style={{ fontSize: '2rem' }} /> Digial Items</h3>
                                        <span>{currentCategory === 'stickers' ? 'My Bought Sticker Items' : `My Bought ${currentCategory} Items`}</span>
                                    </div>
                                </span> */}

                                <p className='category--pg-heading item--d-heading heading--desktop'>{tab === 'purchased' ? 'Purchased' : 'Gifted'} Items</p>
                                <p className='category--pg-heading heading--mobile'>{currentCategory === 'stickers' ? 'Sticker Items' : `${currentCategory} Items`}</p>

                                <div className={`page--main ${categoryItems?.length > 0 ? 'page--grid' : ''}`}>
                                    {categoryItems?.length > 0 ? categoryItems.map((item) =>
                                        <figure className='product--figure item--figure' key={item._id}>
                                            <img style={currentCategory === 'stickers' ? { objectFit: 'contain' } : {}} className='product--img' src={`${import.meta.env.VITE_SERVER_ASSET_URL}/${currentCategory === 'stickers' ? `stickers/${item?.sticker?.image}` : `others/${item?.digitalGift?.image}`}`} alt={currentCategory === 'stickers' ? item?.type : item?.name} />

                                            <figcaption className='product--details'>
                                                <h4 className='product--heading'>{truncate(currentCategory === 'stickers' ? `${tab === 'purchased' ? 'Owned' : 'Gifted'} ${item?.stickerType}${item?.balance > 1 ? 's' : ''}` : item?.digitalGift?.name, 40)}</h4>

                                                <div className='item--infos'>
                                                    {currentCategory === 'stickers' ? (
                                                        <>
                                                            {tab === 'purchased' && (
                                                                <span className='product--price'>₦{numberConverterSticker(item?.sticker?.price)}</span>
                                                            )}

                                                            {tab === 'gifted' && (
                                                                <span className='expiry-date'>Quantity Given:</span>
                                                            )}
                                                            <span className='item--quantity'>x {item?.balance}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className='item--quantity'>x 1</span>
                                                            <span className='product--price'>₦{numberConverter(item?.digitalGift?.price)}</span>
                                                        </>
                                                    )}
                                                </div>

                                            </figcaption>
                                            <button onClick={() => handleShowModal(item)} className='item-gift-btn'>{(currentCategory === 'stickers') ? `${tab === 'gifted' ? 'Redeem' : 'Gift'} Sticker` : 'Open Item'}</button>
                                        </figure>
                                    ) : (
                                        <div className='note--box' style={{ margin: '0 auto' }}>
                                            <p>{mess || `You have no ${tab === 'gifted' ? 'gifted' : 'purchased'} ${currentCategory} item`}</p>
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


            {(selectedItem && showModal && tab === 'purchased') && <BoughtItemModal item={selectedItem} handleCloseModal={handleCloseModal} category={currentCategory} setHelpReset={setHelpReset} />}
            {(selectedItem && showModal && tab === 'gifted') && <RedeemItemModal item={selectedItem} handleCloseModal={handleCloseModal} category={currentCategory} setHelpReset={setHelpReset} />}
        </>
    )
}

export default PurchasedCatalogue
