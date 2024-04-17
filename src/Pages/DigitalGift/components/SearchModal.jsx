import React, { useState } from 'react'
import { getInitials } from '../../../utils/helper'


function Loading() {
    return <p style={{ fontSize: '1.2rem' }}>Loading...</p>
}


function SearchModal({ results, errMessage, isLoading, setSelectedUser, setShowSearchModal, setQuerySomeOne }) {

    function handleSelectUser(user) {
        setSelectedUser(user);
        setShowSearchModal(false);
        setQuerySomeOne(user?.username)
    }
  return (
    <div className='item-user-search-modal'>
        {errMessage && (
            <p className='error--text'>{errMessage}</p>
        )}

        {isLoading && (
            <Loading />
        )}

        {results && (
            results.map(result => {
                return (
                    <div className='item-user-result' onClick={() => handleSelectUser(result)}>
                        {result?.image ? (
                            <img src={`${import.meta.env.VITE_SERVER_ASSET_URL}/users/${result?.image}`} alt="" />
                        ) : (
                            <span className="item-user-result-initials">
                                {getInitials(result?.fullName || result?.username)}
                            </span>
                        )}
                        <span>
                            <p>{result?.fullName}</p>
                            <p>@{result?.username}</p>
                        </span>
                    </div>
                )
            })
        )}
    </div>
  )
}

export default SearchModal
