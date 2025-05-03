import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCountries } from '../context/CountryContext';
import ProfilePage from '../pages/ProfilePage';

// Mock navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate
}));

// Mock auth context
jest.mock('../context/AuthContext', () => ({
    useAuth: jest.fn()
}));

// Mock country context
jest.mock('../context/CountryContext', () => ({
    useCountries: jest.fn()
}));

// Mock the updateUserProfile function
jest.mock('../services/api', () => ({
    updateUserProfile: jest.fn().mockResolvedValue({ success: true })
}));

describe('ProfilePage', () => {
    beforeEach(() => {
        // Default mocks
        useAuth.mockReturnValue({
            user: {
                username: 'testuser',
                email: 'test@example.com'
            },
            loading: false,
            error: null,
            logout: jest.fn()
        });

        useCountries.mockReturnValue({
            favorites: [
                { countryCode: 'USA', countryName: 'United States', flagUrl: 'usa.svg' }
            ],
            removeFavorite: jest.fn()
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('displays user profile information', () => {
        render(
            <BrowserRouter>
                <ProfilePage />
            </BrowserRouter>
        );

        expect(screen.getByText('testuser')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Edit Profile/i })).toBeInTheDocument();
    });

    test('displays favorite countries', () => {
        render(
            <BrowserRouter>
                <ProfilePage />
            </BrowserRouter>
        );

        expect(screen.getByText('United States')).toBeInTheDocument();
    });

    test('handles logout', async () => {
        const mockLogout = jest.fn().mockResolvedValue(true);

        useAuth.mockReturnValue({
            user: {
                username: 'testuser',
                email: 'test@example.com'
            },
            loading: false,
            error: null,
            logout: mockLogout
        });

        render(
            <BrowserRouter>
                <ProfilePage />
            </BrowserRouter>
        );

        const user = userEvent.setup();
        await user.click(screen.getByText('Logout'));

        await waitFor(() => {
            expect(mockLogout).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });

    test('navigates to country when clicking on favorite', async () => {
        render(
            <BrowserRouter>
                <ProfilePage />
            </BrowserRouter>
        );

        // Assuming countryCode is used in navigation
        const user = userEvent.setup();
        await user.click(screen.getByText('United States'));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/country/USA');
        });
    });
});
