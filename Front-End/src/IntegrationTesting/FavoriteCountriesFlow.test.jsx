import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import * as api from '../services/api';

jest.mock('../services/api');

describe('Favorites Management Flow', () => {
    const mockCountries = [
        {
            cca3: 'USA',
            name: { common: 'United States' },
            flags: { svg: 'usa.svg' }
        },
        {
            cca3: 'CAN',
            name: { common: 'Canada' },
            flags: { svg: 'canada.svg' }
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock authentication
        api.getUserProfile.mockResolvedValue({
            success: true,
            user: { id: '123', username: 'testuser', email: 'test@example.com' }
        });

        api.getAllCountries.mockResolvedValue(mockCountries);
        api.getFavorites.mockResolvedValue({ favoriteCountries: [] });
    });

    test('user can add and remove countries from favorites', async () => {
        // Mock favorite API responses
        api.addToFavorites.mockResolvedValueOnce({
            success: true,
            favoriteCountries: [
                { countryCode: 'USA', countryName: 'United States', flagUrl: 'usa.svg' }
            ]
        });

        api.removeFromFavorites.mockResolvedValueOnce({
            success: true,
            favoriteCountries: []
        });

        // Render app starting at home page
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );

        // Wait for countries to load
        await waitFor(() => {
            expect(screen.getByText('United States')).toBeInTheDocument();
        });

        // Click favorite button on first country
        const user = userEvent.setup();
        const favoriteButtons = await screen.findAllByRole('button', { name: /favorite/i });
        await user.click(favoriteButtons[0]);

        // Verify API call was made
        await waitFor(() => {
            expect(api.addToFavorites).toHaveBeenCalledWith({
                countryCode: 'USA',
                countryName: 'United States',
                flagUrl: 'usa.svg'
            });
        });

        // Navigate to profile
        await user.click(screen.getByText(/Profile/i));

        // Check if favorite is displayed
        await waitFor(() => {
            expect(screen.getByText('United States')).toBeInTheDocument();
        });

        // Remove from favorites
        const removeButton = screen.getByRole('button', { name: /✕/i });
        await user.click(removeButton);

        // Verify API call
        await waitFor(() => {
            expect(api.removeFromFavorites).toHaveBeenCalledWith('USA');
        });
    });
});
