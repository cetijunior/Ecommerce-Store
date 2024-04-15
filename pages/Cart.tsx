/* eslint-disable @next/next/no-img-element */
import { useSession } from "next-auth/react";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";


interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    inStock: boolean;
}

const Cart: React.FC = () => {
    const [cartItems, setCartItems] = useState<Product[]>([]);
    const router = useRouter();
    const [subtotal, setSubtotal] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const roundedTotal = total.toFixed(2);
    const roundedSubTotal = subtotal.toFixed(2);
    const { data: session } = useSession();


    useEffect(() => {
        if (status === "authenticated") {
            fetchCartItems();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]); // Depend on status to make sure it runs once the session is confirmed

    const fetchCartItems = async () => {
        if (!session) {
            console.error("No session found. User is probably not logged in.");
            return;
        }

        // Safely access accessToken using optional chaining
        const accessToken = session.user?.accessToken;
        if (!accessToken) {
            console.error("Access token is missing in the session.");
            return;
        }

        try {
            const res = await fetch("/api/cartItems", {
                headers: {
                    Authorization: `Bearer ${accessToken}`  // Now safely using accessToken
                }
            });
            if (!res.ok) throw new Error("Data could not be fetched");
            const data: Product[] = await res.json();
            setCartItems(data);
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        // Calculate subtotal
        const sub = cartItems.reduce((acc, item) => acc + item.price, 0);
        setSubtotal(sub);
        // Total is same as subtotal for this example
        setTotal(sub);
    }, [cartItems]);

    const removeFromCart = async (index: number) => {
        if (!session) {
            console.error("No session found. User is probably not logged in.");
            return;
        }

        const product = cartItems[index];
        const updatedCartItems = [...cartItems];
        updatedCartItems.splice(index, 1);
        setCartItems(updatedCartItems);

        try {
            await fetch("/api/cartItems", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session?.user?.accessToken}`,
                },
                body: JSON.stringify({ productId: product._id }),
            });
        } catch (error) {
            console.error("Failed to remove item from cart:", error);
        }
    };


    return (
        <div className='flex flex-col h-screen'>
            <Navbar />

            <div className="flex flex-row h-full py-8">
                <div className=" w-1/2 p-8">
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
