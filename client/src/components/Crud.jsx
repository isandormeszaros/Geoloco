import { useEffect, useState } from 'react';
import http from '../http';
import { toast, ToastContainer } from "react-toastify";
import queryString from 'query-string';
import { useNavigate } from 'react-router-dom';
import '../output.css';

const Crud = () => {
    const [locations, setLocations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editLocationId, setEditLocationId] = useState(null);
    const navigate = useNavigate();
    const [postData, setPostData] = useState({
        name: '',
        latitude: '',
        longitude: '',
        description: ''
    });

    // GET /api/locations - Az összes elérhető koordináta lekérdezése   
    const getAllLocations = () => {
        http.get(`/api/locations`)
            .then((response) => {
                setLocations(response.data);
            })
            .catch((error) => {
                toast.error("Hiba a szerverrel való kommunikáció során: ", error);
            });
    };

    useEffect(() => {
        getAllLocations();
        toast.success("Sikeres ")
    }, []);

    // DELETE /api/locations/:id - Rekord törlése a táblából
    const deleteLocation = (id) => {
        http.delete(`/api/locations/${id}`)
            .then((response) => {
                setLocations(locations.filter((location) => location.id !== id));
                if (response.data.status === "200") {
                    toast.success("Koordináta sikeresen törölve");
                }
            })
            .catch((error) => {
                toast.error("Hiba a szerverrel való kommunikáció során: ", error);
            });
    };

    const handleDeleleLocation = (id) => {
        deleteLocation(id);
    };

    // POST /api/locations - Új rekord hozzáadása a helyek tablához
    const postLocation = postData => {
        console.log(postData)
        http.post(`api/locations`, postData)
            .then((response) => {
                if (response.status === 200) {
                    setLocations(prev => [...prev, postData]);
                    setPostData({
                        name: '',
                        latitude: '',
                        longitude: '',
                        description: ''
                    });
                }
            })
            .catch((error) => {
                toast.error("Hiba a szerverrel való kommunikáció során: ", error);
            });
    };

    const handleChange = (id, e) => {
        const { value } = e.target;
        setPostData((prevState) => ({ ...prevState, [id]: value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editLocationId) {
            putLocation(editLocationId, postData);
        } else {
            postLocation(postData);
        }
    };

    // PUT /api/locations/:id - Rekord módosítása a táblában
    const putLocation = (id, data) => {
        http.put(`api/locations/${id}`, data)
            .then((response) => {
                if (response.status === 200) {
                    setLocations(locations.map(location => location.id === id ? data : location));
                    setPostData({ name: '', latitude: '', longitude: '', description: '' });
                    setEditLocationId(null);
                    toast.success("Koordináta sikeresen frissítve");
                }
            })
            .catch((error) => {
                toast.error("Hiba a szerverrel való kommunikáció során: ", error);
            });
    };

    const handleEditLocation = (id) => {
        const locationToEdit = locations.find(location => location.id === id);
        setPostData(locationToEdit);
        setEditLocationId(id);
    };

    //GET /api/search/locations - Szűrés helyszín neve alapján
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm !== "") {
            const queryParams = queryString.stringify({ search: searchTerm });
            navigate(`/search?${queryParams}`);
        }
    };

    return (
        <div className='pt-20'>
            {/* SEARCH BAR */}
            <div className="max-w-md mx-auto py-4 px-4 pb-10">
                <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                        placeholder="Search for locations..." required value={searchTerm} onChange={handleSearchChange} />
                    <button type="submit" onClick={handleSearch} className="text-white absolute end-2.5 bottom-2.5 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Search</button>
                </div>
            </div>

            {/* FORM */}
            <form className="max-w-sm mx-auto bg-gray-200 p-4 rounded-md" onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-700">Név</label>
                    <input type="text" value={postData.name} onChange={(e) => handleChange('name', e)} id="name" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                </div>
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-700">Szélesség</label>
                    <input type="number" value={postData.latitude} onChange={(e) => handleChange('latitude', e)} id="latitude" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                </div>
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-700">Hosszúság</label>
                    <input type="number" value={postData.longitude} onChange={(e) => handleChange('longitude', e)} id="longitude" className=" appearance-none shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light" required />
                </div>
                <div className="mb-5">
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-700">Leírás</label>
                    <input type="text" value={postData.description} onChange={(e) => handleChange('description', e)} id="description" className="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />

                </div>
                <button type="submit" className="block w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Mentés</button>
            </form>

            {/* TABLES */}
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-20">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Név
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Szélesség
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Hosszúság
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Leírás
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Edit</span>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Edit</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {locations.map((item) => (
                            <tr className="bg-white border-b white:bg-white-800 white:border-white-700 hover:bg-white-50 dark:hover:bg-gray-600">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-black">
                                    {item.name}
                                </th>
                                <td className="px-6 py-4">
                                    {item.latitude}
                                </td>
                                <td className="px-6 py-4">
                                    {item.longitude}
                                </td>
                                <td className="px-6 py-4">
                                    {item.description}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button type='button' className="font-medium text-green-600 dark:text-green-500 hover:underline" onClick={() => handleEditLocation(item.id)}>   Módosítás</button>
                                </td>
                                <td className="px-6 py-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 hover:dark:text-red-600 cursor-pointer" onClick={() => handleDeleleLocation(item.id)} >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Crud;
