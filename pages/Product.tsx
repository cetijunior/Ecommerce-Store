/* eslint-disable @next/next/no-img-element */
import '@/app/globals.css'

import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useRouter } from 'next/router';

const ProductPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState<any>(null); // Specify 'any' type here

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProduct(data.data);
                } else {
                    throw new Error('Failed to fetch product');
                }
            } catch (error) {
                console.error(error);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const addToCart = () => {
        // Implement adding product to cart functionality here
        console.log('Added to cart');
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <img
                        className="w-full rounded-lg shadow-lg"
                        src={product.imageUrl} // Now TypeScript won't throw an error here
                        alt={product.name}
                    />
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                        <p className="mt-2 text-sm text-gray-500">{product.category}</p>
                        <p className="mt-2 text-lg text-gray-900">${product.price.toFixed(2)}</p>
                        <p className="mt-4 text-sm text-gray-600">{product.description}</p>
                        <button
                            className="mt-4 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            onClick={addToCart}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductPage;