/* eslint-disable react-hooks/exhaustive-deps */
'use client'

// Hero.tsx
import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Carousel from '../components/ui/Carousel';
// import Categories from '../components/ui/Categories';
import Products from '../components/ui/Products';
import LatestArrivals from '../components/ui/LatestArrival';
import { ProductDoc } from '@/models/Product';
// import SearchBar from '../components/ui/SearchBar';


function Hero() {
    const [cartItems, setCartItems] = useState<ProductDoc[]>([]);
    const intervalRef = useRef(null);



    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const addToCart = async (item: ProductDoc) => {
        console.log('Attempting to add to cart:', item);
        try {
            const res = await fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ` // Assuming accessToken is correctly included in the session
                },
                body: JSON.stringify({
                    productId: item._id,
                    quantity: 1
                })
            });

            if (!res.ok) {
                throw new Error('Failed to add item to cart. Response not OK.');
            }

            const updatedCart = await res.json();
            setCartItems(updatedCart.items);
            console.log('Item added to cart:', updatedCart);
        } catch (error) {
            console.error("Error adding item to cart:", error);
            alert("Failed to add item to cart.");
        }
    };


    return (
        <div className='flex flex-col items-center h-screen'>
            <Navbar />
            <div className='flex flex-col items-center'>
                <Carousel />
                {/* <Categories /> */}
                <LatestArrivals addToCart={addToCart} />
                <Products />
            </div>

            <Footer />
        </div>
    );
}

export default Hero;
