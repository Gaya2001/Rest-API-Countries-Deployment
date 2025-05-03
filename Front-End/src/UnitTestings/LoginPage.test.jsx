import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import LoginPage from '../pages/LoginPage';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null })
}));

// Mock auth context
jest.mock('../context/AuthContext', () => ({
    useAuth: () => ({
        login: jest.fn().mockImplementation((credentials) => {
            if (credentials.email === 'valid@example.com' && credentials.password === 'password') {
                return Promise.resolve(true);
            }
            return Promise.resolve(false);
        }),
        loading: false,
        error: null
    })
}));

describe('LoginPage', () => {
    test('renders login form', () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    });

    test('displays validation errors', async () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        const user = userEvent.setup();

        // Submit with empty form
        await user.click(screen.getByRole('button', { name: /Login/i }));

        expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();

        // Test invalid email format
        await user.type(screen.getByLabelText(/Email/i), 'invalid-email');
        await user.type(screen.getByLabelText(/Password/i), 'password');
        await user.click(screen.getByRole('button', { name: /Login/i }));

        expect(await screen.findByText(/Invalid email/i)).toBeInTheDocument();
    });

    test('successful login redirects user', async () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );

        const user = userEvent.setup();

        // Fill form with valid data
        await user.type(screen.getByLabelText(/Email/i), 'valid@example.com');
        await user.type(screen.getByLabelText(/Password/i), 'password');
        await user.click(screen.getByRole('button', { name: /Login/i }));

        // Check if navigation occurred
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
        });
    });
});
