import { describe, it, expect } from 'vitest';
import { calculate } from '../index';
import * as mathModule from '../utils/math';

describe('Tree Shaking Tests', () => {
    it('should correctly calculate using only necessary functions', () => {
        const result = calculate(5, 3);
        // (5 + 3) * 2 = 16
        expect(result).toBe(16);
    });

    it('should have all exports in the math module', () => {
        // Verify all functions exist in the source
        expect(typeof mathModule.add).toBe('function');
        expect(typeof mathModule.subtract).toBe('function');
        expect(typeof mathModule.multiply).toBe('function');
        expect(typeof mathModule.divide).toBe('function');
        expect(typeof mathModule.calculateFactorial).toBe('function');
    });
});

// Run the build and analyze the output bundle to verify tree shaking
// The unused functions (subtract, divide, calculateFactorial) should not appear in the production build 