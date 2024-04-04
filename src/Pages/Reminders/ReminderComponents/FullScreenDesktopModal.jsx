import React from 'react';

import CategoryPage from '../../Marketplace/MarketComponent/MarketProducts';

function FullScreenDesktopModal({ setShouldAddProduct }) {
    return (
        <>
            <div className='full-scr-overlay' />
            <div className='full-scr-modal'>
                <CategoryPage type={'reminder'} setShouldAddProduct={setShouldAddProduct} />
            </div>
        </>
    )
}

export default FullScreenDesktopModal
