import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
    cleanup();
});

// Mock static assets
vi.mock('../assets/test-image.png', () => ({
    default: 'test-image-stub'
}));
vi.mock('../assets/fonts/Roboto-Regular.ttf', () => ({
    default: 'roboto-font-stub'
}));

// Mock style imports
vi.mock('../styles/app.scss', () => ({}));

// Mock dynamic imports
vi.mock('../components/DynamicComponent', async () => {
    const actual = await vi.importActual<typeof import('../components/DynamicComponent')>('../components/DynamicComponent');
    return {
        ...actual,
        __esModule: true,
    };
}); 