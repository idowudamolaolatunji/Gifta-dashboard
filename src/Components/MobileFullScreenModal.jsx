import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'

function MobileFullScreenModal({ title, setCloseModal, children }) {
    return (
        <figure className='mobile-modal--figure'>

            {(title || setCloseModal) && (
                <div className="resuable-modal--head">
                    {title && (<p className='notification--title'>{title}</p>)}
                    {setCloseModal && (<AiOutlineClose className='notification-close-icon' onClick={() => setCloseModal(false)} />)}
                </div>
            )}

            <div className="modal--content-box">
                {children}
            </div>
        </figure>
    )
}

export default MobileFullScreenModal
