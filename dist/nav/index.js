export class Nav {
    static start(options) {
        if (!this.instance) {
            this.instance = new this(options);
        }
        return this.instance;
    }
    constructor(options) {
        this.events = {
            "ready": [],
            "request:before": [],
            "request:after": [],
            "request:redirect": [],
            "request:error": [],
            "content:before": [],
            "content:after": [],
        };
        this.interval = null;
        this.url = null;
        this.history = [];
        this.options = {
            target: null,
            skipExternal: true,
            ignoreSameUrl: false,
            scrollTopOnReady: true,
        };
        this.options = Object.assign(Object.assign({}, this.options), options);
        if (!this.options.target) {
            throw {
                error: "Nav.options.target must be set (its target container element selector)",
            };
        }
        document.addEventListener("click", (event) => {
            let item = null;
            if (event.target instanceof HTMLElement) {
                if (event.target.matches("a[href]")) {
                    item = event.target;
                }
                else if (event.target.closest("a[href]")) {
                    item = event.target.closest("a[href]");
                }
            }
            if (item) {
                if (item.getAttribute("href").startsWith("#") ||
                    item.getAttribute("data-nav-force") !== null ||
                    item.getAttribute("target") !== null) {
                    return;
                }
                const href = item.getAttribute("href");
                item.blur();
                if (this.options.ignoreSameUrl && this.getCurrentUrl() === href) {
                    return;
                }
                event.preventDefault();
                this.nav(href);
            }
        });
        this.setExternals();
        this.on("content:after", (request) => {
            if (this.options.scrollTopOnReady) {
                window.scrollTo(0, 0);
            }
            this.fire("ready", request);
        });
        this.listenUrl();
        this.fire("ready");
        return this;
    }
    listenUrl() {
        this.url = this.getCurrentUrl();
        this.continue();
    }
    fire(event, request = null) {
        this.events[event].forEach((callback) => callback(request));
    }
    handler() {
        let currentUrl = this.getCurrentUrl();
        if (currentUrl !== this.url) {
            this.url = currentUrl;
            this.history.push(this.url);
            this.request(this.url);
        }
    }
    request(url, callback = null) {
        let xmlHttpRequest = this.getXmlHttpRequest();
        xmlHttpRequest.open("GET", url, true);
        xmlHttpRequest.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        const callbackData = { url, xmlHttpRequest };
        this.fire("request:before", callbackData);
        xmlHttpRequest.onprogress = () => {
            if (xmlHttpRequest.responseURL && !this.isEqualUrls(url, xmlHttpRequest.responseURL)) {
                this.setUrl(xmlHttpRequest.responseURL);
                this.fire("request:redirect", callbackData);
            }
        };
        xmlHttpRequest.onload = () => {
            callbackData.responseData = xmlHttpRequest.responseText;
            this.fire("request:after", callbackData);
            this.content(callbackData);
            if (callback) {
                callback(xmlHttpRequest.responseText);
            }
        };
        xmlHttpRequest.send();
    }
    content(request) {
        this.fire("content:before", request);
        document.querySelector(this.options.target).innerHTML = request.responseData;
        this.setExternals();
        this.fire("content:after", request);
    }
    setExternals() {
        if (this.options.skipExternal) {
            document.querySelectorAll("a[href]").forEach((item) => {
                if (item.getAttribute("href").startsWith("http")) {
                    item.setAttribute("target", "_blank");
                }
            });
        }
    }
    setUrl(url) {
        this.pause();
        url = url.replace(location.protocol + "//" + location.hostname, "");
        this.url = url;
        history.pushState({}, null, url);
        if (this.history[this.history.length - 1] !== url) {
            this.history.push(url);
        }
        this.continue();
    }
    getXmlHttpRequest() {
        return new XMLHttpRequest();
    }
    isEqualUrls(requested, response) {
        let index = 0;
        if (response.indexOf("?_=") !== -1) {
            index = response.indexOf("?_=");
        }
        else if (response.indexOf("&_=") !== -1) {
            index = response.indexOf("&_=");
        }
        response = response.replace(location.protocol + "//" + location.host, "");
        if (index) {
            response = response.slice(0, -18);
        }
        return requested === response;
    }
    getCurrentUrl() {
        let url = location.pathname;
        if (location.search.length) {
            url = url + location.search;
        }
        return url;
    }
    reload(callback) {
        this.request(this.url, callback);
    }
    nav(url, callback = null) {
        this.setUrl(url);
        this.request(this.url, callback);
    }
    back() {
        if (this.history.length > 1) {
            this.history.splice(this.history.length - 1);
            let url = this.history[this.history.length - 1];
            this.history.splice(this.history.length - 1);
            this.nav(url);
            return;
        }
        this.nav("/" + location.pathname.split("/")[1]);
    }
    getReferrer() {
        let referrer = "/" + this.url.split("/")[1];
        if (this.history[this.history.length - 2]) {
            referrer = this.history[this.history.length - 2];
        }
        if (referrer.indexOf("/manage/")) {
            referrer = "/" + referrer.split("/")[1];
        }
        return referrer;
    }
    getQueryParams() {
        let params = {};
        if (location.search.length) {
            location.search.substring(1).split("&").forEach((param) => {
                params[param.split("=")[0]] = param.split("=")[1];
            });
        }
        return params;
    }
    getQueryParamsFromString(query) {
        let params = {};
        if (query.length) {
            query.split("?")[1].split("&").forEach((param) => {
                params[param.split("=")[0]] = param.split("=")[1];
            });
        }
        return params;
    }
    getQueryStringFrom(obj) {
        let query = "";
        Object.keys(obj).forEach((key, index) => {
            if (index === 0) {
                query += key + "=" + obj[key];
            }
            else {
                query += "&" + key + "=" + obj[key];
            }
        });
        if (query.length) {
            query = "?" + query;
        }
        return query;
    }
    ready(callback) {
        if (this.options.target) {
            callback();
        }
        this.on("ready", callback);
        return this;
    }
    on(event, handler) {
        this.events[event].push(handler);
        return this;
    }
    pause() {
        clearInterval(this.interval);
    }
    continue() {
        this.interval = setInterval(() => this.handler(), 10);
    }
}
Nav.instance = null;
