import React from 'react'
import { AiOutlineClose } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom'

function DeleteModalUi({title, setShowDeleteModal, children}) {
    const navigate = useNavigate();

    function handleCloseDeleteModal() {
        setShowDeleteModal(false)
    }
    // function handleCloseDeleteModal() {
    //     if(setShowDeleteModal) {
    //         setShowDeleteModal(false)
    //     } else {
    //         navigate(-1);
    //     }
    // }

    return (
        <>
            <div className='delete--overlay' onClick={handleCloseDeleteModal} />
            <div className='delete--modal'>
                <span className="modal--head">
					<p className="modal--heading">{title}</p>
					<AiOutlineClose className="modal--icon" onClick={handleCloseDeleteModal} />
				</span>
				<div className="modal__content">{children}</div>
            </div>
        </>
    )
}

export default DeleteModalUi
