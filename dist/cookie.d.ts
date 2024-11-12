export declare class Cookie {
    private static enc;
    private static dec;
    static getQueryStringFrom(obj: {
        [key: string]: any;
    }): string;
    static get<T>(key: string): T;
    static set<T>(key: string, value: T, lifetime?: number, options?: {
        [key: string]: any;
    }): void;
    static remove(key: string): void;
}
