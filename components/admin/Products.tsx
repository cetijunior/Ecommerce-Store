/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import '@/styles/globals.css'
import { useRouter } from 'next/router';
import Link from 'next/link';
import SearchBar from '@/components/admin/SearchBar';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    inStock: boolean;
}

const Products = () => {
    const router = useRouter();
    const [productId, setProductId] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        filterResults(event.target.value);
    };

    const handleSearch = (query: string) => {
        const filteredProducts = dataItems.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredProducts);
        setSearchTerm(query);
    };


    const filterResults = (term: string) => {
        const filteredResults = dataItems.filter((product: { name: string }) =>
            product.name.toLowerCase().includes(term.toLowerCase())
        );
        setSearchResults(filteredResults);
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



    const openItem = (id: string, name: string, description: string, price: number, category: string, imageUrl: string) => {
        router.push({
            pathname: `/admin/products/${id}`,
            query: {
                name: name,
                description: description,
                price: price,
                category: category,
                imageUrl: imageUrl
            }
        })
    };

    return (
        <div className='h-screen bg-gray-200'>
            <div className='flex flex-col space-y-5 w-full h-fit pb-4 border-b-4 border-gray-600'>
                <h1 className='text-4xl text-center font-semibold pt-14'>
                    Products:
                </h1>
                <div className='flex flex-row justify-center w-screen h-full items-center space-x-4'>
                    <Link legacyBehavior href='/admin/AddProduct'>
                        <button
                            className=' px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'>
                            Add Product
                        </button>
                    </Link>
                    <SearchBar products={dataItems} onSearch={handleSearch} router={router} />
                </div>
            </div>


            <div className='flex sm:flex-row flex-col justify-between w-[80%] rounded-[50px] items-center mx-auto h-fit overflow-y-auto px-10 py-4  mb-10 sm:space-x-10 sm:space-y-0 space-y-10'>
                {dataItems.map((product, index) => (
                    <div key={index} className='flex flex-col shadow-2xl hover:scale-105 rounded-[15px] bg-gray-200 p-4 items-end justify-between transition-all duration-300'>
                        <div key={product._id}
                            onClick={() => openItem(product._id, product.name, product.description, product.price, product.category, product.imageUrl)}
                            className="flex flex-col items-start space-y-2 w-[250px] justify-evenly">
                            <img
                                className='w-full max-h-40 object-cover'
                                src={product.imageUrl}
                                alt={product.name}
                            />
                            <div className='flex flex-col items-start h-[250px] justify-evenly w-full'>
                                <h2 className='text-xl font-semibold opacity-80'>{product.name}</h2>
                                <p className='opacity-85'>{product.description}</p>
                                <p className=''>Category: {product.category}</p>
                                <div className='flex flex-row items-center justify-between w-full '>
                                    <p className='font-bold'>${product.price}</p>
                                </div>
                                <div key={product._id} className='flex felx-row justify-evenly w-full'>
                                    <button onClick={() => handleEdit(product._id, product.name, product.description, product.price, product.category, product.imageUrl)}
                                        className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'>
                                        Edit
                                    </button>

                                    <button onClick={() => handleDelete(product._id)}
                                        className='mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors'>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Products;
