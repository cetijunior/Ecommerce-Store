/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { ProductDoc } from '@/models/Product';
import { useSession } from 'next-auth/react';

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

interface LatestArrivalsProps {
    addToCart: (item: ProductDoc) => void;
}

const LatestArrivals: React.FC<LatestArrivalsProps> = () => {
    const [dataItems, setDataItems] = useState<ProductDoc[]>([]);
    const [cartItems, setCartItems] = useState<ProductDoc[]>([]);
    const { data: session } = useSession();

    useEffect(() => {
        console.log("Session:", session);
    }, [session]);

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

    const addToCart = async (item: ProductDoc) => {
        console.log('Attempting to add to cart:', item);

        if (!session) {
            console.error("Session is not available.");
            alert("You must be logged in to add items to the cart.");
            return;
        }

        if (!session.user.accessToken) {
            console.error("Access token is not available.");
            alert("Access token is missing.");
            return;
        }

        try {
            const res = await fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session.user.accessToken}` // Assuming accessToken is correctly included in the session
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


    const firstThreeItems = dataItems.slice(0, 3);

    return (
        <div className="h-full flex flex-col items-center space-y-8 justify-evenly">
            <div className="flex flex-col items-center space-y-5">
                <h1 className="text-4xl font-semibold pt-14">Latest Arrivals</h1>
                <h1 className="w-[450px] text-center opacity-80">
                    Explore our newest selections curated just for you. <br />
                    Discover the latest trends and timeless designs.
                </h1>
                <button className="border-2 border-black px-6 py-2">Shop All</button>
            </div>

            <div className="flex flex-row justify-evenly w-screen h-full items-center px-40 space-x-10">
                {firstThreeItems.map((product, index) => (
                    <div
                        key={index}
                        className="flex flex-col shadow-2xl hover:scale-105 transform-all duration-300 rounded-2xl bg-gray-200 p-4 items-end justify-between"
                    >
                        <div className="flex flex-col items-start space-y-2 w-[250px] justify-evenly">
                            <img
                                className="w-full h-auto max-h-60 object-cover"
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
                                    className="mt-auto px-3 py-[5px] bg-[#174c55] text-white rounded-md "
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
