import React from 'react'

const Navbar = () => {
  return (
    <nav className='flex justify-center items-center my-1 select-none cursor-pointer'>
      <div className="nav-logo flex justify-center items-center">
        <img className='h-[50px]' src="https://upload.wikimedia.org/wikipedia/commons/5/5e/WhatsApp_icon.png" alt="logo" />
        <span className='text-xl font-semibold text-green-500'>WhatsApp</span>
      </div>
    </nav>
  )
}

export default Navbar
