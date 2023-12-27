import React from 'react';

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

function SkeletonLoader() {
  return (
    <div className="skeleton-grid">
        <Skeleton height={"14rem"} />
        <Skeleton height={"14rem"} />
        <Skeleton height={"14rem"} />
        <Skeleton height={"14rem"} />
        <Skeleton height={"14rem"} />
        <Skeleton height={"14rem"} />
        <Skeleton height={"14rem"} />
        <Skeleton height={"14rem"} />
    </div>
  )
}

export default SkeletonLoader
