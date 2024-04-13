import Link from 'next/link'
import React from 'react'

interface NavbarProps {
    cartItemCount: number;
}

const Navbar = () => {

    return (
        <div className='sticky top-0  z-50 flex flex-col items-start justify-between border-b-2 border-gray-400 w-full'>
            <div className='flex flex-row items-center w-screen justify-evenly text-sm py-2 bg-black text-white'>
                <h1>USD</h1>
                <h1>Free Shipping on all Orders between 23-28</h1>
                <h1>Support</h1>
            </div>
            <div className='flex flex-row items-start bg-white justify-between p-3 px-16 w-screen'>
                <div className='flex flex-row items-center space-x-4'>
                    <Link href="/">
                        <h1 className='font-bold'>Website</h1>
                    </Link>
                    <h1>Store</h1>
                    <h1>Store</h1>
                    <h1>Store</h1>
                </div>
                <div className='flex flex-row items-center space-x-4'>
                    <a className='flex flex-row items-center space-x-2'>
                        <img className='w-5 h-5' src='/search.png' alt='hero' />
                        <h1>Search</h1>
                    </a>
                    <Link legacyBehavior href="/Cart">
                        <a className="flex items-center hover:scale-110 transform-all duration-500 space-x-2">
                            <img className="w-5 h-6" src="/cart.png" alt="Cart" />
                        </a>
                    </Link>
                    <h1>Login</h1>
                </div>
            </div>
        </div>
    )
}

export default Navbar