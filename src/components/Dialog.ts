export class Dialog {
  public static create(content: HTMLElement): HTMLDivElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'dialog-wrapper';
    wrapper.setAttribute('role', 'dialog');
    wrapper.setAttribute('aria-modal', 'true');

    const panel = document.createElement('div');
    panel.className = 'dialog-panel';
    panel.appendChild(content);
    wrapper.appendChild(panel);
    return wrapper;
  }
}
