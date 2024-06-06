/* eslint-disable @next/next/no-img-element */
import '@/styles/globals.css'

import { ProductDoc } from '@/models/Product';
import { useRouter } from 'next/navigation';
import { useUser, UserProfile } from '@clerk/clerk-react';
import React, { useEffect, useState, useRef } from 'react';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    inStock: boolean;
}

interface ProductsProps {
    products: Product[];
    openItem: (id: string) => void;
}

const Products = () => {

    const [dataItems, setDataItems] = useState<ProductDoc[]>([]);
    const [cartItems, setCartItems] = useState<ProductDoc[]>([]);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user } = useUser();
    const isLoggedIn = Boolean(user)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/SampleData");
                if (!res.ok) throw new Error("Data could not be fetched");
                const data: ProductDoc[] = await res.json();
                setDataItems(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);


    const openItem = (id: string) => {
        if (!isLoggedIn) {
            alert("You need to be logged in to open the item Cards",)
            console.log(user);
            return;
        }
        router.push(`/products/${id}`);
    };


    const addToCart = (item: ProductDoc) => {
        // Check if the item is not empty
        if (item) {
            // Retrieve existing items from localStorage
            const existingItemsString = localStorage.getItem('cartItems');
            const existingItems = existingItemsString ? JSON.parse(existingItemsString) : [];

            // Update the cartItems state to include the new item
            setCartItems(prevItems => {
                const updatedCartItems = [...prevItems, item];

                // Serialize only the necessary properties of the new item
                const serializedItem = {
                    id: item.id, // Assuming 'id' is the unique identifier of the product
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    imageUrl: item.imageUrl
                    // Add other necessary properties as needed
                };

                // Combine the new item with the existing items
                const newItems = [...existingItems, serializedItem];

                // Update localStorage with the combined items
                localStorage.setItem('cartItems', JSON.stringify(newItems));

                return updatedCartItems;
            });
        }
    };


        return (
            <div className="h-full flex flex-col items-center space-y-8 justify-evenly">
                <div className='flex flex-col items-center space-y-5'>
                    <h1 className='text-4xl font-semibold pt-20'>
                        Our Products
                    </h1>
                    <h1 className="max-w-[450px] text-center opacity-80">
                        Explore our full selections of products<br />
                        and find the right one for you
                    </h1>
                    {/*  <button className="border-2 border-black px-6 py-2">Shop All</button>  */}
                </div>
    
                <div className='flex flex-row flex-wrap transition-all duration-300 overflow-x-scroll p-2 space justify-evenly w-screen pb-10 lg:mt-[-8rem] lg:space-x-10'>
                    {dataItems.map((product, index) => (
                        <div key={index} className='flex flex-col shadow-2xl hover:scale-105 justify-center rounded-[15px] bg-gray-200 p-4 mb-4 items-center transition-all duration-300 max-h-[400px] max-w-[250px]'>
                            <div onClick={() => openItem(product._id)} className="flex flex-col items-center space-y-2 w-full cursor-pointer">
                                <img
                                    className='w-full max-h-40 object-cover'
                                    src={product.imageUrl}
                                    alt={product.name}
                                />
                                <div className='flex flex-col items-start h-[200px] justify-between w-full'>
                                    <h2 className='text-2xl text-start font-semibold opacity-80'>{product.name}</h2>
                                    <p className='opacity-85 text-start'>{product.description}</p>
                                    <div className='flex flex-row justify-between w-full'>
                                        <p className='font-bold text-2xl text-start'>${product.price}</p>
                                        <p className="px-3 py-[5px] bg-black text-white">
                                            Open Item
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
    
    export default Products;
    