import React, { useEffect, useState } from 'react';

import { AiOutlineClose } from 'react-icons/ai';
import { CiUser } from "react-icons/ci";
import { MdAlternateEmail } from "react-icons/md";
import { TbListSearch } from 'react-icons/tb';
import { Link } from 'react-router-dom';
import { FaRegSquareMinus } from "react-icons/fa6";


function SearchModal({ showSearchModal, setShowSearchModal, message, isLoading, results, closeIcon }) {
    const [activeTab, setActiveTab] = useState('');
    
    console.log(message, isLoading, results)

    function handleCloseModal() {
        setShowSearchModal(false)
    }

    function handleActiveTab(tab) {
        setActiveTab(tab)
    }

    // const {giftings, reminders, wishLists, wishes, products} = results;
    const {giftings, reminders, wishLists, products} = results;

    const tabsData = [
        { tab: "giftings", count: results?.giftings?.length || 0 },
        { tab: "reminder", count: results?.reminders?.length || 0 },
        { tab: "wishlist", count: results?.wishLists?.length || 0 },
        { tab: "product", count: results?.products?.length || 0 },
        // { tab: "wishes", count: results?.wishes?.length || 0 },
    ];
    tabsData.sort((a, b) => b.count - a.count);

    useEffect(() => {
        if (tabsData.length > 0) {
            setActiveTab(tabsData[0].tab);
        }
    }, [results]);

  return (
    <div className="search--modal" style={{ zIndex: 2000000 }}>

        {!isLoading && <span className="search--head">
            <div className="search--head-top">
                <p className="search--heading">Search Result <TbListSearch style={{ fontSize: '2rem' }} /></p>
                {closeIcon && <AiOutlineClose className="search--icon" onClick={handleCloseModal} />}
            </div>
            <div className="search--tabs">
                {tabsData?.map(tabData => (
                    <span
                        key={tabData.tab}
                        className={`search--tab ${activeTab === tabData.tab && "tab--active"}`}
                        onClick={() => { handleActiveTab(tabData.tab) }}
                    >
                        {tabData.tab.charAt(0).toUpperCase() + tabData.tab.slice(1)}{' '}
                        ({tabData.count})
                    </span>
                ))}
            </div>

            <div className='search--tabs-box'>
                <div className="search--tabs search--tab-m">
                    {tabsData?.map(tabData => (
                        <span
                            key={tabData.tab}
                            className={`search--tab ${activeTab === tabData.tab && "tab--active"}`}
                            onClick={() => { handleActiveTab(tabData.tab) }}
                        >
                            {tabData.tab.charAt(0).toUpperCase() + tabData.tab.slice(1)}{' '}
                            ({tabData.count})
                        </span>
                    ))}
                </div>
            </div>
        </span>}

        <div className="search--content">
            {message && <p className='error--text'>{message}</p>}
            {isLoading && <p className='loading--text'>Loading...</p>}



            {(activeTab === 'product' && !isLoading) && (
                <>
                {results && products?.length === 0 ?
                    (<div>No search result for ({activeTab})</div>)
                    :
                    (<div className='search--flex'>
                        {products?.map(product =>
                            (
                            <Link to={`/dashboard/marketplace/${product.category}`}>
                                <figure className='search--figure'>
                                    <img src={`https://test.tajify.com/asset/products/${product.image}`} />
                                    <figcaption className='search--details'>
                                        <p className='search--name'>{product.name}</p>
                                    </figcaption>
                                </figure>
                            </Link>
                            )
                        )}
                    </div>) 
                }
                </>
            )}


            {(activeTab === 'giftings' && !isLoading) && (
                <>
                {results && giftings?.length === 0 ?
                    (<div>No search result for ({activeTab})</div>)
                    :
                    (<div className='search--flex'>
                        {giftings?.map(gifting =>
                            (
                            <figure className='search--figure'>
                                <img src={`https://test.tajify.com/asset/others/${gifting.image}`} />
                                <figcaption className='search--details'>
                                    <p className='search--name'>{gifting.name}</p>
                                </figcaption>
                            </figure>
                            )
                        )}
                    </div>) 
                }
                </>
            )}


            {(activeTab === 'reminder' && !isLoading) && (
                <>
                {results && reminders?.length === 0 ?
                    (<div>No search result for ({activeTab})</div>)
                    :
                    (<div className='search--flex'>
                        {reminders?.map(reminder =>
                            (
                            <Link to={'/dashboard/reminders'} style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '1.6rem 1rem', borderBottom: '1.2px solid #eee' }}>
                                <FaRegSquareMinus />
                                <p className='search--name'>{reminder.title}</p>
                                {/* <figure className='search--figure'> */}
                                    {/* <img src={`https://test.tajify.com/asset/others/${reminder?.image}`} /> */}
                                    {/* <figcaption className='search--details'></figcaption> */}
                                {/* </figure> */}
                            </Link>
                            )
                        )}
                    </div>) 
                }
                </>
            )}


            {(activeTab === 'wishlist' && !isLoading) && (
                <>
                {results && wishLists?.length === 0 ?
                    (<div>No search result for ({activeTab})</div>)
                    :
                    (<div className='search--flex'>
                        {wishLists?.map(wishlist =>
                            (
                            <Link to={`/dashboard/wishlists/${wishlist?.slug}`}>
                                <figure className='search--figure'>
                                    <img src={`https://test.tajify.com/asset/others/${wishlist?.image}`} alt={wishlist._id} />
                                    <figcaption className='search--details'>
                                        <p className='search--name'>{wishlist.name}</p>
                                        <div className="">

                                        </div>
                                    </figcaption>
                                </figure>
                            </Link>
                            )
                        )}
                    </div>) 
                }
                </>
            )}


            {/* {(activeTab === 'wishes' && !isLoading) && (
                <>
                {results && wishes?.length === 0 ?
                    (<div>No search result for ({activeTab})</div>)
                    :
                    (<div className='search--flex'>
                        {wishes?.map(wishItem =>
                            (
                            <figure className='search--figure'>
                                <img src={wishItem.image} />
                                <figcaption className='search--details'>
                                    <p className='search--name'>{wishItem.name}</p>
                                </figcaption>
                            </figure>
                            )
                        )}
                    </div>) 
                }
                </>
            )} */}
           
        </div>
    </div>
  );
}

export default SearchModal
