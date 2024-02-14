import React, { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi';
import { useAuthContext } from '../../Auth/context/AuthContext';
import { dateConverter, numberConverter } from '../../utils/helper';
import DashboardModal from '../../Components/Modal';
import { MdOutlineAddAPhoto } from 'react-icons/md';
import Header from './Components/Header';

function ProductCatalogue() {
    const [isLoading, setIsLoading] = useState(false);
    
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
	const [showProductModal, setShowProductModal] = useState(false);
    
	const [showProductInfoModal, setShowProductInfoModal] = useState(false);
    
    const { user, token } = useAuthContext();


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


    useEffect(function() {
        async function handleFetchMyProducts() {
            try {
                setIsLoading(true);

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
                setIsLoading(false);
            }
        }
        handleFetchMyProducts()
    }, [])


    return (

        <>

            <Header />

            <section className="product__section section">
                <div className="section__container">
                    <p className='section__heading' style={{ fontSize: '2.8rem', fontWeight: '500' }}>My Shop</p>


                    {products.length > 0 && (
                        <div className='page--grid'>
                            {products.map((product) =>
                                <figure className='product--figure' key={product._id} onClick={handleProduct}>
                                    <img className='product--img' src={product.image} alt={product.name} />
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
                    )}
                </div>


                <div className="dashnoard--add-btn" onClick={() => setShowProductModal(true)}><FiPlus /></div>
            </section>


            {showProductModal && (
                <DashboardModal title={'Upload a new product!'} setShowDashboardModal={setShowProductModal}>

                    <form className='form'>
                        <div className='form--item form-image-card'>
                            {!imagePreview && <p className='image-text'>Upload An Image Product</p>}
                            <input type='file' id='form-image-input' name='image' onChange={handleImageChange} accept="image/*" />
                            <label htmlFor='form-image-input' className={`${imagePreview ? 'hoverable' : ''}`} style={{ height: '20rem' }} id='form-image-label'>
                                <span>
                                    <MdOutlineAddAPhoto />
                                    <p>Add Image</p>
                                </span>
                                {imagePreview && <img id='form-image' src={imagePreview} alt='Wishlist Preview' />}
                            </label>
                        </div>

                        
                    </form>

                    
                </DashboardModal>
            )}
        </>
    )
}

export default ProductCatalogue
