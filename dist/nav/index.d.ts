import { Options } from "./interface/options";
export declare class Nav {
    private static instance;
    static start(options: Options): Nav;
    private events;
    private interval;
    private url;
    private history;
    private readonly options;
    private constructor();
    private listenUrl;
    private fire;
    private handler;
    private request;
    private content;
    private setExternals;
    private setUrl;
    private getXmlHttpRequest;
    private isEqualUrls;
    getCurrentUrl(): string;
    reload(callback: Function): void;
    nav(url: string, callback?: Function): void;
    back(): void;
    getReferrer(): string;
    getQueryParams(): {
        [key: string]: string;
    };
    getQueryParamsFromString(query: string): any;
    getQueryStringFrom(obj: any): string;
    ready(callback: Function): this;
    on(event: string, handler: Function): this;
    pause(): void;
    continue(): void;
}
