import React from 'react'

function ProgressBar({ progress }) {
  const progessNum = Number(progress.slice(0, -1));

  return (
    <div className='progress--bar'>
      <div className='progress' style={{ width: progress}}>
        <div className="progress--text"  style={progessNum === 0 ? {transform: 'translateX(10%)', color: '#555'} : progessNum <= 12 ? {transform: 'translateX(120%)', color: '#555'} : {paddingRight: '5%', justifyContent: 'flex-end'}}>{progress}</div>
      </div>
      <div className="progress--figure">Accumulated: <p>{progress}</p></div>
    </div>
  )
}

export default ProgressBar
