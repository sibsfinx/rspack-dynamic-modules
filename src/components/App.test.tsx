import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

vi.mock('./DynamicComponent', () => ({
    default: () => <div data-testid="dynamic-component">Mocked Dynamic Component</div>
}));

describe('App', () => {
    it('renders the main title', () => {
        const { getByText } = render(<App />);
        expect(getByText('Rspack + React + TypeScript Test')).toBeTruthy();
    });

    it('loads and displays the test image', () => {
        const { getByAltText } = render(<App />);
        const image = getByAltText('Test') as HTMLImageElement;
        expect(image).toBeTruthy();
        expect(image.src).toContain('test-image-stub');
    });

    it('handles dynamic component loading', async () => {
        const user = userEvent.setup();
        const { getByText, queryByTestId } = render(<App />);

        // Initially, dynamic component should not be visible
        expect(queryByTestId('dynamic-component')).toBeNull();

        // Click the load button
        const button = getByText('Load Dynamic Component');
        await user.click(button);

        // Wait for dynamic component to be visible
        await waitFor(() => {
            expect(queryByTestId('dynamic-component')).toBeTruthy();
        });

        // Click again to hide
        await user.click(getByText('Hide Dynamic Component'));
        expect(queryByTestId('dynamic-component')).toBeNull();
    });

    it('applies custom font to the text', () => {
        const { getByText } = render(<App />);
        const customFontText = getByText('This text should use a custom font!');
        expect(customFontText.classList.contains('custom-font')).toBe(true);
    });

    it('has proper section structure', () => {
        const { getByText } = render(<App />);
        expect(getByText('Image Loading Test')).toBeTruthy();
        expect(getByText('Dynamic Import Test')).toBeTruthy();
        expect(getByText('Font Loading Test')).toBeTruthy();
    });
}); 