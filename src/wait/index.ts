import { Callback } from "./interface/callback";

export class Wait {
  private static started: boolean = false;

  private static listeners: Array<Callback> = [];

  private static start() {
    const observer = new MutationObserver((events) => {
      events.forEach((event) => {
        event.addedNodes.forEach((addedNode: any) => {
          if (addedNode.nodeType === Node.ELEMENT_NODE) {
            this.listeners.forEach((listener: Callback) => {
              if (addedNode.matches && addedNode.matches(listener.selector)) {
                listener.callback(addedNode);
              }
              addedNode.querySelectorAll(listener.selector).forEach((e: Callback) => listener.callback(e));
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

  static on(selector: string, callback: Function) {
    if (!this.started) {
      this.start();
      this.started = true;
    }
    document.querySelectorAll(selector).forEach((e) => callback(e));
    this.listeners.push({ selector, callback });
  }
}
