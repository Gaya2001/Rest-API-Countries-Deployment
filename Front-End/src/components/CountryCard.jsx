import { Link } from 'react-router-dom';
import { useCountries } from '../context/CountryContext';
import { useAuth } from '../context/AuthContext';

function CountryCard({ country }) {
    const { addFavorite, removeFavorite, isFavorite } = useCountries();
    const { isAuthenticated } = useAuth();

    const formatPopulation = (population) => {
        return population.toLocaleString();
    };




    const handleFavoriteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isFavorite(country.cca3)) {
            removeFavorite(country.cca3);
        } else {
            addFavorite(country);
        }
    };

    return (
        <Link to={`/country/${country.cca3}`}>
            <div className="card hover:scale-105">
                <div className="relative h-40 overflow-hidden">
                    <img
                        src={country.flags.svg}
                        alt={`Flag of ${country.name.common}`}
                        className="w-full h-full object-cover"
                    />

                    {isAuthenticated && (
                        <button
                            onClick={handleFavoriteClick}
                            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill={isFavorite(country.cca3) ? 'currentColor' : 'none'}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                                style={{ color: isFavorite(country.cca3) ? '#dc2626' : '#6b7280' }}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                        </button>
                    )}
                </div>

                <div className="p-4">
                    <h2 className="text-lg font-semibold mb-2">{country.name.common}</h2>

                    <div className="space-y-1 text-sm">
                        <p>
                            <span className="font-medium">Population:</span>{' '}
                            {formatPopulation(country.population)}
                        </p>
                        <p>
                            <span className="font-medium">Region:</span> {country.region}
                        </p>
                        <p>
                            <span className="font-medium">Capital:</span>{' '}
                            {country.capital && country.capital.length > 0
                                ? country.capital.join(', ')
                                : 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default CountryCard;
