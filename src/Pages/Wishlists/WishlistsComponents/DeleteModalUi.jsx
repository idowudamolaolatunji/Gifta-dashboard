import React from 'react'
import { useNavigate } from 'react-router-dom'

function DeleteModalUi() {

  const navigate = useNavigate();

  
  return (
    <>
        <div className='wish--overlay' onClick={() => navigate(-1)} />
        <div>Modal</div>
    </>
  )
}

export default DeleteModalUi
