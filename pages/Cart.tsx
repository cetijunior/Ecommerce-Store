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
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <div className="flex flex-col lg:flex-row flex-grow">
                {/* Cart Items */}
                <div className="lg:w-1/2 bg-white p-8 border-b lg:border-b-0 lg:border-r">
                    <h2 className="text-3xl font-semibold mb-6">Your Cart</h2>
                    {cartItems.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {cartItems.map((product, index) => (
                                <li key={index} className="py-6 flex flex-row items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <img src={product.imageUrl} alt={product.name} className="w-24 h-24 object-cover rounded-md" />
                                        <div>
                                            <h3 className="text-lg font-semibold">{product.name}</h3>
                                            <p className="text-sm text-gray-500  max-w-[350px]">{product.description}</p>
                                            <p className="text-lg font-semibold">${product.price}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => removeFromCart(index)} className="text-red-500 hover:text-red-600 underline">Remove</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">Your cart is empty</p>
                    )}
                </div>

                {/* Order Summary */}
                <div className="lg:w-1/2 bg-gray-100 p-8 border-b lg:border-b-0">
                    <h2 className="text-3xl font-semibold mb-6">Order Summary</h2>
                    <div className="flex flex-col space-y-4">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${roundedSubTotal}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span className="text-sm text-gray-500">Calculated at the next step</span>
                        </div>
                        <div className="border-t border-gray-300"></div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Total</span>
                            <span className="font-semibold">${roundedTotal}</span>
                        </div>
                        <button className="w-full py-3 bg-black text-white font-semibold rounded hover:bg-gray-900 transition-colors duration-300">Continue to checkout</button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}

export default Cart;