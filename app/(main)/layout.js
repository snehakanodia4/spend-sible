import React from 'react'

const Mainlayout = ({children}) => {
  return (
    <div className='container mx-auto my-32'>
      {children }
    </div>
  )
}
// for getting dashboard, transaction and account from (main) as children
export default Mainlayout
