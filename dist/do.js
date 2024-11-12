export class Do {
    static timeout(first, second) {
        if (typeof first === "number") {
            return setTimeout(() => second(), first);
        }
        return setTimeout(() => first(), 0);
    }
    static interval(ms, callback) {
        let index = 0;
        return setInterval(() => {
            callback(index);
            index++;
        }, ms);
    }
    static until(cond, callback) {
        const id = this.interval(1, () => {
            if (cond()) {
                callback();
                this.clear(id);
            }
        });
    }
    static clear(id) {
        clearInterval(id);
    }
}
