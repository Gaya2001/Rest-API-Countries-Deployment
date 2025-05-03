import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCountries } from '../context/CountryContext';

function Header() {
    const { isAuthenticated, user, logout } = useAuth();
    const { handleSearch, searchTerm } = useCountries();
    const [searchInput, setSearchInput] = useState(searchTerm);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        setSearchInput(e.target.value);
        handleSearch(e.target.value);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="bg-gray-800 text-white shadow-lg py-4">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="flex justify-between items-center mb-4 md:mb-0">
                        <Link to="/" className="text-3xl font-extrabold text-blue-500">
                            GeoView
                        </Link>
                        <button
                            className="md:hidden text-white hover:text-blue-500"
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="w-7 h-7"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    <div className={`${isMenuOpen ? 'block' : 'hidden'} md:flex md:items-center md:space-x-6`}>
                        <div className="mb-4 md:mb-0">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search countries..."
                                    value={searchInput}
                                    onChange={handleSearchChange}
                                    className="input-field md:w-64 px-4 py-2 rounded-full border-2 text-black border-gray-300 focus:border-blue-500 focus:outline-none transition duration-200"
                                />

                            </div>
                        </div>

                        <nav>
                            <ul className="flex flex-col md:flex-row md:space-x-6 space-y-2 md:space-y-0">
                                <li>
                                    <Link to="/" className="text-white hover:text-blue-500 transition duration-200">
                                        Home
                                    </Link>
                                </li>
                                {isAuthenticated ? (
                                    <>
                                        <li>
                                            <Link to="/profile" className="text-white hover:text-blue-500 transition duration-200">
                                                Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <button
                                                onClick={handleLogout}
                                                className="text-white hover:text-blue-500 transition duration-200"
                                            >
                                                Logout
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li>
                                            <Link to="/login" className="text-white hover:text-blue-500 transition duration-200">
                                                Login
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/register" className="text-white hover:text-blue-500 transition duration-200">
                                                Register
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
