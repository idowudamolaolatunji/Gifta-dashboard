import React from 'react'
import { AiOutlineClose } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom'

function DeleteModalUi({title, children}) {
    const navigate = useNavigate();

    return (
        <>
            <div className='delete--overlay' onClick={() => navigate(-1)} />
            <div className='delete--modal'>
                <span className="modal--head">
					<p className="modal--heading">{title}</p>
					<AiOutlineClose className="modal--icon" onClick={() => navigate(-1)} />
				</span>
				<div className="modal__content">{children}</div>
            </div>
        </>
    )
}

export default DeleteModalUi
