import React from 'react'

function Footer() {
    return (
        <div>
            <div className='flex flex-row border-t-2 border-gray-400 items-start justify-between p-20 mt-10 w-full'>
                <div className='space-y-3'>
                    <h1 className='text-3xl text-center font-bold'>Sign Up for our newsletter</h1>
                    <h1>Be the first to get notified! about our lastes offers</h1>
                    <a className='flex flex-row justify-between items-center border-2 hover:border-black p-2  w-full' >
                        <input className='' type="text" placeholder="Enter your email" />
                        <h1 className='font-bold'>Sign Up</h1>
                    </a>
                </div>
                <div className='flex flex-col space-y-4'>
                    <h1 className='font-bold'>Lorem Ipsum</h1>
                    <div>
                        <h1>Lorem</h1>
                        <h1>Lorem</h1>
                        <h1>Lorem</h1>
                        <h1>Lorem</h1>
                    </div>
                </div>
                <div className='flex flex-col space-y-4'>
                    <h1 className='font-bold'>Lorem Ipsum</h1>
                    <div>
                        <h1>Lorem</h1>
                        <h1>Lorem</h1>
                        <h1>Lorem</h1>
                        <h1>Lorem</h1>
                    </div>
                </div>
                <div className='flex flex-col space-y-4'>
                    <h1 className='font-bold'>Lorem Ipsum</h1>
                    <div>
                        <h1>Lorem</h1>
                        <h1>Lorem</h1>
                        <h1>Lorem</h1>
                        <h1>Lorem</h1>
                    </div>
                </div>

            </div>
            <div className='flex flex-row items-center w-screen justify-evenly text-sm py-8 bg-black text-white'></div>

        </div>
    )
}

export default Footer