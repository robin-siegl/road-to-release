
export class Dialog {
  public static create(content: HTMLElement): HTMLDivElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'dialog-wrapper';

    const panel = document.createElement('div');
    panel.className = 'dialog-panel';
    panel.appendChild(content);

    wrapper.appendChild(panel);
    return wrapper;
  }
}
