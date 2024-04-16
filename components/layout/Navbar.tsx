/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';
import SearchBar from '@/components/ui/SearchBar';
import { useRouter } from 'next/router';
import { SignInButton, SignOutButton, SignedIn, SignedOut } from '@clerk/clerk-react';
import { UserButton } from '@clerk/nextjs';
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
        <div className='sticky top-0 z-50 cursor-pointer flex flex-col items-start justify-between border-b-2 border-gray-400 w-full'>
            <div className='flex flex-row items-center w-screen justify-evenly text-sm py-2 bg-black text-white'>
                <h1>USD</h1>
                <h1>Free Shipping on all Orders between 23-28</h1>
                <h1>Support</h1>
            </div>
            <div className='flex flex-row items-start bg-white justify-between p-3 w-screen'>
                <div className='flex flex-row items-center space-x-4'>
                    <Link legacyBehavior href="/">
                        <h1 className='font-bold'>Website</h1>
                    </Link>
                    <SearchBar products={dataItems} onSearch={handleSearch} router={router} />
                </div>

                <div className='flex flex-row items-center space-x-4'>
                    <a onClick={handleCart} className="flex items-center hover:scale-110 transform-all duration-500 space-x-2">
                        <img className="w-5 h-6" src="/cart.png" alt="Cart" />
                    </a>
                    <div className='hover:underline'>
                        <SignedOut>
                            <SignInButton mode="modal" />  {/* Clerk SignInButton for unauthenticated users */}
                        </SignedOut>
                        <SignedIn>
                            <SignOutButton />  {/* Clerk SignOutButton for authenticated users */}
                        </SignedIn>
                    </div>
                    <UserButton />
                </div>
            </div>
        </div>
    );
};

export default Navbar;