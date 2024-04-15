/* eslint-disable @next/next/no-img-element */
import "@/styles/globals.css";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ProductDoc } from '@/models/Product';
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";


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

const Cart: React.FC = () => {
    const [cartItems, setCartItems] = useState<ProductDoc[]>([]);
    const router = useRouter();
    const [subtotal, setSubtotal] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const roundedTotal = total.toFixed(2);
    const roundedSubTotal = subtotal.toFixed(2);



    useEffect(() => {
        // Calculate subtotal
        const sub = cartItems.reduce((acc, item) => acc + item.price, 0);
        setSubtotal(sub);

        // Total is same as subtotal for this example
        setTotal(sub);
    }, [cartItems]);

    useEffect(() => {
        const storedCartItems = localStorage.getItem('cartItems');
        if (storedCartItems) {
            setCartItems(JSON.parse(storedCartItems));
        }
    }, []);

    const removeFromCart = (index: number) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems.splice(index, 1);
        setCartItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const res = await fetch("/api/cartItems");
            if (!res.ok) throw new Error("Data could not be fetched");
            const data: ProductDoc[] = await res.json();
            setCartItems(data);
        } catch (error) {
            console.error(error);
        }
    };

    const openItem = (id: string) => {
        router.push(`/products/${id}`);
    };

    return (
        <div className='flex flex-col h-screen'>
            <Navbar />

            <div className="flex flex-row h-full py-8">
                <div className=" w-1/2 p-8 h-full overflow-y-scroll border-r-2 border-t-2 border-b-2 mb-20">
                    <h2 className="text-4xl font-semibold mb-4">Your Cart</h2>
                    <h2 className="text-xl opacity-60 font-semibold mb-4">Not ready to checkout? Continue Shopping</h2>
                    {cartItems.length > 0 ? (
                        <ul className="divide-y overflow-auto h-full divide-gray-300">
                            {cartItems.map((product, index) => (
                                <li key={index} className="flex flex-row items-center justify-between py-4">
                                    <div className="flex flex-row items-center space-x-4 hover:opacity-70 transform-all duration-300">
                                        <img src={product.imageUrl} alt={product.name} className="w-36 h-36 object-cover rounded" />
                                        <div className="flex flex-col items-start space-y-3 justify-start h-full">
                                            <p className="text-3xl font-bold">{product.name}</p>
                                            <p className="text-gray-500 w-[300px]">{product.description}</p>
                                            <p className="text-2xl font-bold text-gray-800">${product.price}</p>

                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
                                        <h1 className="font-semibold">
                                            by Vendor Name
                                        </h1>
                                        <h1 onClick={() => removeFromCart(index)}
                                            className="underline hover:font-bold cursor-pointer font-semibold">
                                            Remove
                                        </h1>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">Your cart is empty</p>
                    )}
                </div>

                <div className="w-1/2 flex flex-col h-full items-center justify-center">

                    <div className="w-1/2 flex flex-col items-start justify-start mt-24 space-y-5 h-full">
                        <h1 className="text-center text-2xl font-bold">
                            Order Summary
                        </h1>
                        <div className="flex flex-row justify-between w-full">
                            <h1>Subtotal</h1>
                            <h1>${roundedSubTotal}</h1>
                        </div>
                        <div className="flex flex-row justify-between w-full">
                            <h1>Shipping</h1>
                            <h1 className="opacity-80">Calculated at the next step</h1>
                        </div>
                        <div className='w-full border-2 border-black text-white'></div>
                        <div className="flex flex-row justify-between w-full">
                            <h1>Total</h1>
                            <h1>${roundedTotal}</h1>
                        </div>

                        <button className="w-full py-4 bg-black text-white">Continue to checkout</button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Cart;
