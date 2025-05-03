import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [formErrors, setFormErrors] = useState({});
    const { login, loading, error } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const validateForm = () => {
        const errors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.email) errors.email = 'Email is required';
        else if (!emailRegex.test(formData.email)) errors.email = 'Invalid email';

        if (!formData.password) errors.password = 'Password is required';

        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) return setFormErrors(errors);

        const success = await login(formData);
        if (success) navigate(from, { replace: true });
    };

    return (
        <div className="max-w-md mx-auto bg-white p-10 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Login to Your Account</h1>

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full p-3 border-2 rounded-lg transition duration-200 ${formErrors.email ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                        placeholder="Enter your email"
                    />
                    {formErrors.email && <p className="text-red-600 text-sm mt-1">{formErrors.email}</p>}
                </div>

                {/* Password Field */}
                <div>
                    <label htmlFor="password" className="block text-gray-700 font-medium">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full p-3 border-2 rounded-lg transition duration-200 ${formErrors.password ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}`}
                        placeholder="Enter your password"
                    />
                    {formErrors.password && <p className="text-red-600 text-sm mt-1">{formErrors.password}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg focus:outline-none hover:bg-blue-700 transition duration-200"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
                <p className="text-gray-600">
                    Don’t have an account?{' '}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
