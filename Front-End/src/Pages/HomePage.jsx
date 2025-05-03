import { useState } from 'react';
import { useCountries } from '../context/CountryContext';
import CountryCard from '../components/CountryCard';
import Spinner from '../components/Spinner';

function HomePage() {
    const {
        filteredCountries,
        loading,
        error,
        handleRegionFilter,
        regionFilter
    } = useCountries();

    const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <h1 className="text-3xl font-bold mb-4 md:mb-0">Explore Countries</h1>

                <div className="flex items-center space-x-2">
                    <label htmlFor="region-filter" className="text-gray-700">
                        Filter by Region:
                    </label>
                    <select
                        id="region-filter"
                        value={regionFilter}
                        onChange={(e) => handleRegionFilter(e.target.value)}
                        className="input-field w-auto"
                    >
                        <option value="">All Regions</option>
                        {regions.map((region) => (
                            <option key={region} value={region.toLowerCase()}>
                                {region}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-8">
                    <Spinner />
                </div>
            ) : error ? (
                <div className="bg-red-100 text-red-700 p-4 rounded-md">
                    {error}
                </div>
            ) : filteredCountries.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No countries found</p>
                </div>
            )
                : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredCountries.map((country) => (
                            <CountryCard key={country.cca3} country={country} />
                        ))}
                    </div>
                )

            }
        </div>
    );
}

export default HomePage;
