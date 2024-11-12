export class Cookie {
    static enc(value) {
        return btoa(encodeURIComponent(JSON.stringify(value)));
    }
    static dec(value) {
        return JSON.parse(decodeURIComponent(atob(value)));
    }
    static getQueryStringFrom(obj) {
        const query = [];
        Object.keys(obj).forEach((key) => {
            query.push(key + "=" + obj[key]);
        });
        return query.join("; ");
    }
    static get(key) {
        const cookies = {};
        document.cookie.split(";").map((item) => {
            var _a;
            if (item.length) {
                const cookie = item.toString().split("=");
                cookies[cookie[0].trim()] = (_a = cookie[1]) === null || _a === void 0 ? void 0 : _a.trim();
            }
        });
        if (cookies[key]) {
            return this.dec(cookies[key]);
        }
        return null;
    }
    static set(key, value, lifetime = null, options = {}) {
        const newCookie = Object.assign({ [key]: this.enc(value), domain: location.hostname, path: "/" }, options);
        if (lifetime) {
            newCookie.expires = (new Date(Date.now() + (lifetime * 1000))).toUTCString();
        }
        document.cookie = this.getQueryStringFrom(newCookie);
    }
    static remove(key) {
        this.set(key, null, -1);
    }
}
