// Sample component or module
class Greeter {
    private readonly greeting: string;

    constructor(message: string) {
        this.greeting = message;
    }

    greet(): string {
        return `Hello, ${this.greeting}!`;
    }
}

// Export for library usage
export const App = {
    Greeter,
    version: '1.0.0'
}; 