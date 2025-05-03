import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import * as api from '../services/api';

jest.mock('../services/api');

describe('Authentication Flow', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('register, login, and view profile', async () => {
        // Mock register and login API calls
        api.registerUser.mockResolvedValueOnce({
            success: true,
            user: { id: '123', username: 'newuser', email: 'new@example.com' }
        });

        api.loginUser.mockResolvedValueOnce({
            success: true,
            user: { id: '123', username: 'newuser', email: 'new@example.com' },
            token: 'fake-token'
        });

        api.getUserProfile.mockResolvedValue({
            success: true,
            user: { id: '123', username: 'newuser', email: 'new@example.com' }
        });

        api.getFavorites.mockResolvedValue({ favoriteCountries: [] });
        api.getAllCountries.mockResolvedValue([]);

        // Start at register page
        render(
            <MemoryRouter initialEntries={['/register']}>
                <App />
            </MemoryRouter>
        );

        // Fill registration form
        const user = userEvent.setup();
        await user.type(screen.getByLabelText(/Username/i), 'newuser');
        await user.type(screen.getByLabelText(/Email/i), 'new@example.com');
        await user.type(screen.getByLabelText(/Password/i), 'password123');
        await user.type(screen.getByLabelText(/Confirm Password/i), 'password123');

        // Submit registration
        await user.click(screen.getByRole('button', { name: /Register/i }));

        // Should be redirected to login page
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /Login/i })).toBeInTheDocument();
        });

        // Log in with new credentials
        await user.type(screen.getByLabelText(/Email/i), 'new@example.com');
        await user.type(screen.getByLabelText(/Password/i), 'password123');
        await user.click(screen.getByRole('button', { name: /Login/i }));

        // After login, navigate to profile
        await waitFor(() => {
            expect(api.loginUser).toHaveBeenCalled();
        });

        // Click profile link in navigation (assuming it exists)
        try {
            await user.click(screen.getByText(/Profile/i));
        } catch (e) {
            // If no navigation exists, mock direct navigation
        }

        // Check profile page content
        await waitFor(() => {
            expect(screen.getByText('newuser')).toBeInTheDocument();
            expect(screen.getByText('new@example.com')).toBeInTheDocument();
        });
    });
});
