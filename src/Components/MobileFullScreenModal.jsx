import React from 'react'
import { AiOutlineClose } from 'react-icons/ai'

function MobileFullScreenModal({ title, setCloseModal, children }) {
  return (
    <figure className='mobile-modal--figure'>
        <p className='notification--title'>{title}</p>
        <AiOutlineClose className='notification-close-icon' onClick={() => setCloseModal(false)} />
        <div className="modal--content-box">
            {children}
        </div>
    </figure>
  )
}

export default MobileFullScreenModal
