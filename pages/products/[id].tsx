import '@/app/globals.css'
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import '@/app/globals.css'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ProductDoc } from '@/models/Product';

const ProductPage = () => {
    const router = useRouter();
    const { id } = router.query;
    const [product, setProduct] = useState(null);
    const [cartItems, setCartItems] = useState<ProductDoc[]>([]);

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

    const addToCart = (item: ProductDoc) => {
        // Check if the item is not empty
        if (item) {
            setCartItems(prevItems => {
                const updatedCartItems = [...prevItems, item];
                // Serialize only the necessary properties
                const serializedItems = updatedCartItems.map(item => ({
                    id: item.id, // Assuming 'id' is the unique identifier of the product
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



    if (!product) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <img
                        className="w-full rounded-lg shadow-lg"
                        src={product.imageUrl}
                        alt={product.name}
                    />
                    <div className='flex flex-col h-full justify-evenly'>
                        {product && (
                            <>
                                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                                <p className="mt-2 text-sm text-gray-500">{product.category}</p>
                                <p className="mt-2 text-lg text-gray-900">${product.price.toFixed(2)}</p>
                                <p className="mt-4 text-sm text-gray-600">{product.description}</p>
                                <button
                                    className="mt-4 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black"
                                    onClick={() => addToCart(product)}
                                >
                                    Add to Cart
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProductPage;
