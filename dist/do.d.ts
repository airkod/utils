export declare class Do {
    static timeout(first: number | Function, second: Function): number;
    static interval(ms: number, callback: Function): number;
    static until(cond: Function, callback: Function): void;
    static clear(id: number): void;
}
