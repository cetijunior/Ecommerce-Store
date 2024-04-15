import { useState, FormEvent } from 'react';
import { signIn, useSession } from "next-auth/react";
import router, { useRouter } from 'next/router';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter(); // Correctly importing and using useRouter


    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();  // Prevent the default form submission behavior
        loginUser(email, password, status);
    };


    async function loginUser(email: string, password: string, status: string) {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, status: 'authenticated' })
            });

            if (response.status !== 200) {
                const errorData = await response.json();
                console.error("Failed to login:", response.status, errorData.message);
                alert(errorData.message || "An error occurred during login");
                return;
            }

            const userData = await response.json();
            console.log("Login successful:", userData);
            router.push(`/ ${status}`);
            window.location.href = '/';

        } catch (error) {
            console.error("Login error:", error);
        }
    }

    const handleLogin = async () => {
        await signIn();
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="bg-white p-6 rounded shadow-md">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Log In
                        </button>
                    </div>
                </form>
                <div className="mt-4">
                    <button
                        onClick={handleLogin}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
}
