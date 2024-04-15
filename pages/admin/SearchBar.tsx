/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl: string;
    inStock: boolean;
}

interface SearchBarProps {
    products: Product[];
    onSearch: (query: string) => void;
    router: any; // Type from Next.js router
}

const SearchBar: React.FC<SearchBarProps> = ({ products, onSearch, router }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchTerm(query);
        onSearch(query);
        setShowDropdown(query.length > 0);
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
        setShowDropdown(false);
    };

    const calculateLevenshteinDistance = (a: string, b: string): number => {
        const matrix = [];

        // Initialize the matrix
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }

        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }

        // Fill in the matrix
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        Math.min(
                            matrix[i][j - 1] + 1, // insertion
                            matrix[i - 1][j] + 1 // deletion
                        )
                    );
                }
            }
        }

        return matrix[b.length][a.length];
    };

    const sortItemsBySimilarity = (query: string): Product[] => {
        return products.slice().sort((a, b) => {
            const positionA = a.name.toLowerCase().indexOf(query.toLowerCase());
            const positionB = b.name.toLowerCase().indexOf(query.toLowerCase());

            // If query appears earlier in the name of 'a', it should come before 'b'
            if (positionA !== -1 && positionB === -1) return -1;
            // If query appears earlier in the name of 'b', it should come after 'a'
            if (positionB !== -1 && positionA === -1) return 1;

            // If query appears earlier in both names, sort based on the position
            if (positionA !== -1 && positionB !== -1) {
                return positionA - positionB;
            }

            // If query doesn't appear in either name, sort alphabetically
            return a.name.localeCompare(b.name);
        });
    };
    const sortedProducts = sortItemsBySimilarity(searchTerm);

    return (
        <div className='relative'>
            <div className='flex flex-row items-center space-x-4 border-2 border-gray-700 rounded-md'>
                {/* <img className='w-6 h-6' src='/search.png' alt='Search'></img> */}
                <input
                    type="text"
                    placeholder="🔍 Search... "
                    value={searchTerm}
                    onChange={handleInputChange}
                    className='text-lg rounded-md items-end border-none p-1 w-full'
                />
            </div>
            {showDropdown && (
                <div className='absolute z-10 mt-5 ml-5 w-full bg-white rounded-md shadow-lg'>
                    <ul className='py-1'>
                        {sortedProducts.map(product => (
                            <li
                                key={product._id}
                                onClick={() => openItem(product._id, product.name, product.description, product.price, product.category, product.imageUrl)}
                                className='px-4 py-2 flex items-center hover:bg-gray-100 cursor-pointer'
                            >
                                <img src={product.imageUrl} alt={product.name} className='w-8 h-8 object-center mr-2' />
                                <span>{product.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
