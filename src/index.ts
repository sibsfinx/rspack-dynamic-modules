import { add, multiply } from './utils/math';

// Only using add and multiply, subtract, divide, and calculateFactorial should be tree-shaken
export const calculate = (a: number, b: number): number => {
    const sum = add(a, b);
    const product = multiply(sum, 2);
    return product;
};

console.log('Application started'); 