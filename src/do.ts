export class Do {
  public static timeout(first: number | Function, second: Function): number {
    if (typeof first === "number") {
      return setTimeout(() => second(), first);
    }
    return setTimeout(() => first(), 0);
  }

  public static interval(ms: number, callback: Function): number {
    let index: number = 0;
    return setInterval(() => {
      callback(index);
      index++;
    }, ms);
  }

  public static until(cond: Function, callback: Function): void {
    const id = this.interval(1, () => {
      if (cond()) {
        callback();
        this.clear(id);
      }
    });
  }

  public static clear(id: number): void {
    clearInterval(id);
  }
}
