/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { ProductDoc } from '@/models/Product';
import { useUser } from '@clerk/clerk-react';

interface Product {
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    inStock: boolean;
}

interface LatestArrivalsProps {
    addToCart: (item: ProductDoc) => void;
}

interface Product {
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    inStock: boolean;
}

interface LatestArrivalsProps {
    addToCart: (item: ProductDoc) => void;
}

const LatestArrivals: React.FC<LatestArrivalsProps> = () => {
    const [dataItems, setDataItems] = useState<ProductDoc[]>([]);
    const [cartItems, setCartItems] = useState<ProductDoc[]>([]);
    const { user } = useUser(); // Correctly use the hook to access user information
    const isLoggedIn = Boolean(user)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/SampleData");
                if (!res.ok) throw new Error("Data could not be fetched");
                const data: ProductDoc[] = await res.json();
                setDataItems(data);
            } catch (error) {
                setDataItems([]); // Consider setting default or empty state
            }
        };

        fetchData();
    }, []);

    const addToCart = (item: ProductDoc) => {
        if (!isLoggedIn) {
            alert("You need to be logged in to add items to the cart.");
            return; // Exit the function if not logged in
        }

        if (item) {
            const existingItemsString = localStorage.getItem('cartItems');
            const existingItems = existingItemsString ? JSON.parse(existingItemsString) : [];

            setDataItems(prevItems => {
                const updatedCartItems = [...prevItems, item];
                const serializedItem = {
                    id: item.id,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    imageUrl: item.imageUrl
                };
                const newItems = [...existingItems, serializedItem];
                localStorage.setItem('cartItems', JSON.stringify(newItems));
                return updatedCartItems;
            });
        }
    };

    const firstThreeItems = dataItems.slice(0, 3);

    return (
        <div className="h-full flex flex-col items-center space-y-8 justify-evenly">
            <div className="flex flex-col items-center space-y-5">
                <h1 className="text-4xl font-semibold pt-14">Latest Arrivals</h1>
                <h1 className="w-[450px] text-center opacity-80">
                    Explore our newest selections curated just for you. <br />
                    Discover the latest trends and timeless designs.
                </h1>
                {/*  <button className="border-2 border-black px-6 py-2">Shop All</button>  */}
            </div>

            <div className="flex flex-row justify-evenly w-screen h-full items-center px-40 space-x-10">
                {firstThreeItems.map((product, index) => (
                    <div
                        key={index}
                        className="flex flex-col shadow-2xl hover:scale-105 transform-all duration-300 rounded-2xl bg-gray-200 p-4 items-end justify-between"
                    >
                        <div className="flex flex-col items-start space-y-2 w-[250px] justify-evenly">
                            <img
                                className="w-full h-auto min-h-60 max-h-96 object-cover"
                                src={product.imageUrl}
                                alt={product.name}
                            />
                            <h2 className="text-xl font-semibold opacity-80">
                                {product.name}
                            </h2>
                            <p className="opacity-85">{product.description}</p>
                            <div className="flex flex-row items-center justify-between w-full ">
                                <p className="font-bold">${product.price}</p>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="mt-auto px-3 py-[5px] bg-black text-white"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LatestArrivals
