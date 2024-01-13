import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import SkelentonThree from '../../../Components/SkelentonThree';

function Categories() {
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    
    useEffect(function() {
        async function handleFetchCategories() {
            try {
                setIsLoading(true);

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
    
  return (
    <>
    {isLoading && (
        <>
            <SkelentonThree />
            <SkelentonThree />
        </>
    )}
    <div className='gift__categories'>
        {categories &&
            categories.map(category => {
                return (
                    <Link to={`/dashboard/marketplace/${category.categoryName}`}>
                        <figure className='category--figure' key={category._id}>
                            <img className='category--image' src={category.categoryImage} alt={category.categoryName} />
                            <div className="category--title">{category.categoryName}</div>
                        </figure>
                    </Link>
                );
            }) 
        }
    </div>
    </>
  )
}

export default Categories
