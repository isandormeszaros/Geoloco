import { useEffect, useState } from 'react';
import http from '../http';
import { toast } from "react-toastify";
import { useLocation, Link } from 'react-router-dom';

const SearchResult = () => {
    const [searchResults, setSearchResults] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('search');

    const getSearchResults = (searchQuery) => {
        http.get(`/api/search/locations?keyword=${searchQuery}`)
            .then((response) => {
                setSearchResults(response.data);
            })
            .catch((error) => {
                toast.error("Error communicating with the server: ", error);
            });
    };

    useEffect(() => {
        if (searchQuery) {
            getSearchResults(searchQuery);
        }
    }, [searchQuery]);

    console.log(searchResults)

    return (
        <div className="container mx-auto pt-20">
            <h1 className="text-2xl font-bold mt-8 mb-4">Search Results for: {searchQuery}</h1>
            {searchResults.length === 0 ? (
                <div className="flex flex-col items-center h-40">
                    <h1>Nincs megjeleníthető találat</h1>
                    <Link to="/locations" className="text-white relative bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 mt-4">Vissza</Link>
                </div>

            ) : (
                <div className="grid grid-cols-3 gap-4">
                    {searchResults.map((result) => (
                        <div key={result.id} className="bg-white p-4 shadow-lg rounded-md">
                            <h2 className="text-lg font-semibold">{result.name}</h2>
                            <p className="text-gray-600">{result.latitude }, {result.longitude}</p>
                            <p className="text-gray-600">{result.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>

    );
};

export default SearchResult;
