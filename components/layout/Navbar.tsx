/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';
import SearchBar from '@/components/ui/SearchBar';
import { useRouter } from 'next/router';
import { SignInButton, SignOutButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { UserButton } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';


interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    inStock: boolean;
}

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [dataItems, setDataItems] = useState<Product[]>([]);
    const [cartItems, setCartItems] = useState<Product[]>([]);
    const router = useRouter();

    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user } = useUser();
    const isLoggedIn = Boolean(user)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/SampleData");
                if (!res.ok) throw new Error("Data could not be fetched");
                const data = await res.json();
                setDataItems(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const handleSearch = (query: string) => {
        const filteredProducts = dataItems.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredProducts);
        setSearchTerm(query);
    };

    const handleCart = () => {
        if (!isLoggedIn) {
            alert("You need to be logged in to open the Cart",)
            console.log(user);
            return;
        }
        router.push('/Cart');
    };


    return (
        <nav className="fixed top-0 z-50 w-full bg-white shadow-md transform-all duration-300">
            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <Link href="/" passHref>
                            <h1 className='font-bold cursor-pointer'>Website</h1>
                        </Link>
                    </div>
                    <div className="flex">
                        <div className="hidden lg:flex lg:items-center lg:ml-6">
                            <SearchBar products={dataItems} onSearch={handleSearch} router={router} />
                        </div>
                        <div className="ml-6 flex items-center">
                            <a onClick={handleCart} className="text-gray-500 hover:text-gray-700">
                                <img className="w-5 h-6" src="/cart.png" alt="Cart" />
                            </a>
                            <div className='ml-4'>
                                <SignedOut>
                                    <SignInButton mode="modal">Sign in</SignInButton>
                                </SignedOut>
                                {/*class="bg-gray-100 text-gray-800 rounded-md px-4 py-2" */}
                            </div>
                            {/*className="ml-4" */}
                            <UserButton />
                        </div>
                    </div>
                </div>
            </div>
            <div className="lg:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1">
                    <SearchBar products={dataItems} onSearch={handleSearch} router={router} />
                </div>
            </div>
        </nav>
    );
}

export default Navbar;