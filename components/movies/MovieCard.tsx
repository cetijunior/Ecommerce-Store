import React, { useEffect, useState } from 'react';

interface DataItem {
    _id: string;
    title: string;
    plot: string;
    fullplot: string;
    genres: string[];
    runtime: number;
    cast: string[];
    num_mflix_comments: number;
    poster: string;
    languages: string[];
    released: Date | string; // Depending on how you handle dates
    directors: string[];
    writers: string[];
    awards: {
        wins: number;
        nominations: number;
        text: string;
    };
    lastupdated: string;
    year: number;
    imdb: {
        rating: number;
        votes: number;
        id: number;
    };
    countries: string[];
    type: string;
    tomatoes?: { // The structure of `tomatoes` depends on the available data, an example is provided
        viewer?: {
            rating: number;
            numReviews: number;
            meter: number;
        };
        critic?: {
            rating: number;
            numReviews: number;
            meter: number;
        };
    };
}

interface MovieCardProps {
    data: DataItem;
}

const MovieCard: React.FC<MovieCardProps> = ({ data }) => {
    const [dataItems, setDataItems] = useState<DataItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const currentItem = dataItems[currentIndex];
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/SampleData");
                if (!res.ok) throw new Error("Data could not be fetched");
                const data: DataItem[] = await res.json();
                setDataItems(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div
            className="movie-card hover:scale-105 bg-white shadow-lg rounded overflow-hidden "
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ width: '200px', cursor: 'pointer' }}
        >
            <img src={data.poster} alt={data.title} style={{ width: '200px', height: '300px', objectFit: 'cover' }} />
            <div className="p-4 space-y-8 transition-all duration-700 transform ">
                <h3 className="text-lg transition-all duration-700 transform font-bold">{data.title}</h3>
                <p className={`transition-all duration-700 transform delay-300`}>{isHovered ? data.fullplot : data.plot}</p>
                {isHovered && (
                    <div>
                        <p>Genres: {data.genres.join(', ')}</p>
                        <p>Cast: {data.cast.join(', ')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieCard;
