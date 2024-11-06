/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react';

interface HeroImg {
    imageUrl: string;
    alt: string;
}

function Carousel() {
    const [images, setImages] = useState<HeroImg[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState('next');
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchImages = async () => {
        try {
            const res = await fetch('/api/HeroPic');
            if (!res.ok) {
                throw new Error('Failed to fetch images');
            }
            const data: HeroImg[] = await res.json();
            setImages(data);
        } catch (error) {
            console.error(error);
        }
    };

    const goToPrevious = () => {
        setDirection('previous');
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setDirection('next');
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    useEffect(() => {
        fetchImages();
    }, []);

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const getSlideStyles = () => {
        if (direction === 'next') {
            return 'translate-x-full';
        } else {
            return '-translate-x-full';
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDirection('reset');
        }, 500); // Match the duration to your CSS transition
        return () => clearTimeout(timeoutId);
    }, [currentIndex]);

    const handleDoubleClick = () => {
        goToNext();
    };

    return (
        <div className='relative flex flex-col mt-6 items-center w-full h-full overflow-hidden'>
            <img
                src={images[currentIndex]?.imageUrl}
                alt={images[currentIndex]?.alt}
                className={`w-full h-screen object-cover transition-transform duration-500`}

            />
            <div onDoubleClick={handleDoubleClick} className='absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50'>
                <div className='flex h-full flex-col items-center justify-evenly space-y-72'>
                    <div className='absolute top-16 flex flex-col items-center justify-center'>
                        <h1 className='text-white text-6xl font-bold'>Welcome to Green Market</h1>
                        <p className='text-white text-2xl mt-4'>Your one-stop shop for all things eco-friendly and sustainable.</p>
                    </div>
                    <div className='flex flex-col items-center justify-center'>
                        <p className='absolute text-white text-2xl bottom-4'>Your one-stop shop for all things eco-friendly and sustainable.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Carousel;
