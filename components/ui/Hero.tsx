'use client'

// Hero.tsx
import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import Carousel from './Carousel';
import Categories from './Categories';
import Products from './Products';
import LatestArrivals from './LatestArrival';
import { ProductDoc } from '@/models/Product';


function Hero() {
    const [cartItems, setCartItems] = useState<ProductDoc[]>([]);
    const intervalRef = useRef(null);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const addToCart = (item: ProductDoc) => {
        // Check if the item is not empty
        if (item) {
            setCartItems(prevItems => {
                const updatedCartItems = [...prevItems, item];
                // Serialize only the necessary properties
                const serializedItems = updatedCartItems.map(item => ({
                    id: item.id, // Assuming 'id' is the unique identifier of the product
                    name: item.name,
                    price: item.price,
                    imageUrl: item.imageUrl
                    // Add other necessary properties as needed
                }));
                // Retrieve existing items from localStorage
                const existingItemsString = localStorage.getItem('cartItems');
                const existingItems = existingItemsString ? JSON.parse(existingItemsString) : [];
                // Concatenate the new items with the existing items
                const newItems = existingItems.concat(serializedItems);
                // Update localStorage with the new concatenated items
                localStorage.setItem('cartItems', JSON.stringify(newItems));
                return updatedCartItems;
            });
        }
    };

    return (
        <div className='flex flex-col items-center h-screen'>
            <Navbar /> {/* Pass cart item count */}
            <div className='flex flex-col items-center'>
                <Carousel />
                <Categories />
                <LatestArrivals addToCart={addToCart} />
                <Products />
            </div>
            <Footer />
        </div>
    );
}

export default Hero;
