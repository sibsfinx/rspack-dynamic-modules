export const add = (a: number, b: number): number => a + b;

export const subtract = (a: number, b: number): number => a - b;

export const multiply = (a: number, b: number): number => a * b;

export const divide = (a: number, b: number): number => {
    if (b === 0) throw new Error('Division by zero');
    return a / b;
};

// This function will be unused and should be tree-shaken out
export const calculateFactorial = (n: number): number => {
    if (n < 0) throw new Error('Factorial not defined for negative numbers');
    if (n <= 1) return 1;
    return n * calculateFactorial(n - 1);
}; 