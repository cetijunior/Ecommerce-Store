/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

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


export function Movies() {
    const [movies, setMovies] = useState<DataItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/SampleData");
                if (!res.ok) throw new Error("Data could not be fetched");
                const data: DataItem[] = await res.json();
                setMovies(data); // Set the fetched data to 'movies'
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1>Some Movies are: </h1>
            <div className="grid grid-cols-4 gap-4">
                {movies.map((movie) => (
                    <MovieCard key={movie._id} data={movie} />
                ))}
            </div>
        </div>
    );
}

export default Movies;