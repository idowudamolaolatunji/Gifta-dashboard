import React from 'react';

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css';

function SkelentonOne() {
  return (
    <div className="skeleton--flex" style={{marginTop: '2rem'}}>
        <Skeleton height={"6rem"} width={'100%'} />
        <Skeleton height={"6rem"} width={'100%'} />
        <Skeleton height={"6rem"} width={'100%'} />
    </div>
  )
}

export default SkelentonOne;