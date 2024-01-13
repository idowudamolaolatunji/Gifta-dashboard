import React from 'react'

function ReminderModal() {
  return (
    <>
        <form className='reminder--form'>
            <span className='modal--info' style={{ marginBottom: '1rem' }}>Note that everything relating data to this wish would also be deleted including transaction history!</span>
            <div className="form--item">
                <label htmlFor="" className="form__label">Title</label>
                <input type="text" className="form__input" placeholder='Reminder title'  />
            </div>
            <div className="form--item">
                <label htmlFor="" className="form--label">Reminder Message</label>
                <textarea id="" className="form--input form--textarea" placeholder='Reminder message'></textarea>
            </div>

            <div className="reminder--flex">
                <div className="form--item">
                    <label htmlFor="form--date" className="form--label">Date</label>
                    <input type="date" id="form--date" className='form--input' />
                </div>
                <div className="form--item">
                    <label htmlFor="form--clock" className="form--label">Time</label>
                    <input type="time" id="form--date" className='form--input' />
                </div>
                <div className="form--item">
                    {/* <label htmlFor="form--" className="form--label">Head 4</label>
                    <input type="text" id="form--" className='form--input' /> */}
                    <span></span>
                </div>
            </div>
            <div className="reminder--actions">
                <button>Create</button>
                <button>Cancel</button>
            </div>
        </form> 
    </>
  )
}

export default ReminderModal
