import React from 'react';

function Footer() {
    return (
        <div className='pt-3 mt-10 border-t-2 border-gray-400 w-screen'>
            <div className='lg:flex lg:flex-row flex-col lg:pb-8 lg:px-10 px-6 pb-4 lg:items-center items-start lg:justify-between'>
                <div className='space-y-3'>
                    <h1 className='lg:text-3xl text-xl lg:text-left text-center font-bold'>Join Our Newsletter</h1>
                    <p className='lg-w-full text-center text-wrap lg:text-left'>Get exclusive access to our latest news and specials.</p>
                    <div className='flex flex-col lg:flex-row lg:justify-start items-center lg:space-x-2 lg:w-auto mx-auto'>
                        <input className='lg:w-full w-full max-w-[300px] border-2 p-2 mb-2 lg:mb-0' type="text" placeholder="Enter your email address" />
                        <button className='font-bold p-2 bg-black text-white hover:bg-gray-800'>Subscribe</button>
                    </div>
                </div>
                <div className='flex flex-col space-y-4'>
                    <h1 className='font-bold'>Services</h1>
                    <div>
                        <p className='cursor-pointer'>Consulting</p>
                        <p className='cursor-pointer'>Sales</p>
                        <p className='cursor-pointer'>Support</p>
                        <p className='cursor-pointer'>Custom Solutions</p>
                    </div>
                </div>
                <div className='flex flex-col space-y-4'>
                    <h1 className='font-bold'>Company</h1>
                    <div>
                        <p className='cursor-pointer'>About Us</p>
                        <p className='cursor-pointer'>Careers</p>
                        <p className='cursor-pointer'>Press</p>
                        <p className='cursor-pointer'>Blog</p>
                    </div>
                </div>
                <div className='flex flex-col space-y-4'>
                    <h1 className='font-bold'>Resources</h1>
                    <div>
                        <p className='cursor-pointer'>FAQs</p>
                        <p className='cursor-pointer'>Help Center</p>
                        <p className='cursor-pointer'>Privacy Policy</p>
                        <p className='cursor-pointer'>Terms of Service</p>
                    </div>
                </div>
            </div>
            <div className='flex flex-row w-screen items-center justify-center lg:text-sm text-sm text-wrap py-8 bg-black text-white'>
                <p>© {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
            </div>
        </div>
    )
}

export default Footer;
