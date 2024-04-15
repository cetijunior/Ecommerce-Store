/* eslint-disable @next/next/no-img-element */
import React from 'react'



function Categories() {

    const categories = [
        { title: "Cate", imgSrc: "/category.png" },
        { title: "Cate", imgSrc: "/category.png" },
        { title: "Cate", imgSrc: "/category.png" },
        // Add more categories as needed
    ];

    return (
        <div className='h-full screen'>
            <div className='flex flex-col items-center justify-center space-y-5'>
                <h1 className='text-5xl font-semibold pt-16'>
                    Categories
                </h1>
                <h1 className='w-[450px] text-center opacity-80'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </h1>
                <button className='border-2 border-black py-2 px-12 font-semibold '>Shop All</button>
            </div>

            <div className='flex flex-wrap justify-center items-center space-x-4 mt-10'>
                {categories.map((category, index) => (
                    <div key={index} className='flex flex-col items-center space-y-2'>
                        <img className='w-72' src={category.imgSrc} alt={category.title} />
                        <h2 className='text-xl font-bold'>{category.title}</h2>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Categories