export class Cookie {
  private static enc(value: any): string {
    return btoa(encodeURIComponent(JSON.stringify(value)));
  }

  private static dec<T>(value: string): T {
    return JSON.parse(decodeURIComponent(atob(value)));
  }

  public static getQueryStringFrom(obj: { [key: string]: any }): string {
    const query: Array<string> = [];
    Object.keys(obj).forEach((key: string) => {
      query.push(key + "=" + obj[key]);
    });
    return query.join("; ");
  }

  public static get<T>(key: string): T {
    const cookies: { [key: string]: any } = {};
    document.cookie.split(";").map((item) => {
      if (item.length) {
        const cookie = item.toString().split("=");
        cookies[cookie[0].trim()] = cookie[1]?.trim();
      }
    });

    if (cookies[key]) {
      return this.dec(cookies[key]);
    }
    return null;
  }

  public static set<T>(key: string, value: T, lifetime: number = null, options: { [key: string]: any } = {}): void {
    const newCookie = {
      [key]: this.enc(value),
      domain: location.hostname,
      path: "/",
      ...options,
    };

    if (lifetime) {
      newCookie.expires = (new Date(Date.now() + (lifetime * 1000))).toUTCString();
    }
    document.cookie = this.getQueryStringFrom(newCookie);
  }

  public static remove(key: string): void {
    this.set(key, null, -1);
  }
}
