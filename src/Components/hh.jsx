import React, { useEffect, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai';
import { CiUser } from "react-icons/ci";
import { FcLike } from "react-icons/fc";
import { MdOutlineComment } from "react-icons/md";
import { MdAlternateEmail } from "react-icons/md";
import { Link } from 'react-router-dom';


function HeaderSearchModal({ setShowSearchModal, message, isLoading, results }) {
    const [activeModalTab, setActiveModalTab] = useState('')
    console.log(message, isLoading, results)

    function handleCloseModal() {
        setShowSearchModal(false)
    }

    function handleActiveTab(tab) {
        setActiveModalTab(tab)
    }

    const {users, blogs, products} = results;
    console.log(users, blogs, products)

    const tabsData = [
        { tab: "user", count: results?.users?.length || 0 },
        { tab: "blog", count: results?.blogs?.length || 0 },
        { tab: "product", count: results?.products?.length || 0 },
        { tab: "others", count: 0 }
    ];
    tabsData.sort((a, b) => b.count - a.count);

    useEffect(() => {
        if (tabsData.length > 0) {
            setActiveModalTab(tabsData[0].tab);
        }
    }, [results]);

  return (
    <div className="search--modal">

        {!isLoading && <span className="modal--head">
            <p className="modal--heading">Search Result</p>
            {/* <AiOutlineClose className="modal--icon" onClick={handleCloseModal} /> */}
            <div className="modal--tabs">
                {tabsData?.map(tabData => (
                    <span
                        key={tabData.tab}
                        className={`modal--tab ${activeModalTab === tabData.tab && "tab--active"}`}
                        onClick={() => { handleActiveTab(tabData.tab) }}
                    >
                        {tabData.tab.charAt(0).toUpperCase() + tabData.tab.slice(1)}{' '}
                        ({tabData.count})
                    </span>
                ))}
            </div>
        </span>}

        <div className="modal--content">
            {message && <p className='error--text'>{message}</p>}
            {isLoading && <p className='loading--text'>Loading...</p>}

            {activeModalTab === 'user' && (
                <>
                {results && users?.length === 0 ?
                    (<div>No search Result</div>)
                    :
                    (<div className='modal--flex'>
                        {users?.map(user =>
                            (
                            <figure className='modal--figure'>
                                <img src={user.image} />
                                <Link to={`/${user._id}`}>
                                    <figcaption className='modal--details'>
                                        <p className='modal--name'>{user.fullName || user.username}</p>
                                        <p className='modal-email'><MdAlternateEmail /> {user.email}</p>
                                    </figcaption>
                                </Link>
                            </figure>
                            )
                        )}
                    </div>) 
                }
                </>
            )}
            {activeModalTab === 'blog' && (
                <>
                {results && blogs?.length === 0 ?
                    (<div>No search Result</div>)
                    :
                    (<div className='modal--flex'>
                        {blogs?.map(blog =>
                            (
                            <figure className='modal--figure'>
                                <img src={blog.image} />
                                <Link to={`/details/${blog._id}`}>
                                    <figcaption className='modal--details'>
                                        <p className='modal--name'>{blog.title}</p>
                                        <span className="modal--others">
                                            <span>
                                                <CiUser />
                                                <p>{blog.creator.username}</p>
                                            </span>
                                            <span>
                                                <FcLike />
                                                <p>{blog.likesCounts}</p>
                                            </span>
                                            <span>
                                                <MdOutlineComment />
                                                <p>{'0'}</p>
                                            </span>
                                        </span>
                                    </figcaption>
                                </Link>
                            </figure>
                            )
                        )}
                    </div>) 
                }
                </>
            )}
            {activeModalTab === 'product' && (
                <>
                {results && products?.length === 0 ?
                    (<div>No search Result</div>)
                    :
                    (<div className='modal--flex'>
                        {products?.map(product =>
                            (
                            <figure className='modal--figure'>
                                <img src={product.image} />
                                {/* <Link to={`/details/${blog._id}`}> */}
                                <figcaption className='modal--details'>
                                    <p className='modal--name'>{product.name}</p>
                                    <p className='modal-email'>{product.description}</p>
                                </figcaption>
                            </figure>
                            )
                        )}
                    </div>) 
                }
                </>
            )}
            {activeModalTab === 'others' && (
                <div>More Content Coming Soon!</div>
            )}
        </div>
    </div>
  )
}

export default HeaderSearchModal;









