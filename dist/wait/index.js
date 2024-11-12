export class Wait {
    static start() {
        const observer = new MutationObserver((events) => {
            events.forEach((event) => {
                event.addedNodes.forEach((addedNode) => {
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        this.listeners.forEach((listener) => {
                            if (addedNode.matches && addedNode.matches(listener.selector)) {
                                listener.callback(addedNode);
                            }
                            addedNode.querySelectorAll(listener.selector).forEach((e) => listener.callback(e));
                        });
                    }
                });
            });
        });
        observer.observe(document.body, {
            subtree: true,
            childList: true,
        });
    }
    static on(selector, callback) {
        if (!this.started) {
            this.start();
            this.started = true;
        }
        document.querySelectorAll(selector).forEach((e) => callback(e));
        this.listeners.push({ selector, callback });
    }
}
Wait.started = false;
Wait.listeners = [];
