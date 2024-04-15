import React from 'react';

function Footer() {
    return (
        <div>
            <div className='flex flex-row border-t-2 border-gray-400 items-start justify-between p-20 mt-10 w-full'>
                <div className='space-y-3'>
                    <h1 className='text-3xl text-center font-bold'>Join Our Newsletter</h1>
                    <p>Get exclusive access to our latest news and specials.</p>
                    <div className='flex flex-row justify-between items-center border-2 hover:border-black p-2 w-full'>
                        <input className='w-full p-2' type="text" placeholder="Enter your email address" />
                        <button className='font-bold p-2'>Subscribe</button>
                    </div>
                </div>
                <div className='flex flex-col space-y-4'>
                    <h1 className='font-bold'>Services</h1>
                    <div>
                        <p>Consulting</p>
                        <p>Sales</p>
                        <p>Support</p>
                        <p>Custom Solutions</p>
                    </div>
                </div>
                <div className='flex flex-col space-y-4'>
                    <h1 className='font-bold'>Company</h1>
                    <div>
                        <p>About Us</p>
                        <p>Careers</p>
                        <p>Press</p>
                        <p>Blog</p>
                    </div>
                </div>
                <div className='flex flex-col space-y-4'>
                    <h1 className='font-bold'>Resources</h1>
                    <div>
                        <p>FAQs</p>
                        <p>Help Center</p>
                        <p>Privacy Policy</p>
                        <p>Terms of Service</p>
                    </div>
                </div>
            </div>
            <div className='flex flex-row items-center w-screen justify-evenly text-sm py-8 bg-black text-white'>
                <p>© {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
            </div>
        </div>
    )
}

export default Footer;
