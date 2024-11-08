/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Import useRouter hook from Next.js
import Products from '../../components/admin/Products'; // Import the Products component
import AdminLogin from './AdminLogin'; // Import the AdminLogin component
import { UserProfile, useUser } from '@clerk/nextjs';
import { SignInButton, SignOutButton, SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import '@/styles/globals.css'; // Import global styles

const AdminPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status
    const [username, setUsername] = useState(''); // State to store username
    const router = useRouter(); // Initialize the useRouter hook

    // Function to handle login
    const handleLogin = (username: any) => {
        // Perform login logic here, if needed
        setUsername(username);
        setIsLoggedIn(true);
        localStorage.setItem('adminUser', username); // Store the username in localStorage
    };

    // Function to handle logout
    const handleLogout = () => {
        // Perform logout logic here, if needed
        localStorage.removeItem('adminUser'); // Remove the stored username from localStorage
        setIsLoggedIn(false);
        router.push('/admin/Admin'); // Redirect to the login page
    };

    // Check if the user is already logged in when the component mounts
    useEffect(() => {
        const loggedInUser = localStorage.getItem('adminUser');
        if (loggedInUser) {
            setUsername(loggedInUser);
            setIsLoggedIn(true);
        }
    }, []);

    return (
        <div className='flex flex-col min-h-screen bg-gray-200'>
            <header className="bg-gray-800 p-4 py-10 sm:pt-4 shadow">
                <div className="container mx-auto flex justify-between items-center">
                    <div className='flex flex-row space-x-4 items-center'>
                        <h1 className="text-white text-2xl font-semibold">Admin Dashboard</h1>
                        <UserButton />
                    </div>
                    <div className="flex flex-row space-x-4 items-center">
                        <button onClick={handleLogout} className='py-2 px-4 rounded focus:outline-none focus:shadow-outline bg-red-500 hover:bg-red-700 text-white font-bold'>LogOut</button>
                    </div>
                </div>
            </header>
            <div className="container mx-auto  -mt-10 py-4">
                {/* Conditionally render AdminLogin or Products based on login status */}
                {isLoggedIn ? (
                    <Products />
                ) : (
                    <AdminLogin onLogin={handleLogin} />
                )}
            </div>
        </div>
    );
};

export default AdminPage;
