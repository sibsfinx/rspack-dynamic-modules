import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import DynamicComponent from './DynamicComponent';

describe('DynamicComponent', () => {
    it('renders correctly', () => {
        const { getByText } = render(<DynamicComponent />);
        
        expect(getByText('This is a dynamically imported component!')).toBeTruthy();
        expect(getByText('If you see this, dynamic imports are working correctly.')).toBeTruthy();
    });

    it('has the correct CSS class', () => {
        const { getByText } = render(<DynamicComponent />);
        
        const component = getByText('This is a dynamically imported component!').parentElement;
        expect(component?.classList.contains('dynamic-component')).toBe(true);
    });
}); 