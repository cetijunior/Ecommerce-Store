/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useRef, useState } from 'react';

interface HeroImg {
    imageUrl: string;
    alt: string;
}

function Carousel() {
    const [images, setImages] = useState<HeroImg[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState('next'); // New state to track the direction of the slide
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
            // eslint-disable-next-line react-hooks/exhaustive-deps
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
            // Remove the transition class to snap the image back after the transition
            setDirection('reset');
        }, 500); // Match the duration to your CSS transition
        return () => clearTimeout(timeoutId);
    }, [currentIndex]);

    return (
        <div className='relative flex flex-col items-center w-screen h-full overflow-hidden'>
            <img
                src={images[currentIndex]?.imageUrl}
                alt={images[currentIndex]?.alt}
                className={`w-screen h-[41rem] object-cover transition-transform duration-500`}
            />
            <a
                onClick={goToPrevious}
                className='absolute left-0 z-10 cursor-pointer'
                style={{ top: '50%', transform: 'translateY(-50%)' }}
            >
                <img src='/arrow.png' alt="Previous" />
            </a>
            <a
                onClick={goToNext}
                className='absolute rotate-180 right-0 z-10 cursor-pointer'
                style={{ top: '50%', transform: 'all translateY(-50%) duration-300 rotate(180deg)' }}
            >
                <img src='/arrow.png' alt="Next" />
            </a>
        </div>
    );
}

export default Carousel;
