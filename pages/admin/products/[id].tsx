/* eslint-disable @next/next/no-img-element */
import '@/styles/globals.css'
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    inStock: boolean;
}

const ProductPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState<Product | null>(null);
    const [cartItems, setCartItems] = useState<Product[]>([]);

    const [dataItems, setDataItems] = useState<Product[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/SampleData");
                if (!res.ok) throw new Error("Data could not be fetched");
                const data: Product[] = await res.json();
                setDataItems(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

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

    const addToCart = (item: Product) => {
        // Check if the item is not empty
        if (item) {
            setCartItems(prevItems => {
                const updatedCartItems = [...prevItems, item];
                // Serialize only the necessary properties
                const serializedItems = updatedCartItems.map(item => ({
                    id: item._id, // Assuming 'id' is the unique identifier of the product
                    name: item.name,
                    description: item.description,
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

    const handleEdit = (productId: string, productName: string, productDescription: string, productPrice: number, productCategory: string, productImageUrl: string) => {
        router.push({
            pathname: `/admin/EditProduct/${productId}`,
            query: {
                name: productName,
                description: productDescription,
                price: productPrice,
                category: productCategory,
                imageUrl: productImageUrl
            }
        });
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete product');
            // Remove the deleted product from the state
            setDataItems(dataItems.filter((item) => item._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    if (!product) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <div className="absolute justify-start w-full top-1 left-1">
                <Link legacyBehavior href="/admin/Admin">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Back To Admin Page
                    </button>
                </Link>
            </div>
            <div className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <img
                        className="w-full max-h-[500px] object-cover rounded-lg shadow-lg"
                        src={product.imageUrl}
                        alt={product.name}
                    />
                    <div className='flex flex-col h-full justify-evenly'>
                        {product && (
                            <>
                                <h1 className="text-5xl font-bold text-gray-900">{product.name}</h1>
                                <p className="mt-4 text-xl text-gray-900">Description: <br /> {product.description}</p>
                                <p className="mt-2 text-lg text-gray-700">
                                    <span className='font-bold text-black'> Category: </span>  {product.category}</p>
                                <p className="mt-2 text-3xl font-bold text-gray-900">${product.price.toFixed(2)}</p>

                                <div key={product._id} className='flex felx-row justify-evenly space-x-4 w-full'>
                                    <button onClick={() => handleEdit(product._id, product.name, product.description, product.price, product.category, product.imageUrl)}
                                        className='mt-4 px-4 py-2 bg-blue-500 text-white rounded w-full hover:bg-blue-600 transition-colors'>
                                        Edit
                                    </button>

                                    <button onClick={() => handleDelete(product._id)}
                                        className='mt-4 px-4 py-2 bg-red-500 text-white rounded w-full hover:bg-red-600 transition-colors'>
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
